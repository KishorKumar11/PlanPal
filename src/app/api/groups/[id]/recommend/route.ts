import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getGroupRecommendations } from "@/lib/openai";
import { TraitScores } from "@/lib/types";

// Per-group: max 10 AI calls per day (protects API spend)
const MAX_RECS_PER_GROUP_PER_DAY = 10;
// Per-user: max 3 AI calls per hour across all groups (prevents abuse)
const MAX_RECS_PER_USER_PER_HOUR = 3;

function windowStart(ms: number) {
  return new Date(Date.now() - ms);
}

function secondsUntilReset(windowMs: number): number {
  return Math.ceil(windowMs / 1000);
}

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const userId = session.user.id;

  // ── 1. Check per-user hourly limit (across all groups) ───────────────────
  const userRecsLastHour = await prisma.recommendation.count({
    where: {
      group: { members: { some: { userId } } },
      createdAt: { gte: windowStart(60 * 60 * 1000) },
      // We track which user triggered the rec by checking membership;
      // use a simpler proxy: count recs on groups this user is in
    },
  });

  if (userRecsLastHour >= MAX_RECS_PER_USER_PER_HOUR) {
    return NextResponse.json(
      { error: `Hourly limit reached — max ${MAX_RECS_PER_USER_PER_HOUR} AI calls per hour per user. Try again later.` },
      {
        status: 429,
        headers: {
          "Retry-After": String(secondsUntilReset(60 * 60 * 1000)),
          "X-RateLimit-Limit": String(MAX_RECS_PER_USER_PER_HOUR),
          "X-RateLimit-Remaining": "0",
          "X-RateLimit-Reset": String(Math.floor((Date.now() + 60 * 60 * 1000) / 1000)),
        },
      }
    );
  }

  // ── 2. Load group + check membership ─────────────────────────────────────
  const group = await prisma.vibeGroup.findUnique({
    where: { id },
    include: {
      members: {
        include: {
          user: {
            select: {
              id: true,
              archetype: true,
              mbtiType: true,
              traitScores: true,
              interests: true,
            },
          },
        },
      },
      recommendations: {
        where: { createdAt: { gte: windowStart(24 * 60 * 60 * 1000) } },
        select: { id: true, createdAt: true },
        orderBy: { createdAt: "asc" },
      },
    },
  });

  if (!group) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const isMember = group.members.some((m) => m.userId === userId);
  if (!isMember) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  // A locked plan must be marked done before a new round can be generated.
  if (group.planStatus === "locked") {
    return NextResponse.json(
      { error: "Mark the current plan as done before generating new ideas." },
      { status: 409 }
    );
  }

  // ── 3. Check per-group daily limit ────────────────────────────────────────
  const groupRecsToday = group.recommendations.length;
  const remaining = MAX_RECS_PER_GROUP_PER_DAY - groupRecsToday;

  if (remaining <= 0) {
    // Tell client when the oldest rec falls out of the 24h window
    const oldestRec = group.recommendations[0];
    const resetAt = oldestRec
      ? Math.floor((oldestRec.createdAt.getTime() + 24 * 60 * 60 * 1000) / 1000)
      : Math.floor((Date.now() + 24 * 60 * 60 * 1000) / 1000);

    return NextResponse.json(
      { error: `Daily limit reached — max ${MAX_RECS_PER_GROUP_PER_DAY} AI calls per group per day.` },
      {
        status: 429,
        headers: {
          "Retry-After": String(resetAt - Math.floor(Date.now() / 1000)),
          "X-RateLimit-Limit": String(MAX_RECS_PER_GROUP_PER_DAY),
          "X-RateLimit-Remaining": "0",
          "X-RateLimit-Reset": String(resetAt),
        },
      }
    );
  }

  // ── 4. Build group profile ────────────────────────────────────────────────
  const archetypes = group.members
    .map((m) => m.user.archetype)
    .filter(Boolean) as string[];

  const mbtiTypes = group.members
    .map((m) => m.user.mbtiType)
    .filter(Boolean) as string[];

  const allInterests = [
    ...new Set(group.members.flatMap((m) => m.user.interests)),
  ];

  const interestCounts = new Map<string, number>();
  for (const m of group.members) {
    for (const i of m.user.interests) {
      interestCounts.set(i, (interestCounts.get(i) ?? 0) + 1);
    }
  }
  const sharedInterests = allInterests.filter(
    (i) => (interestCounts.get(i) ?? 0) >= 2
  );

  const membersWithScores = group.members.filter(
    (m) => m.user.traitScores !== null
  );
  const avgTraits: Record<string, number> = {};
  if (membersWithScores.length > 0) {
    const keys: (keyof TraitScores)[] = [
      "adventurous",
      "social",
      "creative",
      "chill",
      "competitive",
      "foodie",
    ];
    for (const key of keys) {
      const sum = membersWithScores.reduce(
        (acc, m) =>
          acc + ((m.user.traitScores as unknown as TraitScores)[key] ?? 0),
        0
      );
      avgTraits[key] = Math.round(sum / membersWithScores.length);
    }
  }

  // ── 5. Call Anthropic (system prompt is cached after first call) ──────────
  const aiRecs = await getGroupRecommendations({
    memberCount: group.members.length,
    archetypes,
    mbtiTypes,
    sharedInterests,
    allInterests,
    avgTraits,
  });

  if (aiRecs.length === 0) {
    return NextResponse.json(
      { error: "AI returned no recommendations. Please try again." },
      { status: 502 }
    );
  }

  // ── 6. Persist & respond ──────────────────────────────────────────────────
  // Tag this generation as a batch and make it the active one. Previous batches
  // (and their votes) are retained for the daily rate-limit count but are no
  // longer "current", which cleanly resets the voting round.
  const batchId = crypto.randomUUID();

  const saved = await prisma.$transaction([
    ...aiRecs.map((r) =>
      prisma.recommendation.create({
        data: {
          groupId: id,
          batchId,
          title: r.title,
          description: r.description,
          category: r.category,
          reasoning: r.reasoning,
          metadata: {
            price_range: r.price_range,
            duration: r.duration,
            energy_level: r.energy_level,
          },
        },
        include: { votes: true },
      })
    ),
    prisma.vibeGroup.update({
      where: { id },
      data: {
        currentRecBatchId: batchId,
        planStatus: "idle",
        lockedRecommendationId: null,
      },
    }),
  ]);

  // Drop the trailing group-update result; respond with just the new cards.
  const recs = saved.slice(0, aiRecs.length);

  return NextResponse.json(recs, {
    headers: {
      "X-RateLimit-Limit": String(MAX_RECS_PER_GROUP_PER_DAY),
      "X-RateLimit-Remaining": String(remaining - 1),
    },
  });
}

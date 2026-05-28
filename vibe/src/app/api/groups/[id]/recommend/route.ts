import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getGroupRecommendations } from "@/lib/openai";
import { TraitScores } from "@/lib/types";

const MAX_RECS_PER_DAY = 10;

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const group = await prisma.vibeGroup.findUnique({
    where: { id },
    include: {
      members: {
        include: {
          user: {
            select: {
              id: true,
              archetype: true,
              traitScores: true,
              interests: true,
            },
          },
        },
      },
      recommendations: {
        where: {
          createdAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
        },
        select: { id: true },
      },
    },
  });

  if (!group) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const isMember = group.members.some((m) => m.userId === session.user.id);
  if (!isMember) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  if (group.recommendations.length >= MAX_RECS_PER_DAY) {
    return NextResponse.json(
      { error: "Daily recommendation limit reached (10 per day)" },
      { status: 429 }
    );
  }

  const archetypes = group.members
    .map((m) => m.user.archetype)
    .filter(Boolean) as string[];

  const allInterests = [...new Set(group.members.flatMap((m) => m.user.interests))];

  const interestCounts = new Map<string, number>();
  for (const m of group.members) {
    for (const i of m.user.interests) {
      interestCounts.set(i, (interestCounts.get(i) ?? 0) + 1);
    }
  }
  const sharedInterests = allInterests.filter(
    (i) => (interestCounts.get(i) ?? 0) >= 2
  );

  const membersWithScores = group.members.filter((m) => m.user.traitScores !== null);
  const avgTraits: Record<string, number> = {};
  if (membersWithScores.length > 0) {
    const keys: (keyof TraitScores)[] = [
      "adventurous", "social", "creative", "chill", "competitive", "foodie",
    ];
    for (const key of keys) {
      const sum = membersWithScores.reduce(
        (acc, m) => acc + ((m.user.traitScores as unknown as TraitScores)[key] ?? 0),
        0
      );
      avgTraits[key] = Math.round(sum / membersWithScores.length);
    }
  }

  const aiRecs = await getGroupRecommendations({
    memberCount: group.members.length,
    archetypes,
    sharedInterests,
    allInterests,
    avgTraits,
  });

  const saved = await prisma.$transaction(
    aiRecs.map((r) =>
      prisma.recommendation.create({
        data: {
          groupId: id,
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
    )
  );

  return NextResponse.json(saved);
}

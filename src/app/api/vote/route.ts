import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { voteSchema } from "@/lib/validators";
import { allMembersVoted, pickWinningRecommendation } from "@/lib/group-plan";
import { PlanStatus } from "@/lib/types";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const userId = session.user.id;

  const body = await req.json();
  const parsed = voteSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  // Resolve the recommendation -> its group so we can enforce membership,
  // ensure it belongs to the current batch, and evaluate the auto-lock.
  const rec = await prisma.recommendation.findUnique({
    where: { id: parsed.data.recommendationId },
    select: { id: true, groupId: true, batchId: true },
  });
  if (!rec) {
    return NextResponse.json({ error: "Recommendation not found" }, { status: 404 });
  }

  const group = await prisma.vibeGroup.findUnique({
    where: { id: rec.groupId },
    select: {
      id: true,
      planStatus: true,
      currentRecBatchId: true,
      members: { select: { userId: true, joinedAt: true } },
    },
  });
  if (!group) {
    return NextResponse.json({ error: "Group not found" }, { status: 404 });
  }

  if (!group.members.some((m) => m.userId === userId)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  // Voting is closed once a plan is locked.
  if (group.planStatus === "locked") {
    return NextResponse.json(
      { error: "Voting is closed — a plan has already been locked in." },
      { status: 409 }
    );
  }

  // Only vote on the active batch (stale cards from a previous round are inert).
  if (rec.batchId !== group.currentRecBatchId) {
    return NextResponse.json(
      { error: "This recommendation is no longer active." },
      { status: 409 }
    );
  }

  const vote = await prisma.vote.upsert({
    where: {
      recommendationId_userId: {
        recommendationId: parsed.data.recommendationId,
        userId,
      },
    },
    update: { value: parsed.data.value },
    create: {
      recommendationId: parsed.data.recommendationId,
      userId,
      value: parsed.data.value,
    },
  });

  // Re-read the current batch with votes to evaluate the lock.
  const currentRecs = await prisma.recommendation.findMany({
    where: { groupId: group.id, batchId: group.currentRecBatchId },
    select: {
      id: true,
      createdAt: true,
      votes: { select: { userId: true, value: true } },
    },
  });

  let planStatus: PlanStatus = group.planStatus;
  let lockedRecommendationId: string | null = null;

  if (allMembersVoted(group.members, currentRecs)) {
    const winner = pickWinningRecommendation(currentRecs);
    lockedRecommendationId = winner?.id ?? null;
    planStatus = "locked";
    await prisma.vibeGroup.update({
      where: { id: group.id },
      data: { planStatus: "locked", lockedRecommendationId },
    });
  } else if (group.planStatus === "idle") {
    planStatus = "voting";
    await prisma.vibeGroup.update({
      where: { id: group.id },
      data: { planStatus: "voting" },
    });
  }

  return NextResponse.json({ vote, planStatus, lockedRecommendationId });
}

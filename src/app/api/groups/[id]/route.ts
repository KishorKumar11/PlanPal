import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
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
              name: true,
              email: true,
              image: true,
              archetype: true,
              mbtiType: true,
              traitScores: true,
              interests: true,
            },
          },
        },
        orderBy: { joinedAt: "asc" },
      },
      recommendations: {
        include: { votes: true },
        orderBy: { createdAt: "desc" },
      },
      availabilities: { select: { userId: true, date: true } },
      plans: { orderBy: { completedAt: "desc" } },
    },
  });

  if (!group) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const isMember = group.members.some((m) => m.userId === session.user.id);
  if (!isMember) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  // Expose only the active batch as votable cards; older batches stay hidden.
  const recommendations = group.recommendations.filter(
    (r) => r.batchId === group.currentRecBatchId
  );

  return NextResponse.json({ ...group, recommendations });
}

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { voteSchema } from "@/lib/validators";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const parsed = voteSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const vote = await prisma.vote.upsert({
    where: {
      recommendationId_userId: {
        recommendationId: parsed.data.recommendationId,
        userId: session.user.id,
      },
    },
    update: { value: parsed.data.value },
    create: {
      recommendationId: parsed.data.recommendationId,
      userId: session.user.id,
      value: parsed.data.value,
    },
  });

  return NextResponse.json(vote);
}

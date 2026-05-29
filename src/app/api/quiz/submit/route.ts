import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { quizSubmitSchema } from "@/lib/validators";
import { calculateTraitScores } from "@/lib/quiz-data";
import { determineArchetype } from "@/lib/archetypes";
import { blendMbtiTraits } from "@/lib/mbti";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const parsed = quizSubmitSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  // Base trait scores from quiz answers
  const quizTraits = calculateTraitScores(parsed.data.answers);

  // Fetch stored MBTI type to blend into trait scores
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { mbtiType: true },
  });

  // Blend: quiz drives ~75 %, MBTI adjustments refine the rest
  const traitScores = user?.mbtiType
    ? blendMbtiTraits(quizTraits, user.mbtiType)
    : quizTraits;

  const archetype = determineArchetype(traitScores);

  await prisma.user.update({
    where: { id: session.user.id },
    data: {
      archetype: archetype.id,
      traitScores: traitScores as unknown as Record<string, number>,
      quizCompletedAt: new Date(),
      quizUpdatedAt: new Date(),
    },
  });

  return NextResponse.json({ archetype, traitScores });
}

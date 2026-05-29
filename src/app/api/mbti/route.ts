import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { isValidMbtiCode } from "@/lib/mbti";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const code: unknown = body?.mbtiType;

  if (typeof code !== "string" || !isValidMbtiCode(code)) {
    return NextResponse.json({ error: "Invalid MBTI type" }, { status: 400 });
  }

  await prisma.user.update({
    where: { id: session.user.id },
    data: { mbtiType: code.toUpperCase() },
  });

  return NextResponse.json({ mbtiType: code.toUpperCase() });
}

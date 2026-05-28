import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createGroupSchema } from "@/lib/validators";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const groups = await prisma.vibeGroup.findMany({
    where: { members: { some: { userId: session.user.id } } },
    include: {
      members: {
        include: {
          user: {
            select: { id: true, name: true, image: true, archetype: true },
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(groups);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const parsed = createGroupSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const group = await prisma.vibeGroup.create({
    data: {
      name: parsed.data.name,
      description: parsed.data.description,
      createdById: session.user.id,
      members: {
        create: { userId: session.user.id, role: "admin" },
      },
    },
    include: {
      members: {
        include: {
          user: { select: { id: true, name: true, image: true, archetype: true } },
        },
      },
    },
  });

  return NextResponse.json(group, { status: 201 });
}

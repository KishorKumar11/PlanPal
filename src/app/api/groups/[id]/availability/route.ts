import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { availabilitySchema } from "@/lib/validators";
import { pickWinningDate } from "@/lib/group-plan";

const dayToDate = (d: string) => new Date(`${d}T00:00:00.000Z`);
const dateToDay = (d: Date) => d.toISOString().slice(0, 10);

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const userId = session.user.id;
  const { id } = await params;

  const body = await req.json();
  const parsed = availabilitySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const group = await prisma.vibeGroup.findUnique({
    where: { id },
    select: {
      id: true,
      planStatus: true,
      dateWindowStart: true,
      dateWindowEnd: true,
      lockedDate: true,
      members: { select: { id: true, userId: true } },
    },
  });
  if (!group) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const member = group.members.find((m) => m.userId === userId);
  if (!member) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  if (!group.dateWindowStart || !group.dateWindowEnd) {
    return NextResponse.json(
      { error: "No date window has been set yet." },
      { status: 409 }
    );
  }

  // Every submitted day must fall inside the window (string compare is safe for yyyy-mm-dd).
  const winStart = dateToDay(group.dateWindowStart);
  const winEnd = dateToDay(group.dateWindowEnd);
  const dates = [...new Set(parsed.data.dates)];
  if (dates.some((d) => d < winStart || d > winEnd)) {
    return NextResponse.json(
      { error: "A selected day falls outside the date window." },
      { status: 400 }
    );
  }

  // Replace this member's availability wholesale and mark them as submitted.
  await prisma.$transaction([
    prisma.availability.deleteMany({ where: { groupId: id, userId } }),
    ...(dates.length > 0
      ? [
          prisma.availability.createMany({
            data: dates.map((d) => ({ groupId: id, userId, date: dayToDate(d) })),
          }),
        ]
      : []),
    prisma.groupMember.update({
      where: { groupId_userId: { groupId: id, userId } },
      data: { availabilitySubmittedAt: new Date() },
    }),
  ]);

  // Auto-lock the best date once every member has submitted — but never
  // overwrite a date that is already locked (preserves a creator override).
  let lockedDate = group.lockedDate ? dateToDay(group.lockedDate) : null;

  const members = await prisma.groupMember.findMany({
    where: { groupId: id },
    select: { availabilitySubmittedAt: true },
  });
  const allSubmitted =
    members.length > 0 && members.every((m) => m.availabilitySubmittedAt !== null);

  if (allSubmitted && !group.lockedDate) {
    const all = await prisma.availability.findMany({
      where: { groupId: id },
      select: { date: true },
    });
    const best = pickWinningDate(all.map((a) => dateToDay(a.date)));
    if (best) {
      await prisma.vibeGroup.update({
        where: { id },
        data: { lockedDate: dayToDate(best) },
      });
      lockedDate = best;
    }
  }

  return NextResponse.json({
    submittedCount: members.filter((m) => m.availabilitySubmittedAt !== null).length,
    memberCount: members.length,
    allSubmitted,
    lockedDate,
  });
}

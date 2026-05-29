import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  dateWindowSchema,
  setDateSchema,
  planNotesSchema,
} from "@/lib/validators";
import { effectiveManagerId } from "@/lib/group-plan";

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

  const body = await req.json().catch(() => ({}));
  const action = body?.action;

  const group = await prisma.vibeGroup.findUnique({
    where: { id },
    select: {
      id: true,
      createdById: true,
      planStatus: true,
      lockedRecommendationId: true,
      lockedDate: true,
      planNotes: true,
      dateWindowStart: true,
      dateWindowEnd: true,
      members: { select: { userId: true, joinedAt: true } },
    },
  });
  if (!group) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const isMember = group.members.some((m) => m.userId === userId);
  if (!isMember) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const managerId = effectiveManagerId(group.createdById, group.members);
  const isManager = managerId === userId;
  const requireManager = () =>
    NextResponse.json(
      { error: "Only the group organiser can do that." },
      { status: 403 }
    );
  const requireLocked = () =>
    NextResponse.json(
      { error: "No plan is locked in yet." },
      { status: 409 }
    );

  switch (action) {
    // ── Set / change the availability window ────────────────────────────────
    case "setWindow": {
      if (!isManager) return requireManager();
      if (group.planStatus !== "locked") return requireLocked();

      const parsed = dateWindowSchema.safeParse(body);
      if (!parsed.success) {
        return NextResponse.json(
          { error: parsed.error.issues[0]?.message ?? "Invalid window" },
          { status: 400 }
        );
      }

      // Changing the window re-opens date selection for everyone.
      await prisma.$transaction([
        prisma.availability.deleteMany({ where: { groupId: id } }),
        prisma.groupMember.updateMany({
          where: { groupId: id },
          data: { availabilitySubmittedAt: null },
        }),
        prisma.vibeGroup.update({
          where: { id },
          data: {
            dateWindowStart: dayToDate(parsed.data.start),
            dateWindowEnd: dayToDate(parsed.data.end),
            lockedDate: null,
          },
        }),
      ]);
      return NextResponse.json({ ok: true });
    }

    // ── Manually set / override the locked date ─────────────────────────────
    case "setDate": {
      if (!isManager) return requireManager();
      if (group.planStatus !== "locked") return requireLocked();

      const parsed = setDateSchema.safeParse(body);
      if (!parsed.success) {
        return NextResponse.json({ error: "Invalid date" }, { status: 400 });
      }
      if (group.dateWindowStart && group.dateWindowEnd) {
        const d = parsed.data.date;
        if (
          d < dateToDay(group.dateWindowStart) ||
          d > dateToDay(group.dateWindowEnd)
        ) {
          return NextResponse.json(
            { error: "Date falls outside the window." },
            { status: 400 }
          );
        }
      }
      await prisma.vibeGroup.update({
        where: { id },
        data: { lockedDate: dayToDate(parsed.data.date) },
      });
      return NextResponse.json({ ok: true, lockedDate: parsed.data.date });
    }

    // ── Notes — any member may edit ─────────────────────────────────────────
    case "setNotes": {
      if (group.planStatus !== "locked") return requireLocked();
      const parsed = planNotesSchema.safeParse(body);
      if (!parsed.success) {
        return NextResponse.json({ error: "Invalid notes" }, { status: 400 });
      }
      await prisma.vibeGroup.update({
        where: { id },
        data: { planNotes: parsed.data.notes.trim() || null },
      });
      return NextResponse.json({ ok: true });
    }

    // ── Mark the plan done: archive it and reset the group ──────────────────
    case "markDone": {
      if (!isManager) return requireManager();
      if (group.planStatus !== "locked") return requireLocked();
      if (!group.lockedRecommendationId) {
        return NextResponse.json(
          { error: "No locked recommendation to archive." },
          { status: 409 }
        );
      }

      const rec = await prisma.recommendation.findUnique({
        where: { id: group.lockedRecommendationId },
        select: {
          title: true,
          category: true,
          description: true,
          reasoning: true,
          metadata: true,
        },
      });
      if (!rec) {
        return NextResponse.json(
          { error: "Locked recommendation no longer exists." },
          { status: 409 }
        );
      }

      await prisma.$transaction([
        prisma.plan.create({
          data: {
            groupId: id,
            title: rec.title,
            category: rec.category,
            description: rec.description,
            reasoning: rec.reasoning,
            metadata: rec.metadata ?? undefined,
            lockedDate: group.lockedDate,
            notes: group.planNotes,
          },
        }),
        prisma.availability.deleteMany({ where: { groupId: id } }),
        prisma.groupMember.updateMany({
          where: { groupId: id },
          data: { availabilitySubmittedAt: null },
        }),
        prisma.vibeGroup.update({
          where: { id },
          data: {
            planStatus: "idle",
            lockedRecommendationId: null,
            currentRecBatchId: null,
            lockedDate: null,
            dateWindowStart: null,
            dateWindowEnd: null,
            planNotes: null,
          },
        }),
      ]);
      return NextResponse.json({ ok: true });
    }

    default:
      return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  }
}

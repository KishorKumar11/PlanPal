"use client";

import { useState, useEffect, use, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CheckCircle2, Loader2, StickyNote, Trophy } from "lucide-react";
import { GroupWithMembers } from "@/lib/types";
import { effectiveManagerId } from "@/lib/group-plan";
import RecommendationCard from "@/components/RecommendationCard";
import DateAvailabilityGrid from "@/components/DateAvailabilityGrid";
import SharePlanCard from "@/components/SharePlanCard";

const fmtDay = (d: string) =>
  new Date(`${d}T00:00:00.000Z`).toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });

export default function PlanPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [group, setGroup] = useState<GroupWithMembers | null>(null);
  const [userId, setUserId] = useState<string | undefined>();
  const [loading, setLoading] = useState(true);
  const [notes, setNotes] = useState("");
  const [savingNotes, setSavingNotes] = useState(false);
  const [notesSaved, setNotesSaved] = useState(false);
  const [marking, setMarking] = useState(false);

  const reload = useCallback(async () => {
    const g = await fetch(`/api/groups/${id}`).then((r) =>
      r.ok ? r.json() : null
    );
    setGroup(g);
    setNotes(g?.planNotes ?? "");
  }, [id]);

  useEffect(() => {
    let active = true;
    Promise.all([
      fetch(`/api/groups/${id}`).then((r) => (r.ok ? r.json() : null)),
      fetch("/api/auth/session").then((r) => r.json()),
    ]).then(([g, s]) => {
      if (!active) return;
      setGroup(g);
      setNotes(g?.planNotes ?? "");
      setUserId(s?.user?.id);
      setLoading(false);
    });
    return () => {
      active = false;
    };
  }, [id]);

  if (loading) {
    return (
      <main className="min-h-screen pt-6 pb-16 px-4">
        <div className="mx-auto max-w-3xl text-center py-24">
          <Loader2 className="mx-auto animate-spin text-violet" />
        </div>
      </main>
    );
  }

  if (!group || group.planStatus !== "locked") {
    return (
      <main className="min-h-screen pt-6 pb-16 px-4">
        <div className="mx-auto max-w-3xl">
          <Link
            href={`/group/${id}`}
            className="text-text-dim text-sm hover:text-text-bright transition-colors"
          >
            ← Back to group
          </Link>
          <div className="text-center py-20 rounded-2xl border border-white/10 bg-white/5 mt-6">
            <Trophy size={40} className="mx-auto mb-4 text-text-dim" />
            <h2 className="font-display text-xl font-semibold text-text-bright mb-2">
              No plan locked in yet
            </h2>
            <p className="text-text-dim text-sm mb-6">
              Once everyone votes, the winning idea lands here.
            </p>
            <Link
              href={`/group/${id}/vote`}
              className="inline-block rounded-full bg-gradient-vibe px-6 py-2.5 text-sm font-semibold text-white hover:opacity-90 transition-opacity"
            >
              Go to voting →
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const lockedRec = group.recommendations.find(
    (r) => r.id === group.lockedRecommendationId
  );
  const managerId = effectiveManagerId(group.createdById, group.members);
  const isManager = managerId === userId;
  const tally = lockedRec
    ? lockedRec.votes.filter((v) => v.value === 1).length
    : 0;

  const saveNotes = async () => {
    setSavingNotes(true);
    const res = await fetch(`/api/groups/${id}/plan`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "setNotes", notes }),
    });
    setSavingNotes(false);
    if (res.ok) {
      setNotesSaved(true);
      setTimeout(() => setNotesSaved(false), 2000);
    }
  };

  const markDone = async () => {
    if (
      !confirm(
        "Mark this plan as done? It moves to Past Plans and the group resets for a new round."
      )
    )
      return;
    setMarking(true);
    const res = await fetch(`/api/groups/${id}/plan`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "markDone" }),
    });
    setMarking(false);
    if (res.ok) router.push(`/group/${id}`);
  };

  const appUrl =
    typeof window !== "undefined" ? window.location.origin : "planpal.app";
  const dateLabel = group.lockedDate ? fmtDay(group.lockedDate) : "Date TBD";

  return (
    <main className="min-h-screen pt-6 pb-16 px-4">
      <div className="mx-auto max-w-3xl">
        <Link
          href={`/group/${id}`}
          className="text-text-dim text-sm hover:text-text-bright transition-colors"
        >
          ← Back to group
        </Link>

        <div className="mt-4 mb-2 inline-flex items-center gap-2 rounded-full border border-teal-400/30 bg-teal-400/10 px-3 py-1 text-xs font-semibold text-teal-400">
          <Trophy size={13} /> Locked in
        </div>
        <h1 className="font-display text-3xl font-bold gradient-text mb-1">
          {group.name}&apos;s Plan
        </h1>
        <p className="text-text-dim text-sm mb-8">
          The group voted — here&apos;s what you&apos;re doing.
        </p>

        {lockedRec && (
          <div className="mb-6">
            <RecommendationCard recommendation={lockedRec} userId={userId} />
            <p className="mt-2 text-xs text-text-dim">
              {tally} {tally === 1 ? "thumbs up" : "thumbs up"} from the group
            </p>
          </div>
        )}

        <div className="mb-6">
          <p className="text-xs text-text-dim uppercase tracking-widest mb-3">
            Pick a date
          </p>
          <DateAvailabilityGrid
            groupId={id}
            windowStart={group.dateWindowStart}
            windowEnd={group.dateWindowEnd}
            lockedDate={group.lockedDate}
            members={group.members}
            availabilities={group.availabilities}
            currentUserId={userId}
            isManager={isManager}
            onChange={reload}
          />
        </div>

        <div className="mb-6">
          <p className="text-xs text-text-dim uppercase tracking-widest mb-3 flex items-center gap-1.5">
            <StickyNote size={12} /> Notes
          </p>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            maxLength={500}
            rows={3}
            placeholder="Add a venue, address, who's driving, anything…"
            className="w-full rounded-xl border border-white/10 bg-white/5 p-3 text-sm text-text-bright placeholder:text-text-dim/60 focus:border-violet/40 focus:outline-none resize-none"
          />
          <div className="mt-2 flex items-center justify-between">
            <span className="text-xs text-text-dim">{notes.length}/500</span>
            <button
              onClick={saveNotes}
              disabled={savingNotes || notes === (group.planNotes ?? "")}
              className="inline-flex items-center gap-1.5 rounded-full border border-white/15 px-4 py-1.5 text-sm text-text-dim hover:text-text-bright hover:border-violet/40 transition-colors disabled:opacity-40"
            >
              {savingNotes ? (
                <Loader2 size={13} className="animate-spin" />
              ) : notesSaved ? (
                <CheckCircle2 size={13} className="text-teal-400" />
              ) : null}
              {notesSaved ? "Saved" : "Save notes"}
            </button>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-white/10">
          <SharePlanCard
            groupName={group.name}
            title={lockedRec?.title ?? "Our plan"}
            category={lockedRec?.category ?? "activity"}
            dateLabel={dateLabel}
            appUrl={appUrl.replace(/^https?:\/\//, "")}
          />
          {isManager && (
            <button
              onClick={markDone}
              disabled={marking}
              className="inline-flex items-center gap-2 rounded-full bg-gradient-vibe px-5 py-2 text-sm font-semibold text-white hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {marking ? (
                <Loader2 size={15} className="animate-spin" />
              ) : (
                <CheckCircle2 size={15} />
              )}
              Mark as done
            </button>
          )}
        </div>
      </div>
    </main>
  );
}

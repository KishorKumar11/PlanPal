"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Calendar, Check, Loader2, Pencil } from "lucide-react";
import { AvailabilityData, GroupMemberWithUser } from "@/lib/types";
import { pickWinningDate } from "@/lib/group-plan";

const toDay = (iso: string) => iso.slice(0, 10);

function eachDay(start: string, end: string): string[] {
  const days: string[] = [];
  let cur = new Date(`${start}T00:00:00.000Z`);
  const last = new Date(`${end}T00:00:00.000Z`);
  while (cur <= last) {
    days.push(cur.toISOString().slice(0, 10));
    cur = new Date(cur.getTime() + 86_400_000);
  }
  return days;
}

function fmtDay(d: string) {
  return new Date(`${d}T00:00:00.000Z`).toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
}

interface Props {
  groupId: string;
  windowStart: string | null;
  windowEnd: string | null;
  lockedDate: string | null;
  members: GroupMemberWithUser[];
  availabilities: AvailabilityData[];
  currentUserId?: string;
  isManager: boolean;
  onChange: () => void;
}

export default function DateAvailabilityGrid({
  groupId,
  windowStart,
  windowEnd,
  lockedDate,
  members,
  availabilities,
  currentUserId,
  isManager,
  onChange,
}: Props) {
  const hasWindow = !!(windowStart && windowEnd);

  // ── Window setup (manager, before a window exists) ────────────────────────
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [savingWindow, setSavingWindow] = useState(false);
  const [windowError, setWindowError] = useState("");

  const saveWindow = async () => {
    setWindowError("");
    if (!start || !end) return setWindowError("Pick a start and end date.");
    if (start > end) return setWindowError("Start must be before end.");
    const span = (Date.parse(end) - Date.parse(start)) / 86_400_000;
    if (span > 13) return setWindowError("Window can be at most 14 days.");
    setSavingWindow(true);
    const res = await fetch(`/api/groups/${groupId}/plan`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "setWindow", start, end }),
    });
    setSavingWindow(false);
    if (!res.ok) {
      const d = await res.json().catch(() => ({}));
      return setWindowError(d.error ?? "Could not set window.");
    }
    onChange();
  };

  // ── The grid (window exists) ──────────────────────────────────────────────
  const days = useMemo(
    () => (hasWindow ? eachDay(windowStart!, windowEnd!) : []),
    [hasWindow, windowStart, windowEnd]
  );

  const myInitial = useMemo(
    () =>
      new Set(
        availabilities
          .filter((a) => a.userId === currentUserId)
          .map((a) => toDay(a.date))
      ),
    [availabilities, currentUserId]
  );

  const [selected, setSelected] = useState<Set<string>>(myInitial);
  const [submitting, setSubmitting] = useState(false);

  // Count availability per day across everyone *except* me, so I can layer my
  // live selection on top without double counting.
  const othersCount = useMemo(() => {
    const m = new Map<string, number>();
    for (const a of availabilities) {
      if (a.userId === currentUserId) continue;
      const d = toDay(a.date);
      m.set(d, (m.get(d) ?? 0) + 1);
    }
    return m;
  }, [availabilities, currentUserId]);

  const countFor = (d: string) =>
    (othersCount.get(d) ?? 0) + (selected.has(d) ? 1 : 0);

  const submittedCount = members.filter(
    (m) => m.availabilitySubmittedAt !== null
  ).length;

  const bestDate = useMemo(() => {
    const all: string[] = [];
    for (const d of days) {
      const count = (othersCount.get(d) ?? 0) + (selected.has(d) ? 1 : 0);
      for (let i = 0; i < count; i++) all.push(d);
    }
    return pickWinningDate(all);
  }, [days, othersCount, selected]);

  const toggle = (d: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(d)) next.delete(d);
      else next.add(d);
      return next;
    });
  };

  const submit = async () => {
    setSubmitting(true);
    const res = await fetch(`/api/groups/${groupId}/availability`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ dates: [...selected] }),
    });
    setSubmitting(false);
    if (res.ok) onChange();
  };

  // ── Manager override of the locked date ───────────────────────────────────
  const [editingDate, setEditingDate] = useState(false);
  const [overrideDate, setOverrideDate] = useState(lockedDate ?? "");
  const saveOverride = async () => {
    if (!overrideDate) return;
    const res = await fetch(`/api/groups/${groupId}/plan`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "setDate", date: overrideDate }),
    });
    if (res.ok) {
      setEditingDate(false);
      onChange();
    }
  };

  // ── Render ────────────────────────────────────────────────────────────────
  if (!hasWindow) {
    if (!isManager) {
      return (
        <div className="rounded-xl border border-white/10 bg-white/5 p-5 text-center text-sm text-text-dim">
          <Calendar size={20} className="mx-auto mb-2 text-text-dim" />
          Waiting for the organiser to open a date window.
        </div>
      );
    }
    return (
      <div className="rounded-xl border border-white/10 bg-white/5 p-5">
        <p className="text-sm font-medium text-text-bright mb-1">
          Open a date window
        </p>
        <p className="text-xs text-text-dim mb-4">
          Pick a range (max 14 days) — members mark which days work for them.
        </p>
        <div className="flex flex-wrap items-end gap-3">
          <label className="text-xs text-text-dim">
            From
            <input
              type="date"
              value={start}
              onChange={(e) => setStart(e.target.value)}
              className="mt-1 block rounded-lg border border-white/15 bg-cosmos px-3 py-2 text-sm text-text-bright [color-scheme:dark]"
            />
          </label>
          <label className="text-xs text-text-dim">
            To
            <input
              type="date"
              value={end}
              min={start || undefined}
              onChange={(e) => setEnd(e.target.value)}
              className="mt-1 block rounded-lg border border-white/15 bg-cosmos px-3 py-2 text-sm text-text-bright [color-scheme:dark]"
            />
          </label>
          <button
            onClick={saveWindow}
            disabled={savingWindow}
            className="rounded-full bg-gradient-vibe px-5 py-2 text-sm font-semibold text-white hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {savingWindow ? <Loader2 size={15} className="animate-spin" /> : "Open window"}
          </button>
        </div>
        {windowError && (
          <p className="mt-2 text-xs text-red-400">{windowError}</p>
        )}
      </div>
    );
  }

  const maxCount = Math.max(1, members.length);

  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-5">
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm font-medium text-text-bright">When can everyone go?</p>
        <span className="text-xs text-text-dim">
          {submittedCount} of {members.length} submitted
        </span>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2">
        {days.map((d) => {
          const count = countFor(d);
          const mine = selected.has(d);
          const isBest = d === bestDate && count > 0;
          const isLocked = d === lockedDate;
          return (
            <button
              key={d}
              onClick={() => toggle(d)}
              className={`shrink-0 w-20 rounded-xl border p-2 text-center transition-all duration-150 ${
                mine
                  ? "border-violet/60 bg-violet/20"
                  : "border-white/10 bg-white/5 hover:border-white/25"
              } ${isLocked ? "ring-2 ring-teal-400/70" : ""}`}
            >
              <div className="text-[10px] uppercase tracking-wide text-text-dim">
                {new Date(`${d}T00:00:00.000Z`).toLocaleDateString(undefined, {
                  weekday: "short",
                  timeZone: "UTC",
                })}
              </div>
              <div className="text-sm font-semibold text-text-bright">
                {new Date(`${d}T00:00:00.000Z`).toLocaleDateString(undefined, {
                  month: "short",
                  day: "numeric",
                  timeZone: "UTC",
                })}
              </div>
              <div className="mt-2 h-1 rounded-full bg-white/10 overflow-hidden">
                <div
                  className={`h-full rounded-full ${isBest ? "bg-teal-400" : "bg-violet"}`}
                  style={{ width: `${(count / maxCount) * 100}%` }}
                />
              </div>
              <div
                className={`mt-1 text-[10px] ${
                  isBest ? "text-teal-400 font-semibold" : "text-text-dim"
                }`}
              >
                {count}/{members.length}
              </div>
            </button>
          );
        })}
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <button
          onClick={submit}
          disabled={submitting}
          className="inline-flex items-center gap-2 rounded-full bg-gradient-vibe px-5 py-2 text-sm font-semibold text-white hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {submitting ? (
            <Loader2 size={15} className="animate-spin" />
          ) : (
            <Check size={15} />
          )}
          Save my availability
        </button>

        {lockedDate ? (
          <div className="flex items-center gap-2 text-sm">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-teal-400/40 bg-teal-400/10 px-3 py-1 text-teal-400">
              <Calendar size={13} />
              {fmtDay(lockedDate)}
            </span>
            {isManager && !editingDate && (
              <button
                onClick={() => setEditingDate(true)}
                className="inline-flex items-center gap-1 text-xs text-text-dim hover:text-text-bright"
              >
                <Pencil size={12} /> Change
              </button>
            )}
          </div>
        ) : (
          bestDate && (
            <span className="text-xs text-text-dim">
              Best so far: <span className="text-teal-400">{fmtDay(bestDate)}</span>
            </span>
          )
        )}
      </div>

      {isManager && editingDate && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="mt-3 flex items-end gap-2 overflow-hidden"
        >
          <label className="text-xs text-text-dim">
            Set date
            <input
              type="date"
              value={overrideDate}
              min={windowStart ?? undefined}
              max={windowEnd ?? undefined}
              onChange={(e) => setOverrideDate(e.target.value)}
              className="mt-1 block rounded-lg border border-white/15 bg-cosmos px-3 py-2 text-sm text-text-bright [color-scheme:dark]"
            />
          </label>
          <button
            onClick={saveOverride}
            className="rounded-full bg-gradient-vibe px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
          >
            Save
          </button>
          <button
            onClick={() => setEditingDate(false)}
            className="rounded-full border border-white/15 px-4 py-2 text-sm text-text-dim hover:text-text-bright"
          >
            Cancel
          </button>
        </motion.div>
      )}
    </div>
  );
}

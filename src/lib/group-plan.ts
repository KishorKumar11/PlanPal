// Pure helpers for the group plan decision loop.
// Operate on already-fetched data so they can be unit-tested and reused
// across the vote / availability / plan-management routes.

interface VoteLike {
  userId: string;
  value: number;
}

interface RecLike {
  id: string;
  createdAt: Date;
  votes: VoteLike[];
}

interface MemberLike {
  userId: string;
  joinedAt: Date;
}

/** True when every current member has cast at least one vote. */
export function allMembersVoted(
  members: MemberLike[],
  recs: RecLike[]
): boolean {
  if (members.length === 0) return false;
  const voters = new Set<string>();
  for (const r of recs) for (const v of r.votes) voters.add(v.userId);
  return members.every((m) => voters.has(m.userId));
}

/**
 * Highest net score wins. Ties break to the earliest-created recommendation,
 * giving a deterministic winner.
 */
export function pickWinningRecommendation<T extends RecLike>(
  recs: T[]
): T | null {
  if (recs.length === 0) return null;
  return [...recs].sort((a, b) => {
    const sa = a.votes.reduce((s, v) => s + v.value, 0);
    const sb = b.votes.reduce((s, v) => s + v.value, 0);
    if (sb !== sa) return sb - sa;
    return a.createdAt.getTime() - b.createdAt.getTime();
  })[0];
}

/**
 * The member who manages the plan. Normally the creator, but if the creator
 * has left the group it falls through to the longest-standing remaining member.
 */
export function effectiveManagerId(
  createdById: string,
  members: MemberLike[]
): string | null {
  if (members.some((m) => m.userId === createdById)) return createdById;
  const sorted = [...members].sort(
    (a, b) => a.joinedAt.getTime() - b.joinedAt.getTime()
  );
  return sorted[0]?.userId ?? null;
}

/**
 * Day with the most members free. Ties break to the earliest date.
 * Returns yyyy-mm-dd, or null when there is no availability at all.
 */
export function pickWinningDate(dates: string[]): string | null {
  if (dates.length === 0) return null;
  const counts = new Map<string, number>();
  for (const d of dates) counts.set(d, (counts.get(d) ?? 0) + 1);

  let best: string | null = null;
  let bestCount = -1;
  for (const [date, count] of counts) {
    if (count > bestCount || (count === bestCount && best !== null && date < best)) {
      best = date;
      bestCount = count;
    }
  }
  return best;
}

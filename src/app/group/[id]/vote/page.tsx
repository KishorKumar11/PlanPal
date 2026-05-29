"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, Sparkles } from "lucide-react";
import { GroupWithMembers, RecommendationWithVotes } from "@/lib/types";
import RecommendationCard from "@/components/RecommendationCard";

export default function VotePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [group, setGroup] = useState<GroupWithMembers | null>(null);
  const [recs, setRecs] = useState<RecommendationWithVotes[]>([]);
  const [userId, setUserId] = useState<string | undefined>();
  const [loading, setLoading] = useState(true);
  const [justLocked, setJustLocked] = useState(false);

  useEffect(() => {
    let active = true;
    Promise.all([
      fetch(`/api/groups/${id}`).then((r) => (r.ok ? r.json() : null)),
      fetch("/api/auth/session").then((r) => r.json()),
    ]).then(([g, s]) => {
      if (!active) return;
      setGroup(g);
      setRecs(g?.recommendations ?? []);
      setUserId(s?.user?.id);
      setLoading(false);
      if (g?.planStatus === "locked") router.replace(`/group/${id}/plan`);
    });
    return () => {
      active = false;
    };
  }, [id, router]);

  const handleVote = async (recommendationId: string, value: 1 | -1) => {
    const res = await fetch("/api/vote", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ recommendationId, value }),
    });
    if (!res.ok) return;
    const data = await res.json();
    const vote = data.vote;
    setRecs((prev) =>
      prev.map((r) =>
        r.id === recommendationId
          ? { ...r, votes: [...r.votes.filter((v) => v.userId !== userId), vote] }
          : r
      )
    );

    if (data.planStatus === "locked") {
      setJustLocked(true);
      setTimeout(() => router.push(`/group/${id}/plan`), 1900);
    }
  };

  const sorted = [...recs].sort(
    (a, b) =>
      b.votes.reduce((s, v) => s + v.value, 0) -
      a.votes.reduce((s, v) => s + v.value, 0)
  );

  const voters = new Set<string>();
  for (const r of recs) for (const v of r.votes) voters.add(v.userId);
  const members = group?.members ?? [];
  const remaining = members.filter((m) => !voters.has(m.userId));

  return (
    <main className="min-h-screen pt-6 pb-16 px-4">
      <div className="mx-auto max-w-3xl">
        <div className="mb-6">
          <Link
            href={`/group/${id}`}
            className="text-text-dim text-sm hover:text-text-bright transition-colors"
          >
            ← Back to group
          </Link>
          <h1 className="font-display text-3xl font-bold gradient-text mt-4 mb-1">
            Vote on Ideas
          </h1>
          <p className="text-text-dim text-sm">
            Thumbs up your favourites — when everyone&apos;s voted, the top pick
            locks in automatically.
          </p>
        </div>

        {!loading && recs.length > 0 && members.length > 0 && (
          <div className="mb-6 rounded-xl border border-white/10 bg-white/5 px-4 py-3">
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <span className="text-sm text-text-bright">
                {remaining.length === 0
                  ? "Everyone has voted!"
                  : `Waiting on ${remaining.length} member${
                      remaining.length === 1 ? "" : "s"
                    }`}
              </span>
              <div className="flex items-center">
                {members.map((m) => {
                  const voted = voters.has(m.userId);
                  return m.user.image ? (
                    <Image
                      key={m.id}
                      src={m.user.image}
                      alt={m.user.name ?? "Member"}
                      width={28}
                      height={28}
                      title={`${m.user.name ?? "Member"}${voted ? " — voted" : " — not yet"}`}
                      className={`rounded-full border-2 border-cosmos -ml-2 first:ml-0 transition-opacity ${
                        voted ? "opacity-100" : "opacity-30 grayscale"
                      }`}
                    />
                  ) : (
                    <div
                      key={m.id}
                      title={`${m.user.name ?? "Member"}${voted ? " — voted" : " — not yet"}`}
                      className={`w-7 h-7 rounded-full border-2 border-cosmos bg-violet/40 flex items-center justify-center text-xs font-bold text-text-bright -ml-2 first:ml-0 transition-opacity ${
                        voted ? "opacity-100" : "opacity-30 grayscale"
                      }`}
                    >
                      {(m.user.name ?? m.user.email ?? "?")[0].toUpperCase()}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {!loading && sorted.length === 0 && (
          <div className="text-center py-16 rounded-2xl border border-white/10 bg-white/5">
            <Sparkles size={32} className="mx-auto mb-4 text-text-dim" />
            <p className="text-text-dim">No recommendations to vote on yet.</p>
            <Link
              href={`/group/${id}/recommend`}
              className="inline-block mt-4 text-sm text-violet hover:underline"
            >
              Generate some →
            </Link>
          </div>
        )}

        {!loading && sorted.length > 0 && (
          <div className="grid grid-cols-1 gap-4">
            {sorted.map((r, i) => (
              <div key={r.id} className="relative">
                {i === 0 && (
                  <div className="absolute -top-3 left-4 z-10 inline-flex items-center gap-1 text-xs font-bold text-yellow-400 border border-yellow-400/30 bg-cosmos rounded-full px-2 py-0.5">
                    <Trophy size={11} /> Top pick
                  </div>
                )}
                <RecommendationCard
                  recommendation={r}
                  userId={userId}
                  index={i}
                  onVote={handleVote}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Lock-in celebration */}
      <AnimatePresence>
        {justLocked && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-cosmos/80 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.7, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 16 }}
              className="text-center"
            >
              <motion.div
                animate={{ rotate: [0, -12, 12, -8, 0] }}
                transition={{ duration: 0.8 }}
                className="mx-auto mb-5 w-20 h-20 rounded-full bg-gradient-vibe flex items-center justify-center shadow-[0_0_60px_rgba(124,58,237,0.6)]"
              >
                <Trophy size={36} className="text-white" />
              </motion.div>
              <h2 className="font-display text-2xl font-bold gradient-text mb-1">
                Your plan is locked in!
              </h2>
              <p className="text-text-dim text-sm">Taking you to the plan…</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}

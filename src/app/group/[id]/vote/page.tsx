"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { RecommendationWithVotes } from "@/lib/types";
import RecommendationCard from "@/components/RecommendationCard";

export default function VotePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [recs, setRecs] = useState<RecommendationWithVotes[]>([]);
  const [userId, setUserId] = useState<string | undefined>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch(`/api/groups/${id}`).then((r) => r.json()),
      fetch("/api/auth/session").then((r) => r.json()),
    ]).then(([group, session]) => {
      setRecs(group?.recommendations ?? []);
      setUserId(session?.user?.id);
      setLoading(false);
    });
  }, [id]);

  const handleVote = async (recommendationId: string, value: 1 | -1) => {
    const res = await fetch("/api/vote", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ recommendationId, value }),
    });
    if (!res.ok) return;
    const vote = await res.json();
    setRecs((prev) =>
      prev.map((r) =>
        r.id === recommendationId
          ? { ...r, votes: [...r.votes.filter((v) => v.userId !== userId), vote] }
          : r
      )
    );
  };

  const sorted = [...recs].sort(
    (a, b) =>
      b.votes.reduce((s, v) => s + v.value, 0) -
      a.votes.reduce((s, v) => s + v.value, 0)
  );

  return (
    <main className="min-h-screen pt-6 pb-16 px-4">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8">
          <Link href={`/group/${id}`} className="text-text-dim text-sm hover:text-text-bright transition-colors">
            ← Back to group
          </Link>
          <h1 className="font-display text-3xl font-bold gradient-text mt-4 mb-1">Vote on Ideas</h1>
          <p className="text-text-dim text-sm">Thumbs up your favourites — the winner rises to the top.</p>
        </div>

        {loading && (
          <div className="text-center py-16">
            <div className="w-12 h-12 rounded-full bg-gradient-vibe mx-auto animate-pulse" />
          </div>
        )}

        {!loading && sorted.length === 0 && (
          <div className="text-center py-16 rounded-2xl border border-white/10 bg-white/5">
            <p className="text-4xl mb-4">🗳️</p>
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
                  <div className="absolute -top-3 left-4 z-10 text-xs font-bold text-yellow-400 border border-yellow-400/30 bg-cosmos rounded-full px-2 py-0.5">
                    👑 Top pick
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
    </main>
  );
}

"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { RecommendationWithVotes } from "@/lib/types";
import RecommendationCard from "@/components/RecommendationCard";

const loadingMessages = [
  "Analysing vibes…",
  "Matching personalities…",
  "Curating the perfect plan…",
  "Consulting the group oracle…",
  "Almost there…",
];

export default function RecommendPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [recs, setRecs] = useState<RecommendationWithVotes[]>([]);
  const [loading, setLoading] = useState(false);
  const [msgIdx, setMsgIdx] = useState(0);
  const [error, setError] = useState("");
  const [userId, setUserId] = useState<string | undefined>();

  useEffect(() => {
    fetch("/api/auth/session")
      .then((r) => r.json())
      .then((s) => setUserId(s?.user?.id));
  }, []);

  const generate = async () => {
    setLoading(true);
    setError("");
    setRecs([]);

    let i = 0;
    const interval = setInterval(() => {
      i = (i + 1) % loadingMessages.length;
      setMsgIdx(i);
    }, 1200);

    const res = await fetch(`/api/groups/${id}/recommend`, { method: "POST" });
    clearInterval(interval);
    setLoading(false);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Failed to generate recommendations. Try again.");
      return;
    }

    const data = await res.json();
    setRecs(data);
  };

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
          ? {
              ...r,
              votes: [
                ...r.votes.filter((v) => v.userId !== userId),
                vote,
              ],
            }
          : r
      )
    );
  };

  return (
    <main className="min-h-screen pt-6 pb-16 px-4">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8">
          <Link
            href={`/group/${id}`}
            className="text-text-dim text-sm hover:text-text-bright transition-colors"
          >
            ← Back to group
          </Link>
          <h1 className="font-display text-3xl font-bold gradient-text mt-4 mb-1">
            AI Recommendations
          </h1>
          <p className="text-text-dim text-sm">
            Personalised activities based on your group&apos;s personalities and interests.
          </p>
        </div>

        {!loading && recs.length === 0 && (
          <div className="text-center py-16 rounded-2xl border border-white/10 bg-white/5 mb-8">
            <p className="text-5xl mb-4">🎯</p>
            <h2 className="font-display text-xl font-semibold text-text-bright mb-2">
              Ready when you are
            </h2>
            <p className="text-text-dim text-sm mb-6">
              We&apos;ll analyse everyone&apos;s personalities and find the perfect activities.
            </p>
            <button
              onClick={generate}
              className="rounded-full bg-gradient-vibe px-8 py-3 font-semibold text-white hover:opacity-90 transition-opacity"
            >
              Generate Recommendations ✨
            </button>
          </div>
        )}

        {loading && (
          <div className="text-center py-16">
            <div className="w-16 h-16 rounded-full bg-gradient-vibe mx-auto mb-6 animate-pulse" />
            <p className="text-text-dim text-lg">{loadingMessages[msgIdx]}</p>
          </div>
        )}

        {error && (
          <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-400 text-sm mb-6">
            {error}
          </div>
        )}

        {recs.length > 0 && (
          <>
            <div className="grid grid-cols-1 gap-4 mb-8">
              {recs.map((r, i) => (
                <RecommendationCard
                  key={r.id}
                  recommendation={r}
                  userId={userId}
                  index={i}
                  onVote={handleVote}
                />
              ))}
            </div>
            <div className="text-center">
              <button
                onClick={generate}
                disabled={loading}
                className="rounded-full border border-white/20 px-6 py-2.5 text-sm text-text-dim hover:border-violet/40 hover:text-text-bright transition-all"
              >
                Regenerate
              </button>
            </div>
          </>
        )}
      </div>
    </main>
  );
}

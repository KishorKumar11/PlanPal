"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Sparkles } from "lucide-react";
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
  const [initialLoad, setInitialLoad] = useState(true);
  const [msgIdx, setMsgIdx] = useState(0);
  const [error, setError] = useState("");
  const [userId, setUserId] = useState<string | undefined>();

  useEffect(() => {
    let active = true;
    Promise.all([
      fetch(`/api/groups/${id}`).then((r) => (r.ok ? r.json() : null)),
      fetch("/api/auth/session").then((r) => r.json()),
    ]).then(([g, s]) => {
      if (!active) return;
      setUserId(s?.user?.id);
      if (g?.planStatus === "locked") {
        router.replace(`/group/${id}/plan`);
        return;
      }
      setRecs(g?.recommendations ?? []);
      setInitialLoad(false);
    });
    return () => {
      active = false;
    };
  }, [id, router]);

  const generate = async () => {
    setLoading(true);
    setError("");

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

    setRecs(await res.json());
  };

  const regenerate = () => {
    const hasVotes = recs.some((r) => r.votes.length > 0);
    if (
      hasVotes &&
      !confirm(
        "Regenerating replaces these ideas and clears the current votes. Continue?"
      )
    )
      return;
    generate();
  };

  const handleVote = async (recommendationId: string, value: 1 | -1) => {
    const res = await fetch("/api/vote", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ recommendationId, value }),
    });
    if (!res.ok) return;
    const data = await res.json();
    setRecs((prev) =>
      prev.map((r) =>
        r.id === recommendationId
          ? { ...r, votes: [...r.votes.filter((v) => v.userId !== userId), data.vote] }
          : r
      )
    );
    if (data.planStatus === "locked") router.push(`/group/${id}/plan`);
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

        {!initialLoad && !loading && recs.length === 0 && (
          <div className="text-center py-16 rounded-2xl border border-white/10 bg-white/5 mb-8">
            <Sparkles size={36} className="mx-auto mb-4 text-violet" />
            <h2 className="font-display text-xl font-semibold text-text-bright mb-2">
              Ready when you are
            </h2>
            <p className="text-text-dim text-sm mb-6">
              We&apos;ll analyse everyone&apos;s personalities and find the perfect activities.
            </p>
            <button
              onClick={generate}
              className="inline-flex items-center gap-2 rounded-full bg-gradient-vibe px-8 py-3 font-semibold text-white hover:opacity-90 transition-opacity"
            >
              Generate Recommendations <Sparkles size={16} />
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

        {!loading && recs.length > 0 && (
          <>
            <div className="grid grid-cols-1 gap-4 mb-6">
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
            <div className="flex items-center justify-center gap-3">
              <Link
                href={`/group/${id}/vote`}
                className="rounded-full bg-gradient-vibe px-6 py-2.5 text-sm font-semibold text-white hover:opacity-90 transition-opacity"
              >
                Go vote →
              </Link>
              <button
                onClick={regenerate}
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

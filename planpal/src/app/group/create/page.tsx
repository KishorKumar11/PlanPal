"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import GlowCard from "@/components/GlowCard";

export default function CreateGroupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setLoading(true);
    setError("");

    const res = await fetch("/api/groups", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: name.trim(), description: description.trim() || undefined }),
    });

    if (!res.ok) {
      setError("Failed to create group. Please try again.");
      setLoading(false);
      return;
    }

    const group = await res.json();
    router.push(`/group/${group.id}`);
  };

  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="mb-8">
          <Link href="/dashboard" className="text-text-dim text-sm hover:text-text-bright transition-colors">
            ← Back
          </Link>
          <h1 className="font-display text-3xl font-bold gradient-text mt-4 mb-1">Create a Group</h1>
          <p className="text-text-dim text-sm">Give your squad a name and start vibing.</p>
        </div>

        <GlowCard className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs text-text-dim uppercase tracking-widest mb-2">
                Group name *
              </label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Weekend Warriors"
                maxLength={50}
                required
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-text-bright placeholder-text-dim/50 focus:border-violet/50 focus:outline-none transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs text-text-dim uppercase tracking-widest mb-2">
                Description (optional)
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="The crew for spontaneous adventures…"
                maxLength={200}
                rows={3}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-text-bright placeholder-text-dim/50 focus:border-violet/50 focus:outline-none transition-colors resize-none"
              />
            </div>

            {error && <p className="text-red-400 text-sm">{error}</p>}

            <button
              type="submit"
              disabled={!name.trim() || loading}
              className="w-full rounded-full bg-gradient-vibe py-3 font-semibold text-white disabled:opacity-40 hover:opacity-90 transition-opacity"
            >
              {loading ? "Creating…" : "Create Group →"}
            </button>
          </form>
        </GlowCard>
      </div>
    </main>
  );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, ExternalLink } from "lucide-react";
import { MBTI_TYPES, MBTI_GROUP_COLORS, MbtiGroup } from "@/lib/mbti";

const GROUPS: MbtiGroup[] = ["Analysts", "Diplomats", "Sentinels", "Explorers"];

const GROUP_DESCRIPTIONS: Record<MbtiGroup, string> = {
  Analysts:  "Strategic, innovative, ideas-driven",
  Diplomats: "Empathetic, idealistic, values-driven",
  Sentinels: "Reliable, practical, stability-driven",
  Explorers: "Spontaneous, bold, action-driven",
};

export default function MbtiPicker() {
  const router = useRouter();
  const [selected, setSelected] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!selected) return;
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/mbti", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mbtiType: selected }),
      });

      if (!res.ok) throw new Error("Failed to save");
      router.push("/onboarding/quiz");
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      {/* Groups */}
      <div className="space-y-8 mb-10">
        {GROUPS.map((group) => {
          const color = MBTI_GROUP_COLORS[group];
          const types = MBTI_TYPES.filter((t) => t.group === group);

          return (
            <div key={group}>
              {/* Group header */}
              <div className="flex items-center gap-2 mb-3">
                <span
                  className="text-xs font-bold uppercase tracking-widest"
                  style={{ color }}
                >
                  {group}
                </span>
                <span className="text-xs text-text-dim">— {GROUP_DESCRIPTIONS[group]}</span>
              </div>

              {/* Type cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {types.map((type) => {
                  const isSelected = selected === type.code;
                  return (
                    <button
                      key={type.code}
                      onClick={() => setSelected(type.code)}
                      className="text-left rounded-xl border p-3.5 transition-all duration-200 hover:-translate-y-0.5 active:scale-95"
                      style={{
                        borderColor: isSelected ? color : "rgba(255,255,255,0.1)",
                        background: isSelected ? `${color}18` : "rgba(255,255,255,0.03)",
                        boxShadow: isSelected ? `0 0 16px ${color}30` : "none",
                      }}
                    >
                      <div
                        className="font-display text-lg font-bold mb-0.5 leading-none"
                        style={{ color: isSelected ? color : "#f0e6ff" }}
                      >
                        {type.code}
                      </div>
                      <div className="text-xs font-medium text-text-dim leading-snug">
                        {type.nickname.replace("The ", "")}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected type detail */}
      {selected && (() => {
        const type = MBTI_TYPES.find((t) => t.code === selected)!;
        const color = MBTI_GROUP_COLORS[type.group];
        return (
          <div
            className="rounded-2xl border p-4 mb-8 transition-all duration-300"
            style={{ borderColor: `${color}40`, background: `${color}0d` }}
          >
            <div className="flex items-center gap-3">
              <div
                className="font-display text-2xl font-bold"
                style={{ color }}
              >
                {type.code}
              </div>
              <div>
                <div className="font-semibold text-text-bright text-sm">{type.nickname}</div>
                <div className="text-xs text-text-dim">{type.tagline}</div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Don't know MBTI */}
      <p className="text-xs text-text-dim text-center mb-6">
        Not sure of your type?{" "}
        <a
          href="https://www.16personalities.com/free-personality-test"
          target="_blank"
          rel="noopener noreferrer"
          className="text-violet hover:underline inline-flex items-center gap-0.5"
        >
          Take the free 16personalities test
          <ExternalLink size={10} />
        </a>{" "}
        — it takes ~12 minutes.
      </p>

      {/* Error */}
      {error && (
        <p className="text-xs text-red-400 text-center mb-4">{error}</p>
      )}

      {/* CTA */}
      <button
        onClick={handleSubmit}
        disabled={!selected || loading}
        className="w-full flex items-center justify-center gap-2 rounded-full bg-gradient-vibe py-4 font-display text-lg font-bold text-white hover:opacity-90 active:scale-95 transition-all duration-150 shadow-[0_0_30px_rgba(124,58,237,0.3)] disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100"
      >
        {loading ? "Saving…" : selected ? `I'm an ${selected} — Continue` : "Select your type to continue"}
        {!loading && <ArrowRight size={18} />}
      </button>
    </div>
  );
}

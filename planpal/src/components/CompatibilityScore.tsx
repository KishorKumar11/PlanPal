"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { GroupMemberWithUser } from "@/lib/types";
import { TraitScores } from "@/lib/types";

interface CompatibilityScoreProps {
  members: GroupMemberWithUser[];
}

function calcCompatibility(members: GroupMemberWithUser[]): { score: number; label: string } {
  const withScores = members.filter((m) => m.user.traitScores !== null);
  if (withScores.length < 2) return { score: 50, label: "Getting started" };

  const traits: (keyof TraitScores)[] = [
    "adventurous", "social", "creative", "chill", "competitive", "foodie",
  ];

  const allScores = withScores.map((m) => m.user.traitScores as TraitScores);

  const variances = traits.map((trait) => {
    const vals = allScores.map((s) => s[trait]);
    const mean = vals.reduce((a, b) => a + b, 0) / vals.length;
    const variance = vals.reduce((a, v) => a + Math.pow(v - mean, 2), 0) / vals.length;
    return variance;
  });

  const avgVariance = variances.reduce((a, b) => a + b, 0) / variances.length;
  const diversityScore = Math.min(avgVariance / 4, 1) * 40;

  const sharedInterests = members.reduce((acc, m) => {
    const interests = new Set(m.user.interests);
    if (acc === null) return interests;
    return new Set([...acc].filter((i) => interests.has(i)));
  }, null as Set<string> | null);

  const sharedBonus = Math.min((sharedInterests?.size ?? 0) * 5, 20);

  const baseScore = 40 + diversityScore + sharedBonus;
  const score = Math.round(Math.min(Math.max(baseScore, 30), 98));

  const label =
    score >= 85
      ? "Perfectly Balanced"
      : score >= 70
      ? "Adventure Squad"
      : score >= 55
      ? "Good Vibes"
      : "Chill Zone";

  return { score, label };
}

export default function CompatibilityScore({ members }: CompatibilityScoreProps) {
  const { score, label } = useMemo(() => calcCompatibility(members), [members]);

  const circumference = 2 * Math.PI * 40;
  const dash = (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative w-28 h-28">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50" cy="50" r="40"
            stroke="rgba(255,255,255,0.1)" strokeWidth="8" fill="none"
          />
          <motion.circle
            cx="50" cy="50" r="40"
            stroke="url(#grad)" strokeWidth="8" fill="none"
            strokeLinecap="round"
            strokeDasharray={`${circumference}`}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: circumference - dash }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
          />
          <defs>
            <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#7c3aed" />
              <stop offset="100%" stopColor="#ec4899" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-display text-2xl font-bold gradient-text">{score}%</span>
        </div>
      </div>
      <div className="text-center">
        <p className="font-display text-sm font-semibold text-text-bright">{label}</p>
        <p className="text-xs text-text-dim">Group compatibility</p>
      </div>
    </div>
  );
}

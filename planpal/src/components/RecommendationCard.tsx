"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import GlowCard from "./GlowCard";
import { RecommendationWithVotes } from "@/lib/types";

const categoryIcon: Record<string, string> = {
  activity: "🎯",
  restaurant: "🍽️",
  trip: "✈️",
};

const energyColor: Record<string, string> = {
  low: "text-teal-400 border-teal-400/30",
  medium: "text-yellow-400 border-yellow-400/30",
  high: "text-orange border-orange/30",
};

interface RecommendationCardProps {
  recommendation: RecommendationWithVotes;
  userId?: string;
  index?: number;
  onVote?: (id: string, value: 1 | -1) => void;
}

export default function RecommendationCard({
  recommendation: rec,
  userId,
  index = 0,
  onVote,
}: RecommendationCardProps) {
  const [showReason, setShowReason] = useState(false);
  const meta = rec.metadata;

  const userVote = rec.votes.find((v) => v.userId === userId)?.value;
  const upvotes = rec.votes.filter((v) => v.value === 1).length;
  const downvotes = rec.votes.filter((v) => v.value === -1).length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.3 }}
    >
      <GlowCard className="p-5">
        <div className="flex items-start gap-3 mb-3">
          <span className="text-2xl shrink-0">{categoryIcon[rec.category] ?? "✨"}</span>
          <div className="flex-1">
            <h3 className="font-display text-lg font-semibold text-text-bright">{rec.title}</h3>
            <span className="text-xs text-text-dim capitalize">{rec.category}</span>
          </div>
        </div>

        <p className="text-text-bright/80 text-sm leading-relaxed mb-4">{rec.description}</p>

        {meta && (
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="text-xs border border-white/20 text-text-dim rounded-full px-2.5 py-1">
              {meta.price_range}
            </span>
            <span className="text-xs border border-white/20 text-text-dim rounded-full px-2.5 py-1">
              {meta.duration}
            </span>
            <span className={`text-xs border rounded-full px-2.5 py-1 ${energyColor[meta.energy_level] ?? "text-text-dim border-white/20"}`}>
              {meta.energy_level} energy
            </span>
          </div>
        )}

        <button
          onClick={() => setShowReason((r) => !r)}
          className="text-xs text-text-dim hover:text-text-bright transition-colors mb-3"
        >
          {showReason ? "▲ Hide" : "▼ Why this fits"}
        </button>

        {showReason && (
          <motion.p
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="text-xs text-text-dim italic border-l-2 border-violet/40 pl-3 mb-4"
          >
            {rec.reasoning}
          </motion.p>
        )}

        {onVote && (
          <div className="flex items-center gap-3 pt-3 border-t border-white/10">
            <button
              onClick={() => onVote(rec.id, 1)}
              className={`flex items-center gap-1.5 text-sm rounded-full px-3 py-1.5 border transition-all ${
                userVote === 1
                  ? "border-teal-400/60 bg-teal-400/20 text-teal-400"
                  : "border-white/10 text-text-dim hover:border-teal-400/40 hover:text-teal-400"
              }`}
            >
              👍 {upvotes}
            </button>
            <button
              onClick={() => onVote(rec.id, -1)}
              className={`flex items-center gap-1.5 text-sm rounded-full px-3 py-1.5 border transition-all ${
                userVote === -1
                  ? "border-pink/60 bg-pink/20 text-pink"
                  : "border-white/10 text-text-dim hover:border-pink/40 hover:text-pink"
              }`}
            >
              👎 {downvotes}
            </button>
          </div>
        )}
      </GlowCard>
    </motion.div>
  );
}

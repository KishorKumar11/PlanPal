"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Target, Utensils, Plane, ThumbsUp, ThumbsDown, ChevronDown, ChevronUp, Zap } from "lucide-react";
import GlowCard from "./GlowCard";
import { RecommendationWithVotes } from "@/lib/types";

const categoryIcon: Record<string, React.ReactNode> = {
  activity: <Target size={18} className="text-violet" />,
  restaurant: <Utensils size={18} className="text-pink" />,
  trip: <Plane size={18} className="text-orange" />,
};

const energyColor: Record<string, string> = {
  low: "text-teal-400 border-teal-400/30 bg-teal-400/10",
  medium: "text-yellow-400 border-yellow-400/30 bg-yellow-400/10",
  high: "text-orange border-orange/30 bg-orange/10",
};

const energyIcon: Record<string, React.ReactNode> = {
  low: <Zap size={10} className="opacity-40" />,
  medium: <Zap size={10} />,
  high: <><Zap size={10} /><Zap size={10} /></>,
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
  const meta = rec.metadata as Record<string, string> | null;

  const userVote = rec.votes.find((v) => v.userId === userId)?.value;
  const upvotes = rec.votes.filter((v) => v.value === 1).length;
  const downvotes = rec.votes.filter((v) => v.value === -1).length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ delay: index * 0.08, duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      <GlowCard className="p-5 h-full flex flex-col">
        <div className="flex items-start gap-3 mb-3">
          <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
            {categoryIcon[rec.category] ?? <Target size={18} />}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-display text-base font-semibold text-text-bright leading-tight">
              {rec.title}
            </h3>
            <span className="text-xs text-text-dim capitalize">{rec.category}</span>
          </div>
        </div>

        <p className="text-text-bright/75 text-sm leading-relaxed mb-4 flex-1">
          {rec.description}
        </p>

        {meta && (
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="text-xs border border-white/15 bg-white/5 text-text-dim rounded-full px-3 py-1 font-medium">
              {meta.price_range}
            </span>
            <span className="text-xs border border-white/15 bg-white/5 text-text-dim rounded-full px-3 py-1 font-medium">
              {meta.duration}
            </span>
            <span
              className={`text-xs border rounded-full px-3 py-1 font-medium flex items-center gap-1 ${
                energyColor[meta.energy_level] ?? "text-text-dim border-white/20"
              }`}
            >
              {energyIcon[meta.energy_level]}
              {meta.energy_level} energy
            </span>
          </div>
        )}

        <button
          onClick={() => setShowReason((r) => !r)}
          className="flex items-center gap-1.5 text-xs text-text-dim hover:text-text-bright transition-colors mb-2 group"
        >
          {showReason ? (
            <ChevronUp size={13} className="transition-transform group-hover:-translate-y-0.5" />
          ) : (
            <ChevronDown size={13} className="transition-transform group-hover:translate-y-0.5" />
          )}
          Why this fits
        </button>

        <AnimatePresence>
          {showReason && (
            <motion.p
              key="reason"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="text-xs text-text-dim border-l-2 border-violet/40 pl-3 mb-3 overflow-hidden"
            >
              {rec.reasoning}
            </motion.p>
          )}
        </AnimatePresence>

        {onVote && (
          <div className="flex items-center gap-2 pt-3 border-t border-white/10 mt-auto">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => onVote(rec.id, 1)}
              className={`flex items-center gap-1.5 text-sm rounded-full px-3 py-1.5 border transition-all duration-200 ${
                userVote === 1
                  ? "border-teal-400/60 bg-teal-400/15 text-teal-400"
                  : "border-white/10 text-text-dim hover:border-teal-400/40 hover:text-teal-400"
              }`}
            >
              <ThumbsUp size={13} />
              {upvotes}
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => onVote(rec.id, -1)}
              className={`flex items-center gap-1.5 text-sm rounded-full px-3 py-1.5 border transition-all duration-200 ${
                userVote === -1
                  ? "border-pink/60 bg-pink/15 text-pink"
                  : "border-white/10 text-text-dim hover:border-pink/40 hover:text-pink"
              }`}
            >
              <ThumbsDown size={13} />
              {downvotes}
            </motion.button>
          </div>
        )}
      </GlowCard>
    </motion.div>
  );
}

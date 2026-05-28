"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { Archetype } from "@/lib/archetypes";
import { TraitScores } from "@/lib/types";
import PersonalityRadar from "./PersonalityRadar";
import ArchetypeIcon from "./ArchetypeIcon";

interface ArchetypeRevealProps {
  archetype: Archetype;
  traitScores: TraitScores;
}

export default function ArchetypeReveal({ archetype, traitScores }: ArchetypeRevealProps) {
  const router = useRouter();
  const reduce = useReducedMotion();

  const spring = reduce
    ? { duration: 0 }
    : { type: "spring" as const, stiffness: 260, damping: 20 };

  return (
    <div className="text-center max-w-lg mx-auto">
      {/* Icon */}
      <motion.div
        initial={reduce ? false : { scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ ...spring, delay: 0.1 }}
        className="inline-flex items-center justify-center w-28 h-28 rounded-3xl mb-8 mx-auto"
        style={{
          background: `${archetype.color}20`,
          boxShadow: `0 0 60px ${archetype.color}40`,
          color: archetype.color,
        }}
      >
        <ArchetypeIcon name={archetype.icon} size={52} strokeWidth={1.5} />
      </motion.div>

      {/* Name & tagline */}
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35, duration: 0.4, ease: "easeOut" }}
      >
        <p className="text-text-dim text-xs uppercase tracking-widest mb-2">Your archetype</p>
        <h2 className="font-display text-4xl font-bold mb-2" style={{ color: archetype.color }}>
          {archetype.name}
        </h2>
        <p className="text-text-dim italic mb-4 text-lg">{archetype.tagline}</p>
        <p className="text-text-bright/80 text-sm leading-relaxed mb-8 max-w-sm mx-auto">
          {archetype.description}
        </p>
      </motion.div>

      {/* Radar */}
      <motion.div
        initial={reduce ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.65, duration: 0.5 }}
        className="mb-8"
      >
        <p className="text-text-dim text-xs uppercase tracking-widest mb-4">Your trait profile</p>
        <PersonalityRadar traitScores={traitScores} color={archetype.color} />
      </motion.div>

      {/* CTA */}
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.3 }}
      >
        <button
          onClick={() => router.push("/onboarding/interests")}
          className="inline-flex items-center gap-2 rounded-full bg-gradient-vibe px-8 py-3.5 font-semibold text-white hover:opacity-90 active:scale-95 transition-all duration-150 shadow-[0_0_30px_rgba(124,58,237,0.4)]"
        >
          Continue to interests
          <ArrowRight size={16} />
        </button>
      </motion.div>
    </div>
  );
}

"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Archetype } from "@/lib/archetypes";
import { TraitScores } from "@/lib/types";
import PersonalityRadar from "./PersonalityRadar";

interface ArchetypeRevealProps {
  archetype: Archetype;
  traitScores: TraitScores;
}

export default function ArchetypeReveal({ archetype, traitScores }: ArchetypeRevealProps) {
  const router = useRouter();

  return (
    <div className="text-center max-w-lg mx-auto">
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.1 }}
        className="text-8xl mb-6"
      >
        {archetype.emoji}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.4 }}
      >
        <p className="text-text-dim text-sm uppercase tracking-widest mb-2">Your archetype</p>
        <h2
          className="font-display text-4xl font-bold mb-2"
          style={{ color: archetype.color }}
        >
          {archetype.name}
        </h2>
        <p className="text-text-dim italic mb-4">{archetype.tagline}</p>
        <p className="text-text-bright/80 text-sm leading-relaxed mb-8">
          {archetype.description}
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7, duration: 0.5 }}
        className="mb-8"
      >
        <p className="text-text-dim text-xs uppercase tracking-widest mb-3">Your trait profile</p>
        <PersonalityRadar traitScores={traitScores} color={archetype.color} />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.3 }}
        className="flex flex-col sm:flex-row gap-3 justify-center"
      >
        <button
          onClick={() => router.push("/onboarding/interests")}
          className="rounded-full bg-gradient-vibe px-8 py-3 font-semibold text-white hover:opacity-90 transition-opacity"
        >
          Continue to interests →
        </button>
      </motion.div>
    </div>
  );
}

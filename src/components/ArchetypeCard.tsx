"use client";

import { motion } from "framer-motion";
import { Archetype } from "@/lib/archetypes";
import ArchetypeIcon from "./ArchetypeIcon";

interface ArchetypeCardProps {
  archetype: Archetype;
  compact?: boolean;
}

export default function ArchetypeCard({ archetype, compact = false }: ArchetypeCardProps) {
  if (compact) {
    return (
      <span
        className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold"
        style={{
          background: `${archetype.color}22`,
          color: archetype.color,
          border: `1px solid ${archetype.color}44`,
        }}
      >
        <ArchetypeIcon name={archetype.icon} size={11} />
        {archetype.name}
      </span>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="rounded-2xl p-5 border border-white/10"
      style={{ background: `${archetype.color}11` }}
    >
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
        style={{ background: `${archetype.color}22`, color: archetype.color }}
      >
        <ArchetypeIcon name={archetype.icon} size={24} />
      </div>
      <h3 className="font-display text-xl font-bold mb-1" style={{ color: archetype.color }}>
        {archetype.name}
      </h3>
      <p className="text-sm text-text-dim italic mb-2">{archetype.tagline}</p>
      <p className="text-sm text-text-bright/80 leading-relaxed">{archetype.description}</p>
    </motion.div>
  );
}

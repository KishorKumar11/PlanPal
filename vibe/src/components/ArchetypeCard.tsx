import { Archetype } from "@/lib/archetypes";

interface ArchetypeCardProps {
  archetype: Archetype;
  compact?: boolean;
}

export default function ArchetypeCard({ archetype, compact = false }: ArchetypeCardProps) {
  if (compact) {
    return (
      <span
        className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold"
        style={{ background: `${archetype.color}22`, color: archetype.color, border: `1px solid ${archetype.color}44` }}
      >
        <span>{archetype.emoji}</span>
        {archetype.name}
      </span>
    );
  }

  return (
    <div
      className="rounded-2xl p-5 border border-white/10"
      style={{ background: `${archetype.color}11` }}
    >
      <div className="text-4xl mb-3">{archetype.emoji}</div>
      <h3
        className="font-display text-xl font-bold mb-1"
        style={{ color: archetype.color }}
      >
        {archetype.name}
      </h3>
      <p className="text-sm text-text-dim italic mb-2">{archetype.tagline}</p>
      <p className="text-sm text-text-bright/80">{archetype.description}</p>
    </div>
  );
}

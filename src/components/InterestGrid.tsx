"use client";

import { useState } from "react";
import { interests, interestCategories } from "@/lib/interests";
import GlowCard from "./GlowCard";

interface InterestGridProps {
  initial?: string[];
  onChange: (selected: string[]) => void;
}

export default function InterestGrid({ initial = [], onChange }: InterestGridProps) {
  const [selected, setSelected] = useState<Set<string>>(new Set(initial));

  const toggle = (id: string) => {
    const next = new Set(selected);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelected(next);
    onChange(Array.from(next));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-text-dim text-sm">
          {selected.size} selected{" "}
          {selected.size < 3 && (
            <span className="text-pink/80">(pick at least 3)</span>
          )}
        </p>
      </div>

      {interestCategories.map((category) => (
        <div key={category}>
          <h3 className="text-text-dim text-xs uppercase tracking-widest mb-3">{category}</h3>
          <div className="flex flex-wrap gap-2">
            {interests
              .filter((i) => i.category === category)
              .map((interest) => {
                const isSelected = selected.has(interest.id);
                return (
                  <button
                    key={interest.id}
                    onClick={() => toggle(interest.id)}
                    className={`
                      flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium
                      border transition-all duration-200
                      ${isSelected
                        ? "border-violet/60 bg-violet/20 text-text-bright shadow-[0_0_12px_rgba(124,58,237,0.3)]"
                        : "border-white/10 bg-white/5 text-text-dim hover:border-white/30 hover:text-text-bright"
                      }
                    `}
                  >
                    <span>{interest.emoji}</span>
                    {interest.label}
                  </button>
                );
              })}
          </div>
        </div>
      ))}
    </div>
  );
}

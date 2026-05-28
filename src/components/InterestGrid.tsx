"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { interests, interestCategories } from "@/lib/interests";
import InterestIcon from "./InterestIcon";

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
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <p className="text-text-dim text-sm">
          <span className="text-text-bright font-semibold">{selected.size}</span> selected
          {selected.size < 3 && (
            <span className="text-pink/80 ml-1">(pick at least 3)</span>
          )}
        </p>
      </div>

      {interestCategories.map((category, catIndex) => (
        <motion.div
          key={category}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: catIndex * 0.06, duration: 0.3, ease: "easeOut" }}
        >
          <h3 className="text-text-dim text-xs uppercase tracking-widest mb-3 font-medium">
            {category}
          </h3>
          <div className="flex flex-wrap gap-2">
            {interests
              .filter((i) => i.category === category)
              .map((interest) => {
                const isSelected = selected.has(interest.id);
                return (
                  <motion.button
                    key={interest.id}
                    onClick={() => toggle(interest.id)}
                    whileTap={{ scale: 0.93 }}
                    className={`
                      flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium
                      border transition-all duration-200 cursor-pointer
                      ${isSelected
                        ? "border-violet/60 bg-violet/20 text-text-bright shadow-[0_0_16px_rgba(124,58,237,0.25)]"
                        : "border-white/10 bg-white/5 text-text-dim hover:border-white/30 hover:text-text-bright hover:bg-white/8"
                      }
                    `}
                  >
                    <InterestIcon
                      name={interest.icon}
                      size={14}
                      className={isSelected ? "text-violet" : "text-text-dim"}
                    />
                    {interest.label}
                  </motion.button>
                );
              })}
          </div>
        </motion.div>
      ))}
    </div>
  );
}

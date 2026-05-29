"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Target,
  Utensils,
  Plane,
  ChevronDown,
  CheckCircle2,
  CalendarDays,
} from "lucide-react";
import { PastPlan } from "@/lib/types";

const categoryIcon: Record<string, React.ReactNode> = {
  activity: <Target size={16} className="text-violet" />,
  restaurant: <Utensils size={16} className="text-pink" />,
  trip: <Plane size={16} className="text-orange" />,
};

const fmtDate = (d: string) =>
  new Date(`${d.slice(0, 10)}T00:00:00.000Z`).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });

export default function PastPlans({ plans }: { plans: PastPlan[] }) {
  const [open, setOpen] = useState<string | null>(null);

  if (plans.length === 0) return null;

  return (
    <div className="mb-8">
      <p className="text-xs text-text-dim uppercase tracking-widest mb-3">
        Past plans
      </p>
      <div className="space-y-2">
        {plans.map((p) => {
          const isOpen = open === p.id;
          return (
            <div
              key={p.id}
              className="rounded-xl border border-white/10 bg-white/5 overflow-hidden"
            >
              <button
                onClick={() => setOpen(isOpen ? null : p.id)}
                className="w-full flex items-center gap-3 p-4 text-left hover:bg-white/5 transition-colors"
              >
                <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                  {categoryIcon[p.category] ?? <Target size={16} />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-text-bright truncate">
                    {p.title}
                  </p>
                  <p className="text-xs text-text-dim flex items-center gap-1">
                    {p.lockedDate ? (
                      <>
                        <CalendarDays size={11} /> {fmtDate(p.lockedDate)}
                      </>
                    ) : (
                      "No date set"
                    )}
                  </p>
                </div>
                <span className="inline-flex items-center gap-1 text-xs text-teal-400 border border-teal-400/30 bg-teal-400/10 rounded-full px-2 py-0.5 shrink-0">
                  <CheckCircle2 size={11} /> Done
                </span>
                <ChevronDown
                  size={16}
                  className={`text-text-dim shrink-0 transition-transform ${
                    isOpen ? "rotate-180" : ""
                  }`}
                />
              </button>
              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="px-4 pb-4 pt-0 text-sm text-text-bright/75 space-y-2">
                      <p>{p.description}</p>
                      <p className="text-xs text-text-dim border-l-2 border-violet/40 pl-3">
                        {p.reasoning}
                      </p>
                      {p.notes && (
                        <p className="text-xs text-text-dim">
                          <span className="text-text-bright/70">Notes: </span>
                          {p.notes}
                        </p>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
}

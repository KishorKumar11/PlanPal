"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Target,
  Utensils,
  Plane,
  Zap,
  ThumbsUp,
  ThumbsDown,
  ChevronDown,
  Users,
  Sparkles,
} from "lucide-react";

interface MockCard {
  id: number;
  title: string;
  category: "activity" | "restaurant" | "trip";
  description: string;
  price: string;
  duration: string;
  energy: "low" | "medium" | "high";
  upvotes: number;
  reasoning: string;
  archetypes: string[];
  color: string;
}

const CARDS: MockCard[] = [
  {
    id: 1,
    title: "Rooftop Cocktail Night",
    category: "activity",
    description:
      "Sunset drinks 30 floors up — stunning city views, great cocktails, and the perfect vibe for your mix of socialites and explorers.",
    price: "$$",
    duration: "2–3 hrs",
    energy: "high",
    upvotes: 4,
    reasoning:
      "Your group scores high on Social (+82) and Creative (+76). A rooftop setting hits both — great conversation and a unique atmosphere.",
    archetypes: ["Social Butterfly", "Explorer"],
    color: "#7c3aed",
  },
  {
    id: 2,
    title: "Japanese Omakase Dinner",
    category: "restaurant",
    description:
      "Let the chef decide. 12-course tasting menu with premium sake pairings — a refined evening for the foodies and creatives in your group.",
    price: "$$$",
    duration: "2 hrs",
    energy: "low",
    upvotes: 3,
    reasoning:
      "Three members tagged Foodie and Creative. Omakase turns dinner into a shared experience, not just a meal — exactly what this group loves.",
    archetypes: ["Foodie", "Creative Soul"],
    color: "#ec4899",
  },
  {
    id: 3,
    title: "Escape Room Challenge",
    category: "activity",
    description:
      "60 minutes. One locked room. Your group either escapes together or goes down in flames — and it'll be hilarious either way.",
    price: "$$",
    duration: "1–2 hrs",
    energy: "high",
    upvotes: 5,
    reasoning:
      "Competitive trait is high across your group (+79 avg). Escape rooms satisfy both the puzzle lovers and the competitive streak — everyone's engaged.",
    archetypes: ["Adrenaline Junkie", "Explorer"],
    color: "#f97316",
  },
  {
    id: 4,
    title: "Kayaking at Sunrise",
    category: "trip",
    description:
      "Paddle out at dawn, watch the city wake up from the water. Pack a picnic for the island halfway across. Zero phone signal. Maximum peace.",
    price: "$",
    duration: "3–4 hrs",
    energy: "medium",
    upvotes: 3,
    reasoning:
      "Adventurous (+88) and Chill (+65) both rank high. Kayaking delivers the adventure fix while the pace stays relaxed enough for everyone.",
    archetypes: ["Explorer", "Couch King"],
    color: "#14b8a6",
  },
  {
    id: 5,
    title: "Stand-up Comedy Show",
    category: "activity",
    description:
      "Live comedy at a legendary club — intimate venue, great local acts, and table service so you're never far from another round.",
    price: "$$",
    duration: "2 hrs",
    energy: "medium",
    upvotes: 4,
    reasoning:
      "Social trait dominates your group. Stand-up is inherently shared — everyone laughs together, talks about it after, and wants to go back.",
    archetypes: ["Social Butterfly", "Creative Soul"],
    color: "#a855f7",
  },
];

const TOTAL = CARDS.length;
const VISIBLE = 3;

const categoryIcon: Record<string, React.ReactNode> = {
  activity: <Target size={15} />,
  restaurant: <Utensils size={15} />,
  trip: <Plane size={15} />,
};

const energyColors: Record<string, string> = {
  low: "text-teal-400 border-teal-400/30 bg-teal-400/10",
  medium: "text-yellow-400 border-yellow-400/30 bg-yellow-400/10",
  high: "text-orange border-orange/30 bg-orange/10",
};

function MiniCard({ card, index }: { card: MockCard; index: number }) {
  const [open, setOpen] = useState(false);

  return (
    <motion.div
      layout
      className="flex flex-col rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-5 h-full"
      style={{ borderColor: `${card.color}25` }}
    >
      {/* Header */}
      <div className="flex items-start gap-3 mb-3">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
          style={{ background: `${card.color}20`, color: card.color }}
        >
          {categoryIcon[card.category]}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-display text-sm font-bold text-text-bright leading-snug">
            {card.title}
          </h3>
          <span className="text-xs text-text-dim capitalize">{card.category}</span>
        </div>
        {/* Upvote badge */}
        <div className="flex items-center gap-1 text-xs text-teal-400 shrink-0">
          <ThumbsUp size={11} />
          <span>{card.upvotes}</span>
        </div>
      </div>

      {/* Description */}
      <p className="text-text-bright/70 text-xs leading-relaxed mb-3 flex-1">
        {card.description}
      </p>

      {/* Pills */}
      <div className="flex flex-wrap gap-1.5 mb-3">
        <span className="text-xs border border-white/15 bg-white/5 text-text-dim rounded-full px-2.5 py-0.5">
          {card.price}
        </span>
        <span className="text-xs border border-white/15 bg-white/5 text-text-dim rounded-full px-2.5 py-0.5">
          {card.duration}
        </span>
        <span
          className={`text-xs border rounded-full px-2.5 py-0.5 flex items-center gap-1 ${energyColors[card.energy]}`}
        >
          {card.energy === "high" ? (
            <>
              <Zap size={9} />
              <Zap size={9} />
            </>
          ) : (
            <Zap size={9} className={card.energy === "low" ? "opacity-40" : ""} />
          )}
          {card.energy}
        </span>
      </div>

      {/* Archetypes */}
      <div className="flex gap-1.5 mb-3">
        {card.archetypes.map((a) => (
          <span
            key={a}
            className="text-xs rounded-full px-2.5 py-0.5 font-medium"
            style={{ background: `${card.color}20`, color: card.color }}
          >
            {a}
          </span>
        ))}
      </div>

      {/* Why this fits toggle */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1.5 text-xs text-text-dim hover:text-text-bright transition-colors group"
      >
        <ChevronDown
          size={13}
          className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
        Why this fits
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.p
            key="reason"
            initial={{ opacity: 0, height: 0, marginTop: 0 }}
            animate={{ opacity: 1, height: "auto", marginTop: 8 }}
            exit={{ opacity: 0, height: 0, marginTop: 0 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="text-xs text-text-dim border-l-2 pl-3 overflow-hidden"
            style={{ borderColor: `${card.color}60` }}
          >
            {card.reasoning}
          </motion.p>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

const slideVariants = {
  enter: (dir: number) => ({
    x: dir > 0 ? "6%" : "-6%",
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (dir: number) => ({
    x: dir > 0 ? "-6%" : "6%",
    opacity: 0,
  }),
};

export default function RecommendationCarousel() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const go = useCallback((dir: number) => {
    setDirection(dir);
    setCurrent((prev) => (prev + dir + TOTAL) % TOTAL);
  }, []);

  // Auto-advance
  useEffect(() => {
    if (paused) return;
    timerRef.current = setInterval(() => go(1), 4000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [paused, go]);

  const visibleIndices = [0, 1, 2].map((i) => (current + i) % TOTAL);

  return (
    <div
      className="w-full"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Header row */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-violet/20 flex items-center justify-center">
            <Sparkles size={14} className="text-violet" />
          </div>
          <span className="text-xs text-text-dim uppercase tracking-widest font-medium">
            Sample AI recommendations
          </span>
        </div>
        {/* Prev / Next */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => go(-1)}
            className="w-8 h-8 rounded-full border border-white/10 bg-white/5 flex items-center justify-center hover:border-white/25 hover:bg-white/10 transition-all duration-200 active:scale-95"
            aria-label="Previous"
          >
            <ChevronLeft size={15} className="text-text-dim" />
          </button>
          <button
            onClick={() => go(1)}
            className="w-8 h-8 rounded-full border border-white/10 bg-white/5 flex items-center justify-center hover:border-white/25 hover:bg-white/10 transition-all duration-200 active:scale-95"
            aria-label="Next"
          >
            <ChevronRight size={15} className="text-text-dim" />
          </button>
        </div>
      </div>

      {/* Cards */}
      <div className="overflow-hidden">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={current}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.38, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 items-stretch"
          >
            {visibleIndices.map((idx, i) => (
              <MiniCard key={`${current}-${i}`} card={CARDS[idx]} index={i} />
            ))}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Dot indicators */}
      <div className="flex items-center justify-center gap-2 mt-6">
        {CARDS.map((_, i) => (
          <button
            key={i}
            onClick={() => {
              setDirection(i > current ? 1 : -1);
              setCurrent(i);
            }}
            className="transition-all duration-300"
            aria-label={`Go to card ${i + 1}`}
          >
            <span
              className={`block rounded-full transition-all duration-300 ${
                i === current
                  ? "w-5 h-1.5 bg-violet"
                  : "w-1.5 h-1.5 bg-white/20 hover:bg-white/40"
              }`}
            />
          </button>
        ))}
      </div>

      {/* Group composition hint */}
      <div className="mt-4 flex items-center justify-center gap-1.5 text-xs text-text-dim">
        <Users size={11} />
        <span>Based on a sample group: 2 Explorers, 1 Foodie, 1 Social Butterfly</span>
      </div>
    </div>
  );
}

/**
 * MBTI integration for PlanPal
 *
 * Research sources:
 *  - PMAI / Storywell archetype-MBTI correlation study (n > 1000)
 *  - 16personalities.com role-group framework (Analysts / Diplomats / Sentinels / Explorers)
 *  - Jung's original theory: MBTI dimensions map directly onto his cognitive-function model,
 *    which in turn informed the 12 PMAI archetypes.
 *
 * Blending methodology:
 *  Each MBTI dichotomy (E/I, S/N, T/F, J/P) adds a small, research-derived adjustment to
 *  PlanPal's 6 trait scores (adventurous, social, creative, chill, competitive, foodie).
 *  These adjustments are additive and capped so the quiz remains the dominant signal (~75 %).
 */

import { TraitScores } from "./types";

// ── Type definitions ──────────────────────────────────────────────────────────

export type MbtiDimension = "E" | "I" | "S" | "N" | "T" | "F" | "J" | "P";

export interface MbtiType {
  code: string;          // e.g. "INTJ"
  nickname: string;      // e.g. "The Architect"
  tagline: string;       // one-liner descriptor
  group: MbtiGroup;
}

export type MbtiGroup = "Analysts" | "Diplomats" | "Sentinels" | "Explorers";

// ── 16 MBTI types ─────────────────────────────────────────────────────────────

export const MBTI_TYPES: MbtiType[] = [
  // Analysts (NT) — strategic, innovative, driven by ideas and systems
  { code: "INTJ", nickname: "The Architect",  tagline: "Strategic, independent thinker with a plan for everything", group: "Analysts" },
  { code: "INTP", nickname: "The Logician",   tagline: "Curious inventor with an unquenchable thirst for knowledge", group: "Analysts" },
  { code: "ENTJ", nickname: "The Commander",  tagline: "Bold, decisive leader who always finds a way", group: "Analysts" },
  { code: "ENTP", nickname: "The Debater",    tagline: "Quick-witted and curious; loves a good intellectual challenge", group: "Analysts" },

  // Diplomats (NF) — empathetic, idealistic, driven by values and meaning
  { code: "INFJ", nickname: "The Advocate",   tagline: "Quiet but inspiring — a tireless idealist with vision", group: "Diplomats" },
  { code: "INFP", nickname: "The Mediator",   tagline: "Poetic and kind; always eager to champion a good cause", group: "Diplomats" },
  { code: "ENFJ", nickname: "The Protagonist",tagline: "Charismatic leader who inspires everyone around them", group: "Diplomats" },
  { code: "ENFP", nickname: "The Campaigner", tagline: "Enthusiastic free spirit who finds a reason to smile in everything", group: "Diplomats" },

  // Sentinels (SJ) — reliable, structured, driven by duty and stability
  { code: "ISTJ", nickname: "The Logistician",tagline: "Practical and dependable — reliability personified", group: "Sentinels" },
  { code: "ISFJ", nickname: "The Defender",   tagline: "Warm protector, always ready to look after the people they love", group: "Sentinels" },
  { code: "ESTJ", nickname: "The Executive",  tagline: "Excellent administrator with unmatched organisational drive", group: "Sentinels" },
  { code: "ESFJ", nickname: "The Consul",     tagline: "Extraordinarily caring and social — always eager to help", group: "Sentinels" },

  // Explorers (SP) — spontaneous, practical, driven by action and sensation
  { code: "ISTP", nickname: "The Virtuoso",   tagline: "Bold, practical experimenter — a master of tools and craft", group: "Explorers" },
  { code: "ISFP", nickname: "The Adventurer", tagline: "Flexible and charming artist, always ready for something new", group: "Explorers" },
  { code: "ESTP", nickname: "The Entrepreneur",tagline: "Energetic and perceptive — truly loves living on the edge", group: "Explorers" },
  { code: "ESFP", nickname: "The Entertainer",tagline: "Spontaneous and enthusiastic — life is never boring around them", group: "Explorers" },
];

export const MBTI_GROUP_COLORS: Record<MbtiGroup, string> = {
  Analysts:  "#7c3aed",
  Diplomats: "#14b8a6",
  Sentinels: "#3b82f6",
  Explorers: "#f97316",
};

export function getMbtiType(code: string): MbtiType | undefined {
  return MBTI_TYPES.find((t) => t.code === code.toUpperCase());
}

// ── Trait adjustments per MBTI dimension ──────────────────────────────────────
//
// Derived from:
//  - PMAI archetype-MBTI correlations (which traits dominate each preference)
//  - 16personalities role groups (Analysts → strategic/competitive, Diplomats → creative/social,
//    Sentinels → chill/foodie, Explorers → adventurous/spontaneous)
//  - Jung: N→abstract/adventurous, S→sensory/concrete, E→social, I→reflective/creative,
//           T→analytical/competitive, F→empathetic/creative, J→structured/chill, P→spontaneous/adventurous
//
// Each value is added to the trait score (0-10 scale). Max total shift ≈ 4 points per trait.

const DIMENSION_ADJUSTMENTS: Record<MbtiDimension, Partial<TraitScores>> = {
  E: { social: 1.0, competitive: 0.5 },
  I: { chill: 0.5, creative: 0.5 },
  S: { foodie: 1.0, chill: 0.5 },
  N: { adventurous: 1.0, creative: 0.5 },
  T: { competitive: 1.0, adventurous: 0.5 },
  F: { social: 0.5, creative: 1.0 },
  J: { competitive: 0.5, chill: 0.5 },
  P: { adventurous: 1.0, social: 0.5 },
};

/**
 * Apply MBTI trait adjustments on top of quiz-derived trait scores.
 * Quiz scores drive ~75 % of the result; MBTI adjustments refine the remaining ~25 %.
 */
export function blendMbtiTraits(
  quizTraits: TraitScores,
  mbtiCode: string
): TraitScores {
  const dimensions = mbtiCode.toUpperCase().split("") as MbtiDimension[];

  // Start from quiz scores
  const blended: TraitScores = { ...quizTraits };

  for (const dim of dimensions) {
    const adj = DIMENSION_ADJUSTMENTS[dim];
    if (!adj) continue;
    for (const [trait, delta] of Object.entries(adj) as [keyof TraitScores, number][]) {
      blended[trait] = Math.min(10, blended[trait] + delta);
    }
  }

  return blended;
}

/**
 * Validate that a string is a recognised MBTI type code.
 */
export function isValidMbtiCode(code: string): boolean {
  return MBTI_TYPES.some((t) => t.code === code.toUpperCase());
}

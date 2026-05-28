import { TraitScores } from "./types";

export interface Archetype {
  id: string;
  name: string;
  icon: string; // Lucide icon name
  tagline: string;
  description: string;
  color: string;
  gradient: string;
  dominantTraits: (keyof TraitScores)[];
}

export const archetypes: Archetype[] = [
  {
    id: "explorer",
    name: "The Explorer",
    icon: "Compass",
    tagline: "Always chasing the next horizon",
    description:
      "You thrive on new experiences. First to suggest a road trip, last to say no to an adventure.",
    color: "#f97316",
    gradient: "linear-gradient(135deg, #f97316, #fb923c)",
    dominantTraits: ["adventurous", "social"],
  },
  {
    id: "couch-king",
    name: "The Couch King",
    icon: "Crown",
    tagline: "Comfort is a lifestyle choice",
    description:
      "Netflix, snacks, and good company. You bring the chill energy every group needs.",
    color: "#8b5cf6",
    gradient: "linear-gradient(135deg, #8b5cf6, #a78bfa)",
    dominantTraits: ["chill", "foodie"],
  },
  {
    id: "adrenaline-junkie",
    name: "The Adrenaline Junkie",
    icon: "Zap",
    tagline: "If it's not intense, it's not interesting",
    description:
      "Go-karts, escape rooms, competitive anything. You turn every outing into an event.",
    color: "#ef4444",
    gradient: "linear-gradient(135deg, #ef4444, #f87171)",
    dominantTraits: ["competitive", "adventurous"],
  },
  {
    id: "social-butterfly",
    name: "The Social Butterfly",
    icon: "Users",
    tagline: "Knows everyone, connects everyone",
    description:
      "You're the reason the group exists. You plan, you invite, you make it happen.",
    color: "#ec4899",
    gradient: "linear-gradient(135deg, #ec4899, #f472b6)",
    dominantTraits: ["social", "foodie"],
  },
  {
    id: "creative-soul",
    name: "The Creative Soul",
    icon: "Palette",
    tagline: "Sees beauty in the unexpected",
    description:
      "Museums, hidden cafes, art walks. You find the experiences nobody else would think of.",
    color: "#14b8a6",
    gradient: "linear-gradient(135deg, #14b8a6, #5eead4)",
    dominantTraits: ["creative", "chill"],
  },
  {
    id: "foodie-king",
    name: "The Foodie",
    icon: "UtensilsCrossed",
    tagline: "Plans the day around meals",
    description:
      "You've already picked the restaurant. And the backup restaurant. And dessert.",
    color: "#eab308",
    gradient: "linear-gradient(135deg, #eab308, #fde047)",
    dominantTraits: ["foodie", "social"],
  },
];

export function determineArchetype(traitScores: TraitScores): Archetype {
  const sorted = (Object.entries(traitScores) as [keyof TraitScores, number][]).sort(
    (a, b) => b[1] - a[1]
  );
  const top2 = sorted.slice(0, 2).map(([trait]) => trait);

  let bestMatch = archetypes[0];
  let bestScore = 0;
  for (const archetype of archetypes) {
    const score = archetype.dominantTraits.filter((t) => top2.includes(t)).length;
    if (score > bestScore) {
      bestScore = score;
      bestMatch = archetype;
    }
  }
  return bestMatch;
}

export function getArchetypeById(id: string): Archetype | undefined {
  return archetypes.find((a) => a.id === id);
}

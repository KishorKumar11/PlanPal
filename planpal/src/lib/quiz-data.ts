import { TraitScores } from "./types";

export interface QuizOption {
  text: string;
  traits: Partial<TraitScores>;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: QuizOption[];
}

export const quizQuestions: QuizQuestion[] = [
  {
    id: "q1",
    question: "It's Saturday morning. You're most likely...",
    options: [
      { text: "Planning a spontaneous day trip", traits: { adventurous: 2, social: 1 } },
      { text: "Still in bed, no regrets", traits: { chill: 2, foodie: 1 } },
      { text: "At brunch with friends", traits: { social: 2, foodie: 1 } },
      { text: "Working on a creative project", traits: { creative: 2, chill: 1 } },
    ],
  },
  {
    id: "q2",
    question: "Your ideal vacation involves...",
    options: [
      { text: "Hiking and camping in the wild", traits: { adventurous: 2, competitive: 1 } },
      { text: "Exploring a new city's food scene", traits: { foodie: 2, social: 1 } },
      { text: "Beach, cocktails, zero plans", traits: { chill: 2, social: 1 } },
      { text: "Museums, galleries, hidden gems", traits: { creative: 2, adventurous: 1 } },
    ],
  },
  {
    id: "q3",
    question: "At a party you're the person who...",
    options: [
      { text: "Took over the playlist", traits: { creative: 2, social: 1 } },
      { text: "Organised all the party games", traits: { social: 2, competitive: 1 } },
      { text: "Left early for the after-party", traits: { adventurous: 2, competitive: 1 } },
      { text: "Found the best spot and stayed there", traits: { chill: 2, foodie: 1 } },
    ],
  },
  {
    id: "q4",
    question: "Pick a superpower:",
    options: [
      { text: "Teleportation — anywhere, instantly", traits: { adventurous: 2, chill: 1 } },
      { text: "Mind reading — know what everyone thinks", traits: { social: 2, creative: 1 } },
      { text: "Time control — pause, rewind, slow down", traits: { chill: 2, competitive: 1 } },
      { text: "Shapeshifting — become anyone", traits: { creative: 2, social: 1 } },
    ],
  },
  {
    id: "q5",
    question: "Your friends would describe you as...",
    options: [
      { text: "The one who always has a wild idea", traits: { adventurous: 2, creative: 1 } },
      { text: "The glue that keeps everyone together", traits: { social: 2, foodie: 1 } },
      { text: "The calmest person in the room", traits: { chill: 2, creative: 1 } },
      { text: "The one who turns everything into a challenge", traits: { competitive: 2, adventurous: 1 } },
    ],
  },
  {
    id: "q6",
    question: "You get invited last minute to a 5-day trip abroad. You:",
    options: [
      { text: "Pack in 20 minutes — I'm already there", traits: { adventurous: 2, social: 1 } },
      { text: "Research the best restaurants immediately", traits: { foodie: 2, creative: 1 } },
      { text: "Ask who else is going before deciding", traits: { social: 2, chill: 1 } },
      { text: "Politely decline — too last minute", traits: { chill: 2, competitive: 1 } },
    ],
  },
  {
    id: "q7",
    question: "Your group can't agree on what to do. You suggest...",
    options: [
      { text: "An escape room — teamwork required", traits: { competitive: 2, social: 1 } },
      { text: "A food crawl — eat our way around town", traits: { foodie: 2, social: 1 } },
      { text: "Movie night — order everything", traits: { chill: 2, foodie: 1 } },
      { text: "Something none of us have tried before", traits: { adventurous: 2, creative: 1 } },
    ],
  },
  {
    id: "q8",
    question: "Which scenario sounds most like a perfect evening?",
    options: [
      { text: "Rooftop bar, new people, great view", traits: { social: 2, adventurous: 1 } },
      { text: "Tasting menu at a place with no menu", traits: { foodie: 2, creative: 1 } },
      { text: "Board games, takeout, zero agenda", traits: { chill: 2, social: 1 } },
      { text: "Trivia night — and winning it", traits: { competitive: 2, social: 1 } },
    ],
  },
  {
    id: "q9",
    question: "How do you usually end up at an event or place?",
    options: [
      { text: "I planned it for everyone", traits: { social: 2, competitive: 1 } },
      { text: "Someone dragged me along", traits: { chill: 2, adventurous: 1 } },
      { text: "I found it on a deep internet rabbit hole", traits: { creative: 2, foodie: 1 } },
      { text: "Last-minute impulse decision", traits: { adventurous: 2, competitive: 1 } },
    ],
  },
  {
    id: "q10",
    question: "What's your relationship with a busy schedule?",
    options: [
      { text: "Love it — I hate empty time slots", traits: { competitive: 2, social: 1 } },
      { text: "Balance is key — planned but breathing room", traits: { social: 2, creative: 1 } },
      { text: "Prefer spontaneous over scheduled", traits: { adventurous: 2, chill: 1 } },
      { text: "Free time is sacred, do not disturb", traits: { chill: 2, foodie: 1 } },
    ],
  },
];

export function calculateTraitScores(
  answers: { questionId: string; optionIndex: number }[]
): TraitScores {
  const scores: TraitScores = {
    adventurous: 0,
    social: 0,
    creative: 0,
    chill: 0,
    competitive: 0,
    foodie: 0,
  };

  for (const answer of answers) {
    const question = quizQuestions.find((q) => q.id === answer.questionId);
    if (!question) continue;
    const option = question.options[answer.optionIndex];
    if (!option) continue;
    for (const [trait, value] of Object.entries(option.traits) as [keyof TraitScores, number][]) {
      scores[trait] += value;
    }
  }

  return scores;
}

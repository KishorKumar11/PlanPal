import OpenAI from "openai";

export interface AIRecommendation {
  title: string;
  description: string;
  category: string;
  reasoning: string;
  price_range: string;
  duration: string;
  energy_level: string;
}

interface GroupProfile {
  memberCount: number;
  archetypes: string[];
  sharedInterests: string[];
  allInterests: string[];
  avgTraits: Record<string, number>;
}

const SYSTEM_PROMPT = `You are PlanPal's AI activity planner — fun, enthusiastic, and laser-focused on group compatibility.

Your job: given a friend group's personality profile, suggest exactly 5 activities they'd ALL genuinely enjoy together.

Rules:
- Return ONLY a valid JSON array with exactly 5 objects. Zero extra text, zero markdown fences.
- Each object must have these exact keys: title, description, category, reasoning, price_range, duration, energy_level
- category must be one of: "activity", "restaurant", "trip"
- price_range must be one of: "$", "$$", "$$$"
- duration must be one of: "2 hours", "half day", "full day", "weekend"
- energy_level must be one of: "low", "medium", "high"
- Mix categories — don't return 5 activities of the same type
- Tailor recommendations to the specific archetypes and shared interests provided
- description: 2-3 sentences on why this is perfect for THIS group specifically
- reasoning: 1 sentence linking to specific archetypes/interests from the profile`;

export async function getGroupRecommendations(
  profile: GroupProfile
): Promise<AIRecommendation[]> {
  // Groq uses the OpenAI-compatible API — no extra package needed
  const client = new OpenAI({
    apiKey: process.env.GROQ_API_KEY,
    baseURL: "https://api.groq.com/openai/v1",
  });

  const userPrompt = `GROUP PROFILE:
- Members: ${profile.memberCount}
- Personality archetypes: ${profile.archetypes.join(", ") || "unknown"}
- Shared interests (everyone likes these): ${profile.sharedInterests.join(", ") || "none yet"}
- All interests across the group: ${profile.allInterests.join(", ") || "none yet"}
- Group trait scores (1-10 scale): ${JSON.stringify(profile.avgTraits)}

Suggest 5 activities for this group. Return JSON array only.`;

  const response = await client.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: userPrompt },
    ],
    temperature: 0.8,
    max_tokens: 1500,
  });

  const text = response.choices[0]?.message?.content ?? "[]";
  const cleaned = text.replace(/```json|```/g, "").trim();

  try {
    return JSON.parse(cleaned) as AIRecommendation[];
  } catch {
    return [];
  }
}

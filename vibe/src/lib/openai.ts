import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

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

export async function getGroupRecommendations(
  profile: GroupProfile
): Promise<AIRecommendation[]> {
  const prompt = `You are a fun, enthusiastic activity planner. Given this friend group's profile, suggest 5 activities they'd all enjoy.

GROUP PROFILE:
- ${profile.memberCount} members
- Personality types: ${profile.archetypes.join(", ")}
- Shared interests: ${profile.sharedInterests.join(", ")}
- All interests: ${profile.allInterests.join(", ")}
- Group traits (1-10): ${JSON.stringify(profile.avgTraits)}

Return ONLY a JSON array with exactly 5 objects. No other text:
[{
  "title": "Activity name",
  "description": "2-3 sentence description of why this is perfect for the group",
  "category": "activity" or "restaurant" or "trip",
  "reasoning": "1 sentence explaining which personality types and interests this serves",
  "price_range": "$" or "$$" or "$$$",
  "duration": "2 hours" or "half day" or "full day" or "weekend",
  "energy_level": "low" or "medium" or "high"
}]`;

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.8,
    max_tokens: 1500,
  });

  const text = response.choices[0]?.message?.content ?? "[]";
  const cleaned = text.replace(/```json|```/g, "").trim();
  return JSON.parse(cleaned) as AIRecommendation[];
}

import Anthropic from "@anthropic-ai/sdk";

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

// Static system prompt — will be cached by Anthropic on the first call
// and served from cache on subsequent calls (saves ~90% of input token cost)
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
  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  const userPrompt = `GROUP PROFILE:
- Members: ${profile.memberCount}
- Personality archetypes: ${profile.archetypes.join(", ") || "unknown"}
- Shared interests (everyone likes these): ${profile.sharedInterests.join(", ") || "none yet"}
- All interests across the group: ${profile.allInterests.join(", ") || "none yet"}
- Group trait scores (1-10 scale): ${JSON.stringify(profile.avgTraits)}

Suggest 5 activities for this group. Return JSON array only.`;

  const message = await client.messages.create({
    model: "claude-opus-4-5",
    max_tokens: 1500,
    // Cache the static system prompt — charged at 10% of normal input token price
    // after the first request. Cache lifetime: 5 minutes (extended by each use).
    system: [
      {
        type: "text",
        text: SYSTEM_PROMPT,
        cache_control: { type: "ephemeral" },
      },
    ],
    messages: [{ role: "user", content: userPrompt }],
  });

  const text =
    message.content[0].type === "text" ? message.content[0].text : "[]";
  const cleaned = text.replace(/```json|```/g, "").trim();

  try {
    return JSON.parse(cleaned) as AIRecommendation[];
  } catch {
    // If Claude returns malformed JSON, return empty so the route can handle it
    return [];
  }
}

"use client";

import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  ResponsiveContainer,
} from "recharts";
import { TraitScores } from "@/lib/types";

interface PersonalityRadarProps {
  traitScores: TraitScores;
  color?: string;
}

const traitLabels: Record<keyof TraitScores, string> = {
  adventurous: "Adventurous",
  social: "Social",
  creative: "Creative",
  chill: "Chill",
  competitive: "Competitive",
  foodie: "Foodie",
};

export default function PersonalityRadar({
  traitScores,
  color = "#7c3aed",
}: PersonalityRadarProps) {
  const data = (Object.keys(traitLabels) as (keyof TraitScores)[]).map((key) => ({
    trait: traitLabels[key],
    value: traitScores[key],
    fullMark: 20,
  }));

  return (
    <ResponsiveContainer width="100%" height={260}>
      <RadarChart data={data} margin={{ top: 10, right: 30, bottom: 10, left: 30 }}>
        <PolarGrid stroke="rgba(255,255,255,0.1)" />
        <PolarAngleAxis
          dataKey="trait"
          tick={{ fill: "#a78bfa", fontSize: 12, fontFamily: "Inter" }}
        />
        <Radar
          name="Traits"
          dataKey="value"
          stroke={color}
          fill={color}
          fillOpacity={0.2}
          strokeWidth={2}
        />
      </RadarChart>
    </ResponsiveContainer>
  );
}

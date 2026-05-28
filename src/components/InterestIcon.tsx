import {
  Mountain, Sunset, Tent, Bike,
  UtensilsCrossed, Sandwich, Coffee, Wine, ChefHat,
  Film, Gamepad2, Dices, Mic, Lock,
  Trophy, Dumbbell, Waves, Gauge,
  Landmark, Brush, Music, Drama,
  Route, Building2, TreePine, Backpack,
  LucideProps,
} from "lucide-react";
import { ComponentType } from "react";

const iconMap: Record<string, ComponentType<LucideProps>> = {
  Mountain, Sunset, Tent, Bike,
  UtensilsCrossed, Sandwich, Coffee, Wine, ChefHat,
  Film, Gamepad2, Dices, Mic, Lock,
  Trophy, Dumbbell, Waves, Gauge,
  Landmark, Brush, Music, Drama,
  Route, Building2, TreePine, Backpack,
};

interface InterestIconProps extends LucideProps {
  name: string;
}

export default function InterestIcon({ name, ...props }: InterestIconProps) {
  const Icon = iconMap[name] ?? Mountain;
  return <Icon {...props} />;
}

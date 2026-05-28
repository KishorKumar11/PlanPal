import {
  Compass,
  Crown,
  Zap,
  Users,
  Palette,
  UtensilsCrossed,
  LucideProps,
} from "lucide-react";

const iconMap: Record<string, React.ComponentType<LucideProps>> = {
  Compass,
  Crown,
  Zap,
  Users,
  Palette,
  UtensilsCrossed,
};

interface ArchetypeIconProps extends LucideProps {
  name: string;
}

export default function ArchetypeIcon({ name, ...props }: ArchetypeIconProps) {
  const Icon = iconMap[name] ?? Compass;
  return <Icon {...props} />;
}

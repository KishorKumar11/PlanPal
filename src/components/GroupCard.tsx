"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";
import { Users, ArrowRight } from "lucide-react";
import GlowCard from "./GlowCard";

interface GroupCardMember {
  user: { name: string | null; image: string | null; archetype: string | null };
}

interface GroupCardProps {
  group: {
    id: string;
    name: string;
    description: string | null;
    members: GroupCardMember[];
  };
  index?: number;
}

export default function GroupCard({ group, index = 0 }: GroupCardProps) {
  const router = useRouter();
  const preview = group.members.slice(0, 4);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ delay: index * 0.07, duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      <GlowCard onClick={() => router.push(`/group/${group.id}`)} className="p-5 group">
        <div className="flex items-start justify-between mb-3">
          <h3 className="font-display text-lg font-semibold text-text-bright truncate pr-2 group-hover:text-white transition-colors">
            {group.name}
          </h3>
          <span className="shrink-0 inline-flex items-center gap-1 text-xs text-text-dim border border-white/10 rounded-full px-2.5 py-0.5">
            <Users size={10} />
            {group.members.length}
          </span>
        </div>

        {group.description && (
          <p className="text-text-dim text-sm mb-4 line-clamp-2 leading-relaxed">
            {group.description}
          </p>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            {preview.map((m, i) =>
              m.user.image ? (
                <Image
                  key={i}
                  src={m.user.image}
                  alt={m.user.name ?? "Member"}
                  width={28}
                  height={28}
                  className="rounded-full border-2 border-cosmos ring-0"
                  style={{ marginLeft: i > 0 ? -8 : 0 }}
                />
              ) : (
                <div
                  key={i}
                  className="w-7 h-7 rounded-full border-2 border-cosmos bg-violet/40 flex items-center justify-center text-xs font-bold text-text-bright"
                  style={{ marginLeft: i > 0 ? -8 : 0 }}
                >
                  {(m.user.name ?? "?")[0].toUpperCase()}
                </div>
              )
            )}
            {group.members.length > 4 && (
              <span className="text-xs text-text-dim ml-3">+{group.members.length - 4}</span>
            )}
          </div>
          <ArrowRight
            size={16}
            className="text-text-dim group-hover:text-text-bright group-hover:translate-x-1 transition-all duration-200"
          />
        </div>
      </GlowCard>
    </motion.div>
  );
}

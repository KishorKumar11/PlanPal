"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
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
}

export default function GroupCard({ group }: GroupCardProps) {
  const router = useRouter();
  const preview = group.members.slice(0, 4);

  return (
    <GlowCard onClick={() => router.push(`/group/${group.id}`)} className="p-5">
      <div className="flex items-start justify-between mb-3">
        <h3 className="font-display text-lg font-semibold text-text-bright truncate pr-2">
          {group.name}
        </h3>
        <span className="shrink-0 text-xs text-text-dim border border-white/10 rounded-full px-2 py-0.5">
          {group.members.length} {group.members.length === 1 ? "member" : "members"}
        </span>
      </div>

      {group.description && (
        <p className="text-text-dim text-sm mb-4 line-clamp-2">{group.description}</p>
      )}

      <div className="flex items-center gap-1">
        {preview.map((m, i) =>
          m.user.image ? (
            <Image
              key={i}
              src={m.user.image}
              alt={m.user.name ?? "Member"}
              width={28}
              height={28}
              className="rounded-full border-2 border-cosmos"
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
          <span className="text-xs text-text-dim ml-2">+{group.members.length - 4} more</span>
        )}
      </div>
    </GlowCard>
  );
}

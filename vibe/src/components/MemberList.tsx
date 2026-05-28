import Image from "next/image";
import { GroupMemberWithUser } from "@/lib/types";
import { getArchetypeById } from "@/lib/archetypes";
import ArchetypeCard from "./ArchetypeCard";

interface MemberListProps {
  members: GroupMemberWithUser[];
  createdById: string;
}

export default function MemberList({ members, createdById }: MemberListProps) {
  return (
    <div className="space-y-4">
      {members.map((member) => {
        const archetype = member.user.archetype
          ? getArchetypeById(member.user.archetype)
          : null;
        const isAdmin = member.userId === createdById;

        return (
          <div
            key={member.id}
            className="flex items-center gap-4 rounded-xl border border-white/10 bg-white/5 p-4"
          >
            {member.user.image ? (
              <Image
                src={member.user.image}
                alt={member.user.name ?? "Member"}
                width={44}
                height={44}
                className="rounded-full shrink-0"
              />
            ) : (
              <div className="w-11 h-11 rounded-full bg-violet/30 flex items-center justify-center text-lg font-bold text-text-bright shrink-0">
                {(member.user.name ?? member.user.email)[0].toUpperCase()}
              </div>
            )}

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-medium text-text-bright truncate">
                  {member.user.name ?? member.user.email}
                </span>
                {isAdmin && (
                  <span className="text-xs border border-yellow-400/40 text-yellow-400 rounded-full px-2 py-0.5">
                    Admin ★
                  </span>
                )}
              </div>
              {archetype && (
                <div className="mt-1">
                  <ArchetypeCard archetype={archetype} compact />
                </div>
              )}
              {!archetype && (
                <span className="text-xs text-text-dim">Quiz not completed</span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

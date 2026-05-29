"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { ShieldCheck } from "lucide-react";
import { GroupMemberWithUser } from "@/lib/types";
import { getArchetypeById } from "@/lib/archetypes";
import { getMbtiType, MBTI_GROUP_COLORS } from "@/lib/mbti";
import ArchetypeCard from "./ArchetypeCard";

interface MemberListProps {
  members: GroupMemberWithUser[];
  createdById: string;
}

export default function MemberList({ members, createdById }: MemberListProps) {
  return (
    <div className="space-y-3">
      {members.map((member, i) => {
        const archetype = member.user.archetype
          ? getArchetypeById(member.user.archetype)
          : null;
        const mbtiType = member.user.mbtiType
          ? getMbtiType(member.user.mbtiType)
          : null;
        const isAdmin = member.userId === createdById;

        return (
          <motion.div
            key={member.id}
            initial={{ opacity: 0, x: -16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ delay: i * 0.06, duration: 0.3, ease: "easeOut" }}
            className="flex items-center gap-4 rounded-xl border border-white/10 bg-white/5 p-4 hover:border-white/20 transition-colors duration-200"
          >
            {member.user.image ? (
              <Image
                src={member.user.image}
                alt={member.user.name ?? "Member"}
                width={44}
                height={44}
                className="rounded-full shrink-0 ring-2 ring-white/10"
              />
            ) : (
              <div className="w-11 h-11 rounded-full bg-violet/30 flex items-center justify-center text-base font-bold text-text-bright shrink-0 ring-2 ring-violet/20">
                {(member.user.name ?? member.user.email)[0].toUpperCase()}
              </div>
            )}

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <span className="font-medium text-text-bright truncate">
                  {member.user.name ?? member.user.email}
                </span>
                {isAdmin && (
                  <span className="inline-flex items-center gap-1 text-xs border border-yellow-400/40 text-yellow-400 rounded-full px-2 py-0.5 bg-yellow-400/10">
                    <ShieldCheck size={10} />
                    Admin
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                {archetype ? (
                  <ArchetypeCard archetype={archetype} compact />
                ) : (
                  <span className="text-xs text-text-dim">Quiz not completed</span>
                )}
                {mbtiType && (
                  <span
                    className="text-xs font-bold rounded-full px-2.5 py-0.5"
                    style={{
                      color: MBTI_GROUP_COLORS[mbtiType.group],
                      background: `${MBTI_GROUP_COLORS[mbtiType.group]}18`,
                      border: `1px solid ${MBTI_GROUP_COLORS[mbtiType.group]}44`,
                    }}
                  >
                    {mbtiType.code}
                  </span>
                )}
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

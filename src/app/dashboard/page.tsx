import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getArchetypeById } from "@/lib/archetypes";
import Navbar from "@/components/Navbar";
import GroupCard from "@/components/GroupCard";
import ArchetypeCard from "@/components/ArchetypeCard";
import ArchetypeIcon from "@/components/ArchetypeIcon";
import PageWrapper from "@/components/PageWrapper";
import { Plus, Users } from "lucide-react";

export const metadata: Metadata = {
  title: "Dashboard — PlanPal",
};

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/auth/signin");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { archetype: true, quizCompletedAt: true },
  });

  if (!user?.quizCompletedAt) redirect("/onboarding/quiz");

  const groups = await prisma.vibeGroup.findMany({
    where: { members: { some: { userId: session.user.id } } },
    include: {
      members: {
        include: {
          user: { select: { id: true, name: true, image: true, archetype: true } },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const archetype = user.archetype ? getArchetypeById(user.archetype) : null;

  return (
    <>
      <Navbar user={session.user} />
      <main className="min-h-screen pt-24 pb-16 px-4">
        <div className="mx-auto max-w-4xl">
          <PageWrapper>
            {/* Archetype banner */}
            {archetype && (
              <div className="mb-8 flex items-center justify-between flex-wrap gap-4 rounded-2xl border border-white/10 bg-white/5 px-5 py-4">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                    style={{ background: `${archetype.color}20`, color: archetype.color }}
                  >
                    <ArchetypeIcon name={archetype.icon} size={20} />
                  </div>
                  <div>
                    <p className="text-text-dim text-xs uppercase tracking-widest">Your archetype</p>
                    <h2 className="font-display text-lg font-bold" style={{ color: archetype.color }}>
                      {archetype.name}
                    </h2>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <ArchetypeCard archetype={archetype} compact />
                  <Link
                    href="/onboarding/quiz"
                    className="text-xs text-text-dim hover:text-text-bright border border-white/10 hover:border-white/20 rounded-full px-3 py-1.5 transition-all duration-200"
                  >
                    Retake quiz
                  </Link>
                </div>
              </div>
            )}

            {/* Groups header */}
            <div className="flex items-center justify-between mb-6">
              <h1 className="font-display text-2xl font-bold text-text-bright">Your Groups</h1>
              <Link
                href="/group/create"
                className="inline-flex items-center gap-1.5 rounded-full bg-gradient-vibe px-4 py-2 text-sm font-semibold text-white hover:opacity-90 active:scale-95 transition-all duration-150 shadow-[0_0_20px_rgba(124,58,237,0.3)]"
              >
                <Plus size={15} />
                Create Group
              </Link>
            </div>

            {/* Empty state */}
            {groups.length === 0 ? (
              <div className="text-center py-20 rounded-2xl border border-white/10 bg-white/5">
                <div className="w-16 h-16 rounded-2xl bg-violet/20 border border-violet/20 flex items-center justify-center mx-auto mb-4">
                  <Users size={28} className="text-violet" />
                </div>
                <h3 className="font-display text-xl font-semibold text-text-bright mb-2">
                  No groups yet
                </h3>
                <p className="text-text-dim text-sm mb-6 max-w-xs mx-auto">
                  Create a group or join one with an invite link to start planning together.
                </p>
                <Link
                  href="/group/create"
                  className="inline-flex items-center gap-1.5 rounded-full bg-gradient-vibe px-6 py-2.5 text-sm font-semibold text-white hover:opacity-90 transition-opacity"
                >
                  <Plus size={15} />
                  Start a group
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {groups.map((g, i) => (
                  <GroupCard key={g.id} group={g} index={i} />
                ))}
              </div>
            )}
          </PageWrapper>
        </div>
      </main>
    </>
  );
}

export function DashboardSkeleton() {
  return (
    <>
      <div className="h-20 rounded-2xl bg-white/5 animate-pulse mb-8" />
      <div className="flex justify-between mb-6">
        <div className="h-8 w-36 rounded-full bg-white/5 animate-pulse" />
        <div className="h-8 w-32 rounded-full bg-white/5 animate-pulse" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-36 rounded-2xl bg-white/5 animate-pulse" />
        ))}
      </div>
    </>
  );
}

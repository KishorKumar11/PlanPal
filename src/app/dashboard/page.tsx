import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getArchetypeById } from "@/lib/archetypes";
import Navbar from "@/components/Navbar";
import GroupCard from "@/components/GroupCard";
import ArchetypeCard from "@/components/ArchetypeCard";

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
          {archetype && (
            <div className="mb-8 flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{archetype.emoji}</span>
                <div>
                  <p className="text-text-dim text-xs uppercase tracking-widest">Your archetype</p>
                  <h2
                    className="font-display text-xl font-bold"
                    style={{ color: archetype.color }}
                  >
                    {archetype.name}
                  </h2>
                </div>
              </div>
              <Link
                href="/onboarding/quiz"
                className="text-xs text-text-dim hover:text-text-bright border border-white/10 rounded-full px-3 py-1.5 transition-colors"
              >
                Retake quiz
              </Link>
            </div>
          )}

          <div className="flex items-center justify-between mb-6">
            <h1 className="font-display text-2xl font-bold text-text-bright">Your Groups</h1>
            <Link
              href="/group/create"
              className="rounded-full bg-gradient-vibe px-5 py-2 text-sm font-semibold text-white hover:opacity-90 transition-opacity"
            >
              + Create Group
            </Link>
          </div>

          {groups.length === 0 ? (
            <div className="text-center py-20 rounded-2xl border border-white/10 bg-white/5">
              <p className="text-5xl mb-4">🫂</p>
              <h3 className="font-display text-xl font-semibold text-text-bright mb-2">
                No groups yet
              </h3>
              <p className="text-text-dim text-sm mb-6">
                Create a group or join one with an invite link.
              </p>
              <Link
                href="/group/create"
                className="rounded-full bg-gradient-vibe px-6 py-2.5 text-sm font-semibold text-white"
              >
                Start a group
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {groups.map((g) => (
                <GroupCard key={g.id} group={g} />
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  );
}

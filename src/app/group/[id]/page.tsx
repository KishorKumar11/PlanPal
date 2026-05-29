import type { Metadata } from "next";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { TraitScores, PastPlan } from "@/lib/types";
import Navbar from "@/components/Navbar";
import MemberList from "@/components/MemberList";
import CompatibilityScore from "@/components/CompatibilityScore";
import PersonalityRadar from "@/components/PersonalityRadar";
import GlowCard from "@/components/GlowCard";
import PastPlans from "@/components/PastPlans";
import { Trophy, CalendarDays, Vote, Sparkles, AlertCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Group — PlanPal",
};
import CopyInviteButton from "./CopyInviteButton";

export default async function GroupDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ welcome?: string }>;
}) {
  const session = await auth();
  if (!session?.user?.id) redirect("/auth/signin");

  const { id } = await params;
  const { welcome } = await searchParams;

  const group = await prisma.vibeGroup.findUnique({
    where: { id },
    include: {
      members: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
              archetype: true,
              mbtiType: true,
              traitScores: true,
              interests: true,
            },
          },
        },
        orderBy: { joinedAt: "asc" },
      },
      recommendations: {
        include: { votes: true },
        orderBy: { createdAt: "desc" },
        take: 5,
      },
      plans: { orderBy: { completedAt: "desc" } },
    },
  });

  if (!group) notFound();

  const isMember = group.members.some((m) => m.userId === session.user.id);
  if (!isMember) redirect("/dashboard");

  const me = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { mbtiType: true, quizCompletedAt: true },
  });
  const profileIncomplete = !me?.mbtiType || !me?.quizCompletedAt;

  const lockedRec =
    group.planStatus === "locked" && group.lockedRecommendationId
      ? await prisma.recommendation.findUnique({
          where: { id: group.lockedRecommendationId },
          select: { title: true, category: true },
        })
      : null;

  const pastPlans: PastPlan[] = group.plans.map((p) => ({
    id: p.id,
    title: p.title,
    category: p.category,
    description: p.description,
    reasoning: p.reasoning,
    metadata: p.metadata as unknown as PastPlan["metadata"],
    lockedDate: p.lockedDate ? p.lockedDate.toISOString() : null,
    notes: p.notes,
    completedAt: p.completedAt.toISOString(),
  }));

  const lockedDateLabel = group.lockedDate
    ? group.lockedDate.toLocaleDateString(undefined, {
        weekday: "short",
        month: "short",
        day: "numeric",
        timeZone: "UTC",
      })
    : null;

  const members = group.members.map((m) => ({
    ...m,
    user: {
      ...m.user,
      traitScores: m.user.traitScores as TraitScores | null,
    },
  }));

  const withScores = members.filter((m) => m.user.traitScores !== null);
  const avgTraits: TraitScores | null =
    withScores.length > 0
      ? (() => {
          const keys: (keyof TraitScores)[] = [
            "adventurous", "social", "creative", "chill", "competitive", "foodie",
          ];
          const result = {} as TraitScores;
          for (const k of keys) {
            result[k] =
              withScores.reduce((acc, m) => acc + (m.user.traitScores![k] ?? 0), 0) /
              withScores.length;
          }
          return result;
        })()
      : null;

  const interestCounts = new Map<string, number>();
  for (const m of members) {
    for (const i of m.user.interests) {
      interestCounts.set(i, (interestCounts.get(i) ?? 0) + 1);
    }
  }
  const sharedInterests = [...interestCounts.entries()]
    .filter(([, count]) => count >= 2)
    .map(([id]) => id);

  const inviteUrl = `${process.env.NEXTAUTH_URL ?? "http://localhost:3000"}/join/${group.inviteCode}`;

  return (
    <>
      <Navbar user={session.user} />
      <main className="min-h-screen pt-24 pb-16 px-4">
        <div className="mx-auto max-w-4xl">
          <div className="mb-2">
            <Link href="/dashboard" className="text-text-dim text-sm hover:text-text-bright transition-colors">
              ← Dashboard
            </Link>
          </div>

          <div className="flex flex-wrap items-start justify-between gap-4 mb-8">
            <div>
              <h1 className="font-display text-3xl font-bold gradient-text">{group.name}</h1>
              {group.description && <p className="text-text-dim text-sm mt-1">{group.description}</p>}
            </div>
            <CopyInviteButton inviteUrl={inviteUrl} />
          </div>

          {welcome && (
            <div className="mb-6 rounded-xl border border-violet/30 bg-violet/10 p-4 text-sm text-text-bright">
              You&apos;re in! Take the quiz so your personality shapes this group&apos;s recommendations.
            </div>
          )}

          {profileIncomplete && (
            <Link
              href="/onboarding/mbti"
              className="mb-6 flex items-center gap-3 rounded-xl border border-orange/30 bg-orange/10 p-4 text-sm text-text-bright hover:border-orange/50 transition-colors"
            >
              <AlertCircle size={18} className="text-orange shrink-0" />
              <span>
                Complete your profile to improve this group&apos;s recommendations.
                <span className="text-orange font-semibold"> Finish setup →</span>
              </span>
            </Link>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <GlowCard className="p-6 flex flex-col items-center justify-center">
              <CompatibilityScore members={members} />
            </GlowCard>

            {avgTraits && (
              <GlowCard className="p-4 lg:col-span-2">
                <p className="text-xs text-text-dim uppercase tracking-widest mb-2 px-2">
                  Group personality
                </p>
                <PersonalityRadar traitScores={avgTraits} />
              </GlowCard>
            )}
          </div>

          {sharedInterests.length > 0 && (
            <div className="mb-8">
              <p className="text-xs text-text-dim uppercase tracking-widest mb-3">Shared interests</p>
              <div className="flex flex-wrap gap-2">
                {sharedInterests.map((interest) => (
                  <span
                    key={interest}
                    className="rounded-full border border-violet/30 bg-violet/10 px-3 py-1 text-xs text-text-dim"
                  >
                    {interest}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="mb-8">
            <p className="text-xs text-text-dim uppercase tracking-widest mb-4">Members</p>
            <MemberList members={members} createdById={group.createdById} />
          </div>

          <PastPlans plans={pastPlans} />

          {group.planStatus === "locked" ? (
            <Link
              href={`/group/${id}/plan`}
              className="block rounded-2xl border border-teal-400/30 bg-teal-400/10 p-5 hover:border-teal-400/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-teal-400/15 border border-teal-400/30 flex items-center justify-center shrink-0">
                  <Trophy size={20} className="text-teal-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-teal-400 uppercase tracking-widest">Our plan</p>
                  <p className="font-display text-lg font-bold text-text-bright truncate">
                    {lockedRec?.title ?? "Locked in"}
                  </p>
                  {lockedDateLabel && (
                    <p className="text-xs text-text-dim flex items-center gap-1 mt-0.5">
                      <CalendarDays size={11} /> {lockedDateLabel}
                    </p>
                  )}
                </div>
                <span className="text-sm text-teal-400 font-semibold shrink-0">View →</span>
              </div>
            </Link>
          ) : group.planStatus === "voting" ? (
            <Link
              href={`/group/${id}/vote`}
              className="flex items-center justify-center gap-2 w-full rounded-full bg-gradient-vibe py-4 font-display text-lg font-bold text-white hover:opacity-90 transition-opacity"
            >
              <Vote size={20} /> Voting in progress — cast yours →
            </Link>
          ) : (
            <Link
              href={`/group/${id}/recommend`}
              className="flex items-center justify-center gap-2 w-full rounded-full bg-gradient-vibe py-4 font-display text-lg font-bold text-white hover:opacity-90 transition-opacity"
            >
              <Sparkles size={20} /> Get AI Recommendations →
            </Link>
          )}
        </div>
      </main>
    </>
  );
}

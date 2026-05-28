import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { TraitScores } from "@/lib/types";
import Navbar from "@/components/Navbar";
import MemberList from "@/components/MemberList";
import CompatibilityScore from "@/components/CompatibilityScore";
import PersonalityRadar from "@/components/PersonalityRadar";
import GlowCard from "@/components/GlowCard";
import CopyInviteButton from "./CopyInviteButton";

export default async function GroupDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  if (!session?.user?.id) redirect("/auth/signin");

  const { id } = await params;

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
    },
  });

  if (!group) notFound();

  const isMember = group.members.some((m) => m.userId === session.user.id);
  if (!isMember) redirect("/dashboard");

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

          <Link
            href={`/group/${id}/recommend`}
            className="block w-full text-center rounded-full bg-gradient-vibe py-4 font-display text-lg font-bold text-white hover:opacity-90 transition-opacity"
          >
            ✨ Get AI Recommendations →
          </Link>
        </div>
      </main>
    </>
  );
}

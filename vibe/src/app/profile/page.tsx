import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getArchetypeById } from "@/lib/archetypes";
import { TraitScores } from "@/lib/types";
import Navbar from "@/components/Navbar";
import ArchetypeCard from "@/components/ArchetypeCard";
import PersonalityRadar from "@/components/PersonalityRadar";
import EditInterests from "./EditInterests";

export default async function ProfilePage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/auth/signin");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      name: true,
      email: true,
      image: true,
      archetype: true,
      traitScores: true,
      interests: true,
      quizCompletedAt: true,
      quizUpdatedAt: true,
    },
  });

  if (!user) redirect("/auth/signin");

  const archetype = user.archetype ? getArchetypeById(user.archetype) : null;
  const traitScores = user.traitScores as TraitScores | null;

  return (
    <>
      <Navbar user={session.user} />
      <main className="min-h-screen pt-24 pb-16 px-4">
        <div className="mx-auto max-w-2xl">
          <h1 className="font-display text-3xl font-bold gradient-text mb-8">Your Profile</h1>

          {archetype ? (
            <div className="mb-8">
              <p className="text-xs text-text-dim uppercase tracking-widest mb-4">Your archetype</p>
              <ArchetypeCard archetype={archetype} />
              <div className="flex items-center justify-between mt-3">
                <p className="text-xs text-text-dim">
                  {user.quizUpdatedAt
                    ? `Last taken: ${new Date(user.quizUpdatedAt).toLocaleDateString()}`
                    : ""}
                </p>
                <Link
                  href="/onboarding/quiz"
                  className="text-xs text-text-dim hover:text-text-bright border border-white/10 rounded-full px-3 py-1.5 transition-colors"
                >
                  Retake quiz →
                </Link>
              </div>
            </div>
          ) : (
            <div className="mb-8 rounded-2xl border border-white/10 bg-white/5 p-6 text-center">
              <p className="text-text-dim mb-4">You haven&apos;t taken the quiz yet.</p>
              <Link
                href="/onboarding/quiz"
                className="rounded-full bg-gradient-vibe px-6 py-2.5 text-sm font-semibold text-white"
              >
                Take the quiz →
              </Link>
            </div>
          )}

          {traitScores && archetype && (
            <div className="mb-8 rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-xs text-text-dim uppercase tracking-widest mb-2 px-2">Trait profile</p>
              <PersonalityRadar traitScores={traitScores} color={archetype.color} />
            </div>
          )}

          <div className="mb-8">
            <p className="text-xs text-text-dim uppercase tracking-widest mb-4">Your interests</p>
            <EditInterests initial={user.interests} />
          </div>
        </div>
      </main>
    </>
  );
}

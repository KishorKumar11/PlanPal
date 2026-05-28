import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import GlowCard from "@/components/GlowCard";
import MemberList from "@/components/MemberList";

export default async function JoinGroupPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const session = await auth();
  if (!session?.user?.id) redirect("/auth/signin");

  const { code } = await params;

  const group = await prisma.vibeGroup.findUnique({
    where: { inviteCode: code },
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
      },
    },
  });

  if (!group) {
    return (
      <main className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-5xl mb-4">🔍</p>
          <h1 className="font-display text-2xl font-bold text-text-bright mb-2">Group not found</h1>
          <p className="text-text-dim mb-6">This invite link may be invalid or expired.</p>
          <Link href="/dashboard" className="text-violet hover:underline text-sm">Go to dashboard</Link>
        </div>
      </main>
    );
  }

  const isMember = group.members.some((m) => m.userId === session.user.id);
  if (isMember) redirect(`/group/${group.id}`);

  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <p className="text-text-dim text-sm mb-2">You&apos;ve been invited to</p>
          <h1 className="font-display text-4xl font-bold gradient-text mb-1">{group.name}</h1>
          {group.description && (
            <p className="text-text-dim text-sm">{group.description}</p>
          )}
        </div>

        <GlowCard className="p-6 mb-6">
          <p className="text-xs text-text-dim uppercase tracking-widest mb-4">
            {group.members.length} member{group.members.length !== 1 ? "s" : ""}
          </p>
          <MemberList
            members={group.members.map((m) => ({
              ...m,
              user: {
                ...m.user,
                traitScores: m.user.traitScores as import("@/lib/types").TraitScores | null,
              },
            }))}
            createdById={group.createdById}
          />
        </GlowCard>

        <form
          action={async () => {
            "use server";
            await fetch(`/api/groups/${group.id}/join`, { method: "POST" });
            redirect(`/group/${group.id}`);
          }}
        >
          <button
            type="submit"
            className="w-full rounded-full bg-gradient-vibe py-3 font-semibold text-white hover:opacity-90 transition-opacity"
          >
            Join this group →
          </button>
        </form>
      </div>
    </main>
  );
}

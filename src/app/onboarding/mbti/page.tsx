import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import MbtiPicker from "./MbtiPicker";

export const metadata: Metadata = {
  title: "Your Personality Type — PlanPal",
};

export default async function MbtiPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/auth/signin");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { mbtiType: true },
  });

  // Already completed — skip ahead
  if (user?.mbtiType) redirect("/onboarding/quiz");

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 py-16">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(124,58,237,0.1)_0%,_transparent_60%)]" />

      <div className="relative w-full max-w-3xl">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-violet/30 bg-violet/10 px-4 py-1.5 text-xs text-text-dim mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-violet" />
            Step 1 of 3
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold gradient-text mb-3">
            What&apos;s your MBTI type?
          </h1>
          <p className="text-text-dim text-sm leading-relaxed max-w-md mx-auto">
            Your MBTI type helps us fine-tune your archetype and gives the AI a richer picture of how you like to spend your time.
          </p>
        </div>

        <MbtiPicker />
      </div>
    </main>
  );
}

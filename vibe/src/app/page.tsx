import Link from "next/link";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { archetypes } from "@/lib/archetypes";

export default async function LandingPage() {
  const session = await auth();
  if (session?.user?.id) redirect("/dashboard");

  const steps = [
    {
      num: "01",
      title: "Take the quiz",
      desc: "10 fun questions reveal your personality archetype — The Explorer, Couch King, and more.",
      emoji: "🧠",
    },
    {
      num: "02",
      title: "Create or join a group",
      desc: "Invite your friends with a single link. See how your personalities mix.",
      emoji: "🫂",
    },
    {
      num: "03",
      title: "Get AI recommendations",
      desc: "Our AI analyses your whole group and suggests activities everyone will actually enjoy.",
      emoji: "✨",
    },
  ];

  return (
    <>
      <Navbar user={null} />
      <main className="min-h-screen">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(124,58,237,0.2)_0%,_transparent_60%)] pointer-events-none" />

        {/* Hero */}
        <section className="relative pt-32 pb-20 px-4 text-center">
          <div className="mx-auto max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-violet/30 bg-violet/10 px-4 py-1.5 text-xs text-text-dim mb-8">
              <span className="w-1.5 h-1.5 rounded-full bg-violet animate-pulse" />
              AI-powered group planning
            </div>

            <h1 className="font-display text-5xl sm:text-7xl font-bold leading-tight mb-6">
              <span className="gradient-text">Find your vibe.</span>
              <br />
              <span className="text-text-bright">Plan with friends.</span>
            </h1>

            <p className="text-text-dim text-lg sm:text-xl leading-relaxed max-w-xl mx-auto mb-10">
              Stop arguing about what to do. Vibe analyses everyone&apos;s personalities and finds activities your whole group will love.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/auth/signin"
                className="rounded-full bg-gradient-vibe px-8 py-4 font-display text-lg font-bold text-white hover:opacity-90 transition-opacity shadow-[0_0_40px_rgba(124,58,237,0.3)]"
              >
                Get Started — it&apos;s free
              </Link>
              <Link
                href="#how-it-works"
                className="rounded-full border border-white/20 px-8 py-4 font-semibold text-text-dim hover:border-white/40 hover:text-text-bright transition-all"
              >
                See how it works
              </Link>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section id="how-it-works" className="py-20 px-4">
          <div className="mx-auto max-w-4xl">
            <p className="text-center text-xs text-text-dim uppercase tracking-widest mb-12">
              How it works
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {steps.map((step) => (
                <div
                  key={step.num}
                  className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center"
                >
                  <div className="text-4xl mb-4">{step.emoji}</div>
                  <div className="font-display text-xs text-text-dim mb-2">{step.num}</div>
                  <h3 className="font-display text-xl font-bold text-text-bright mb-2">
                    {step.title}
                  </h3>
                  <p className="text-text-dim text-sm leading-relaxed">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Archetypes preview */}
        <section className="py-20 px-4">
          <div className="mx-auto max-w-5xl">
            <p className="text-center text-xs text-text-dim uppercase tracking-widest mb-4">
              6 archetypes
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-center gradient-text mb-12">
              Which one are you?
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {archetypes.map((archetype) => (
                <div
                  key={archetype.id}
                  className="rounded-2xl border border-white/10 p-5 text-center hover:border-white/20 transition-all"
                  style={{ background: `${archetype.color}0d` }}
                >
                  <div className="text-3xl mb-2">{archetype.emoji}</div>
                  <h3
                    className="font-display text-sm font-bold mb-1"
                    style={{ color: archetype.color }}
                  >
                    {archetype.name}
                  </h3>
                  <p className="text-text-dim text-xs italic">{archetype.tagline}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 px-4 text-center">
          <div className="mx-auto max-w-xl">
            <h2 className="font-display text-4xl font-bold text-text-bright mb-4">
              Ready to stop arguing and start vibing?
            </h2>
            <p className="text-text-dim mb-8">Free to use. No credit card required.</p>
            <Link
              href="/auth/signin"
              className="rounded-full bg-gradient-vibe px-10 py-4 font-display text-lg font-bold text-white hover:opacity-90 transition-opacity"
            >
              Find your archetype →
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

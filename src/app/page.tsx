import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Brain, Users, Sparkles, ArrowRight, Zap, Star } from "lucide-react";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { archetypes } from "@/lib/archetypes";
import ArchetypeIcon from "@/components/ArchetypeIcon";
import AnimatedSection from "@/components/AnimatedSection";
import RecommendationCarousel from "@/components/RecommendationCarousel";

export const metadata: Metadata = {
  title: "PlanPal — AI Group Activity Planner",
  description:
    "Find your archetype. Plan with friends. Get AI-powered activity recommendations that the whole group will love.",
};

const steps = [
  {
    num: "01",
    title: "Take the quiz",
    desc: "10 questions reveal your personality archetype — The Explorer, Couch King, and more.",
    Icon: Brain,
    color: "#7c3aed",
  },
  {
    num: "02",
    title: "Create or join a group",
    desc: "Invite friends with a single link. See how your personalities mix together.",
    Icon: Users,
    color: "#ec4899",
  },
  {
    num: "03",
    title: "Get AI recommendations",
    desc: "AI analyses your whole group and suggests activities everyone will actually enjoy.",
    Icon: Sparkles,
    color: "#f97316",
  },
];

// Curated Unsplash photos — best-in-class activity shots
const activityPhotos = [
  {
    id: "photo-1414235077428-338989a2e8c0",
    alt: "Beautiful restaurant dining experience",
    label: "Dinner nights",
    color: "#ec4899",
  },
  {
    id: "photo-1551632811-561732d1e306",
    alt: "Epic mountain trail adventure",
    label: "Outdoor adventures",
    color: "#f97316",
  },
  {
    id: "photo-1501281668745-f7f57925c3b4",
    alt: "Electric concert atmosphere",
    label: "Live events",
    color: "#7c3aed",
  },
];

export default async function LandingPage() {
  const session = await auth();
  if (session?.user?.id) redirect("/dashboard");

  return (
    <>
      <Navbar user={null} />
      <main className="min-h-screen overflow-hidden">

        {/* ── Background blobs ───────────────────────────────── */}
        <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
          <div
            className="animate-blob animation-delay-0 absolute -top-40 -left-40 w-[600px] h-[600px] opacity-20"
            style={{ background: "radial-gradient(circle, #7c3aed, transparent 70%)" }}
          />
          <div
            className="animate-blob animation-delay-2000 absolute top-60 -right-40 w-[500px] h-[500px] opacity-15"
            style={{ background: "radial-gradient(circle, #ec4899, transparent 70%)" }}
          />
          <div
            className="animate-blob animation-delay-4000 absolute -bottom-40 left-1/3 w-[450px] h-[450px] opacity-10"
            style={{ background: "radial-gradient(circle, #f97316, transparent 70%)" }}
          />
        </div>

        {/* ── Hero ──────────────────────────────────────────── */}
        <section className="relative pt-32 pb-20 px-4 text-center">
          <div className="mx-auto max-w-4xl">

            {/* Badge */}
            <div className="animate-in inline-flex items-center gap-2 rounded-full border border-violet/30 bg-violet/10 px-4 py-1.5 text-xs text-text-dim mb-8 backdrop-blur-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-violet animate-pulse" />
              AI-powered group planning · Free to use
            </div>

            <h1 className="animate-in animation-delay-200 font-display text-5xl sm:text-7xl font-bold leading-tight mb-6">
              <span className="gradient-text">Stop arguing.</span>
              <br />
              <span className="text-text-bright">Start planning.</span>
            </h1>

            <p className="animate-in animation-delay-300 text-text-dim text-lg sm:text-xl leading-relaxed max-w-xl mx-auto mb-10">
              PlanPal analyses everyone&apos;s personalities and finds activities your whole group will love — every single time.
            </p>

            <div className="animate-in animation-delay-400 flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <Link
                href="/auth/signin"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-vibe px-8 py-4 font-display text-lg font-bold text-white hover:opacity-90 active:scale-95 transition-all duration-150 shadow-[0_0_50px_rgba(124,58,237,0.4)]"
              >
                Get Started — it&apos;s free
                <ArrowRight size={18} />
              </Link>
              <Link
                href="#how-it-works"
                className="rounded-full border border-white/20 px-8 py-4 font-semibold text-text-dim hover:border-white/40 hover:text-text-bright transition-all duration-200"
              >
                See how it works
              </Link>
            </div>

            {/* Floating recommendation card mockup */}
            <div className="animate-in animation-delay-500 relative mx-auto max-w-sm animate-float">
              <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-5 text-left shadow-[0_32px_80px_rgba(0,0,0,0.4)]">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-7 h-7 rounded-lg bg-violet/20 flex items-center justify-center">
                    <Sparkles size={14} className="text-violet" />
                  </div>
                  <span className="text-xs text-text-dim font-medium">AI Recommendation</span>
                  <span className="ml-auto text-xs border border-teal-400/30 text-teal-400 rounded-full px-2 py-0.5 bg-teal-400/10">New</span>
                </div>
                <h3 className="font-display text-base font-bold text-text-bright mb-1">Rooftop Cocktails at Ember</h3>
                <p className="text-text-dim text-xs leading-relaxed mb-3">Perfect for your group — 2 socialites, 1 explorer. Great vibes guaranteed.</p>
                <div className="flex gap-2">
                  <span className="text-xs border border-white/15 bg-white/5 text-text-dim rounded-full px-2.5 py-0.5">$$</span>
                  <span className="text-xs border border-white/15 bg-white/5 text-text-dim rounded-full px-2.5 py-0.5">2–3 hrs</span>
                  <span className="text-xs border border-pink/30 text-pink bg-pink/10 rounded-full px-2.5 py-0.5 flex items-center gap-1">
                    <Zap size={9} /><Zap size={9} /> high energy
                  </span>
                </div>
                <div className="flex items-center gap-1 mt-3 pt-3 border-t border-white/10">
                  {[...Array(3)].map((_, i) => (
                    <Star key={i} size={11} className="text-yellow-400 fill-yellow-400" />
                  ))}
                  <span className="text-xs text-text-dim ml-1">Loved by your whole group</span>
                </div>
              </div>
              {/* Glow beneath card */}
              <div className="absolute inset-x-8 -bottom-4 h-8 bg-violet/30 blur-xl rounded-full -z-10" />
            </div>
          </div>
        </section>

        {/* ── Social proof strip ────────────────────────────── */}
        <section className="py-8 px-4 border-y border-white/5">
          <div className="mx-auto max-w-3xl flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-center">
            {[
              { stat: "6", label: "Personality archetypes" },
              { stat: "26", label: "Interest categories" },
              { stat: "5", label: "AI picks per session" },
              { stat: "100%", label: "Free to use" },
            ].map((item) => (
              <div key={item.label} className="px-4">
                <div className="font-display text-2xl font-bold gradient-text">{item.stat}</div>
                <div className="text-xs text-text-dim mt-0.5">{item.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ── How it works ──────────────────────────────────── */}
        <section id="how-it-works" className="py-24 px-4">
          <div className="mx-auto max-w-4xl">
            <AnimatedSection className="text-center mb-14">
              <p className="text-xs text-text-dim uppercase tracking-widest mb-3">How it works</p>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-text-bright">
                Three steps to the perfect plan
              </h2>
            </AnimatedSection>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {steps.map((step, i) => (
                <AnimatedSection key={step.num} delay={i * 0.1}>
                  <div
                    className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center hover:border-white/20 transition-all duration-300 hover:-translate-y-1.5 h-full"
                  >
                    <div
                      className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-5"
                      style={{ background: `${step.color}20`, color: step.color }}
                    >
                      <step.Icon size={26} strokeWidth={1.5} />
                    </div>
                    <div className="font-display text-xs text-text-dim mb-2 tracking-widest">{step.num}</div>
                    <h3 className="font-display text-xl font-bold text-text-bright mb-2">{step.title}</h3>
                    <p className="text-text-dim text-sm leading-relaxed">{step.desc}</p>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>

        {/* ── Recommendation carousel ───────────────────────── */}
        <section className="py-20 px-4">
          <div className="mx-auto max-w-5xl">
            <AnimatedSection className="text-center mb-12">
              <p className="text-xs text-text-dim uppercase tracking-widest mb-3">See it in action</p>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-text-bright">
                AI picks your group will{" "}
                <span className="gradient-text">actually love</span>
              </h2>
              <p className="text-text-dim text-sm mt-3 max-w-md mx-auto">
                Every recommendation is tailored to your group&apos;s combined personality — not just generic suggestions.
              </p>
            </AnimatedSection>
            <AnimatedSection delay={0.1}>
              <RecommendationCarousel />
            </AnimatedSection>
          </div>
        </section>

        {/* ── Activity photos ───────────────────────────────── */}
        <section className="py-16 px-4">
          <div className="mx-auto max-w-5xl">
            <AnimatedSection className="text-center mb-12">
              <p className="text-xs text-text-dim uppercase tracking-widest mb-3">Endless possibilities</p>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-text-bright">
                Activities for every vibe
              </h2>
            </AnimatedSection>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {activityPhotos.map((photo, i) => (
                <AnimatedSection key={photo.id} delay={i * 0.12}>
                  <div className="relative overflow-hidden rounded-2xl group aspect-[4/5]">
                    <Image
                      src={`https://images.unsplash.com/${photo.id}?auto=format&fit=crop&w=600&q=85`}
                      alt={photo.alt}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      sizes="(max-width: 640px) 100vw, 33vw"
                    />
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                    {/* Label */}
                    <div className="absolute bottom-4 left-4 right-4">
                      <span
                        className="inline-block text-sm font-display font-semibold text-white px-3 py-1 rounded-full backdrop-blur-sm"
                        style={{ background: `${photo.color}60` }}
                      >
                        {photo.label}
                      </span>
                    </div>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>

        {/* ── Archetypes preview ────────────────────────────── */}
        <section className="py-20 px-4">
          <div className="mx-auto max-w-5xl">
            <AnimatedSection className="text-center mb-12">
              <p className="text-xs text-text-dim uppercase tracking-widest mb-4">6 archetypes</p>
              <h2 className="font-display text-3xl sm:text-4xl font-bold gradient-text">
                Which one are you?
              </h2>
            </AnimatedSection>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {archetypes.map((archetype, i) => (
                <AnimatedSection key={archetype.id} delay={i * 0.07}>
                  <div
                    className="rounded-2xl border border-white/10 p-5 text-center hover:border-white/25 hover:-translate-y-1.5 transition-all duration-300 cursor-default h-full"
                    style={{ background: `${archetype.color}0d` }}
                  >
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3"
                      style={{ background: `${archetype.color}22`, color: archetype.color }}
                    >
                      <ArchetypeIcon name={archetype.icon} size={22} strokeWidth={1.5} />
                    </div>
                    <h3
                      className="font-display text-sm font-bold mb-1"
                      style={{ color: archetype.color }}
                    >
                      {archetype.name}
                    </h3>
                    <p className="text-text-dim text-xs">{archetype.tagline}</p>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ───────────────────────────────────────────── */}
        <section className="py-24 px-4 text-center">
          <AnimatedSection className="mx-auto max-w-xl">
            <div className="relative rounded-3xl border border-white/10 bg-white/5 backdrop-blur-sm p-12 overflow-hidden">
              {/* Subtle glow inside */}
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(124,58,237,0.12)_0%,_transparent_70%)] pointer-events-none" />

              <h2 className="relative font-display text-3xl sm:text-4xl font-bold text-text-bright mb-4">
                Ready to stop arguing and start planning?
              </h2>
              <p className="relative text-text-dim mb-8">Free to use. No credit card required. Takes 2 minutes.</p>
              <Link
                href="/auth/signin"
                className="relative inline-flex items-center gap-2 rounded-full bg-gradient-vibe px-10 py-4 font-display text-lg font-bold text-white hover:opacity-90 active:scale-95 transition-all duration-150 shadow-[0_0_40px_rgba(124,58,237,0.35)]"
              >
                Find your archetype
                <ArrowRight size={18} />
              </Link>
            </div>
          </AnimatedSection>
        </section>
      </main>
      <Footer />
    </>
  );
}

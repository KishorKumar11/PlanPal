import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Privacy Policy — PlanPal",
};

const LAST_UPDATED = "29 May 2026";

export default function PrivacyPage() {
  return (
    <>
      <Navbar user={null} />
      <main className="min-h-screen pt-24 pb-16 px-4">
        <div className="mx-auto max-w-2xl">

          <div className="mb-8">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-sm text-text-dim hover:text-text-bright transition-colors duration-200"
            >
              <ArrowLeft size={14} />
              Back to home
            </Link>
          </div>

          <h1 className="font-display text-4xl font-bold gradient-text mb-2">Privacy Policy</h1>
          <p className="text-text-dim text-sm mb-10">Last updated: {LAST_UPDATED}</p>

          <div className="space-y-10 text-text-bright/80 text-sm leading-relaxed">

            <section>
              <h2 className="font-display text-lg font-semibold text-text-bright mb-3">1. Who we are</h2>
              <p>
                PlanPal ("we", "our", "us") is an AI-powered group activity planner. We help friends discover their personality archetypes and get tailored activity recommendations as a group. This Privacy Policy explains how we collect, use, and protect your information when you use our service at{" "}
                <span className="text-violet">planpal.app</span>.
              </p>
            </section>

            <section>
              <h2 className="font-display text-lg font-semibold text-text-bright mb-3">2. Information we collect</h2>
              <ul className="list-none space-y-3">
                {[
                  {
                    title: "Account information",
                    desc: "When you sign in with Google, we receive your name, email address, and profile photo from Google OAuth. We store this to create and identify your account.",
                  },
                  {
                    title: "Quiz responses",
                    desc: "Your answers to the 10-question personality quiz are used to calculate your trait scores and assign you an archetype. These are stored on your account.",
                  },
                  {
                    title: "Interests",
                    desc: "The interests you select are stored to personalise AI recommendations for your group.",
                  },
                  {
                    title: "Group activity",
                    desc: "We store groups you create or join, members, AI-generated recommendations, and votes cast within groups.",
                  },
                  {
                    title: "Usage data",
                    desc: "We may collect basic usage analytics (page views, feature usage) to improve the product. We do not sell this data.",
                  },
                ].map(({ title, desc }) => (
                  <li key={title} className="rounded-xl border border-white/10 bg-white/5 p-4">
                    <span className="font-medium text-text-bright">{title} — </span>
                    {desc}
                  </li>
                ))}
              </ul>
            </section>

            <section>
              <h2 className="font-display text-lg font-semibold text-text-bright mb-3">3. How we use your information</h2>
              <ul className="space-y-2">
                {[
                  "Provide and operate the PlanPal service",
                  "Generate AI activity recommendations tailored to your group",
                  "Display your archetype and trait profile to group members you invite",
                  "Send important service notifications (e.g. account security)",
                  "Improve and develop new features",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <span className="text-violet mt-0.5">→</span>
                    {item}
                  </li>
                ))}
              </ul>
            </section>

            <section>
              <h2 className="font-display text-lg font-semibold text-text-bright mb-3">4. Sharing your information</h2>
              <p className="mb-3">We do not sell your personal data. We share information only in these limited cases:</p>
              <ul className="space-y-2">
                {[
                  "With group members you have joined — your name, photo, archetype, and trait scores are visible to others in your group.",
                  "With our infrastructure providers (Supabase for database, Vercel for hosting, Groq for AI) under strict data processing agreements.",
                  "If required by law or to protect the rights and safety of PlanPal and its users.",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <span className="text-violet mt-0.5">→</span>
                    {item}
                  </li>
                ))}
              </ul>
            </section>

            <section>
              <h2 className="font-display text-lg font-semibold text-text-bright mb-3">5. Data retention</h2>
              <p>
                We retain your data for as long as your account is active. You may delete your account at any time by contacting us at{" "}
                <a href="mailto:hello@planpal.app" className="text-violet hover:underline">
                  hello@planpal.app
                </a>
                . Upon deletion, your personal data is removed within 30 days, except where we are required to retain it by law.
              </p>
            </section>

            <section>
              <h2 className="font-display text-lg font-semibold text-text-bright mb-3">6. Cookies</h2>
              <p>
                We use a single session cookie to keep you signed in (via NextAuth.js). We do not use third-party tracking cookies or advertising cookies.
              </p>
            </section>

            <section>
              <h2 className="font-display text-lg font-semibold text-text-bright mb-3">7. Your rights</h2>
              <p className="mb-3">Depending on your location, you may have the right to:</p>
              <ul className="space-y-2">
                {[
                  "Access the personal data we hold about you",
                  "Correct inaccurate data",
                  "Request deletion of your data",
                  "Object to or restrict processing of your data",
                  "Data portability — receive a copy of your data in a machine-readable format",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <span className="text-violet mt-0.5">→</span>
                    {item}
                  </li>
                ))}
              </ul>
              <p className="mt-3">
                To exercise any of these rights, email us at{" "}
                <a href="mailto:hello@planpal.app" className="text-violet hover:underline">
                  hello@planpal.app
                </a>.
              </p>
            </section>

            <section>
              <h2 className="font-display text-lg font-semibold text-text-bright mb-3">8. Security</h2>
              <p>
                We use industry-standard security practices including encrypted connections (HTTPS), hashed session tokens, and row-level access controls on our database. No method of transmission over the internet is 100% secure, but we take reasonable steps to protect your information.
              </p>
            </section>

            <section>
              <h2 className="font-display text-lg font-semibold text-text-bright mb-3">9. Changes to this policy</h2>
              <p>
                We may update this Privacy Policy from time to time. When we do, we will update the "Last updated" date at the top of this page. Continued use of PlanPal after changes constitutes your acceptance of the updated policy.
              </p>
            </section>

            <section>
              <h2 className="font-display text-lg font-semibold text-text-bright mb-3">10. Contact</h2>
              <p>
                Questions or concerns about this Privacy Policy? Reach us at{" "}
                <a href="mailto:hello@planpal.app" className="text-violet hover:underline">
                  hello@planpal.app
                </a>.
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

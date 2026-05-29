import type { Metadata } from "next";
import { signIn } from "@/lib/auth";
import GlowCard from "@/components/GlowCard";
import PlanPalLogo from "@/components/PlanPalLogo";

export const metadata: Metadata = {
  title: "Sign In — PlanPal",
};

export default function SignInPage() {
  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(124,58,237,0.15)_0%,_transparent_60%)]" />

      <div className="relative w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="font-display text-5xl font-bold gradient-text mb-3">PlanPal</h1>
          <p className="text-text-dim text-sm leading-relaxed">
            Find your archetype. Plan with friends.
          </p>
        </div>

        <GlowCard className="p-8">
          <h2 className="font-display text-xl font-bold text-text-bright text-center mb-2">
            Sign in to PlanPal
          </h2>
          <p className="text-text-dim text-sm text-center mb-8 leading-relaxed">
            Discover your personality type and get AI-powered activity recommendations your whole group will love.
          </p>

          <form
            action={async () => {
              "use server";
              await signIn("google", { redirectTo: "/dashboard" });
            }}
          >
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-3 rounded-xl border border-white/20 bg-white/5 px-4 py-3.5 text-sm font-semibold text-text-bright hover:bg-white/10 active:scale-95 transition-all duration-150 cursor-pointer"
            >
              {/* Official Google G logo */}
              <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              Continue with Google
            </button>
          </form>
        </GlowCard>
      </div>
    </main>
  );
}

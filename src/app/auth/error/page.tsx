import Link from "next/link";

export default function AuthErrorPage() {
  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center">
        <p className="text-5xl mb-4">😬</p>
        <h1 className="font-display text-2xl font-bold text-text-bright mb-2">Sign-in failed</h1>
        <p className="text-text-dim mb-6">Something went wrong. Please try again.</p>
        <Link
          href="/auth/signin"
          className="rounded-full bg-gradient-vibe px-6 py-2.5 text-sm font-semibold text-white"
        >
          Try again
        </Link>
      </div>
    </main>
  );
}

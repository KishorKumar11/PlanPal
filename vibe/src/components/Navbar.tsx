"use client";

import { signOut } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

interface NavbarProps {
  user?: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  } | null;
}

export default function Navbar({ user }: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-cosmos/80 backdrop-blur-md">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="font-display text-2xl font-bold gradient-text">
            Vibe
          </Link>

          {user ? (
            <div className="relative">
              <button
                onClick={() => setMenuOpen((o) => !o)}
                className="flex items-center gap-2 rounded-full border border-white/10 px-3 py-1.5 hover:border-violet/40 transition-colors"
              >
                {user.image && (
                  <Image
                    src={user.image}
                    alt={user.name ?? "User"}
                    width={28}
                    height={28}
                    className="rounded-full"
                  />
                )}
                <span className="text-sm text-text-bright max-w-[120px] truncate">
                  {user.name ?? user.email}
                </span>
              </button>

              {menuOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-xl border border-white/10 bg-cosmos-light/95 backdrop-blur-md shadow-2xl">
                  <div className="p-1">
                    <Link
                      href="/dashboard"
                      onClick={() => setMenuOpen(false)}
                      className="block px-4 py-2.5 text-sm text-text-bright hover:bg-white/10 rounded-lg transition-colors"
                    >
                      Dashboard
                    </Link>
                    <Link
                      href="/profile"
                      onClick={() => setMenuOpen(false)}
                      className="block px-4 py-2.5 text-sm text-text-bright hover:bg-white/10 rounded-lg transition-colors"
                    >
                      Profile
                    </Link>
                    <button
                      onClick={() => signOut({ callbackUrl: "/" })}
                      className="w-full text-left px-4 py-2.5 text-sm text-red-400 hover:bg-white/10 rounded-lg transition-colors"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/auth/signin"
              className="rounded-full bg-gradient-vibe px-5 py-2 text-sm font-semibold text-white hover:opacity-90 transition-opacity"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}

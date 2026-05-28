"use client";

import { signOut } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LayoutDashboard, User, LogOut, ChevronDown } from "lucide-react";

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
            PlanPal
          </Link>

          {user ? (
            <div className="relative">
              <button
                onClick={() => setMenuOpen((o) => !o)}
                className="flex items-center gap-2 rounded-full border border-white/10 pl-2 pr-3 py-1.5 hover:border-violet/40 transition-colors duration-200 cursor-pointer"
              >
                {user.image ? (
                  <Image
                    src={user.image}
                    alt={user.name ?? "User"}
                    width={28}
                    height={28}
                    className="rounded-full"
                  />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-violet/30 flex items-center justify-center text-xs font-bold text-text-bright">
                    {(user.name ?? user.email ?? "U")[0].toUpperCase()}
                  </div>
                )}
                <span className="text-sm text-text-bright max-w-[120px] truncate">
                  {user.name ?? user.email}
                </span>
                <motion.div
                  animate={{ rotate: menuOpen ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronDown size={14} className="text-text-dim" />
                </motion.div>
              </button>

              <AnimatePresence>
                {menuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.96 }}
                    transition={{ duration: 0.15, ease: "easeOut" }}
                    className="absolute right-0 mt-2 w-52 rounded-xl border border-white/10 bg-cosmos-light/95 backdrop-blur-md shadow-2xl shadow-black/40 overflow-hidden"
                  >
                    <div className="p-1">
                      <Link
                        href="/dashboard"
                        onClick={() => setMenuOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-text-bright hover:bg-white/10 rounded-lg transition-colors duration-150"
                      >
                        <LayoutDashboard size={14} className="text-text-dim" />
                        Dashboard
                      </Link>
                      <Link
                        href="/profile"
                        onClick={() => setMenuOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-text-bright hover:bg-white/10 rounded-lg transition-colors duration-150"
                      >
                        <User size={14} className="text-text-dim" />
                        Profile
                      </Link>
                      <div className="h-px bg-white/10 my-1" />
                      <button
                        onClick={() => signOut({ callbackUrl: "/" })}
                        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-400 hover:bg-white/10 rounded-lg transition-colors duration-150 cursor-pointer"
                      >
                        <LogOut size={14} />
                        Sign Out
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <Link
              href="/auth/signin"
              className="rounded-full bg-gradient-vibe px-5 py-2 text-sm font-semibold text-white hover:opacity-90 active:scale-95 transition-all duration-150"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}

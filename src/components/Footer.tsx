import Link from "next/link";
import { Globe, X, Mail } from "lucide-react";
import PlanPalLogo from "./PlanPalLogo";

const links = {
  product: [
    { label: "How it works", href: "/#how-it-works" },
    { label: "Archetypes", href: "/#archetypes" },
    { label: "Sign in", href: "/auth/signin" },
  ],
  legal: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
  ],
};

const socials = [
  { Icon: Globe, href: "https://planpal.app", label: "Website" },
  { Icon: X, href: "https://x.com", label: "X (Twitter)" },
  { Icon: Mail, href: "mailto:hello@planpal.app", label: "Email" },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative border-t border-white/10 mt-auto">
      {/* Subtle top glow */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-violet/40 to-transparent" />

      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">

        {/* Main footer grid */}
        <div className="py-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Brand column */}
          <div className="lg:col-span-2">
            <Link href="/" className="inline-block mb-4">
              <PlanPalLogo size="sm" />
            </Link>
            <p className="text-text-dim text-sm leading-relaxed max-w-xs">
              No more "what should we do?" back-and-forth. PlanPal analyses everyone&apos;s personalities and finds activities your whole group will love.
            </p>

            {/* Social icons */}
            <div className="flex items-center gap-3 mt-6">
              {socials.map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-8 h-8 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-text-dim hover:text-text-bright hover:border-white/25 hover:bg-white/10 transition-all duration-200"
                >
                  <Icon size={14} />
                </a>
              ))}
            </div>
          </div>

          {/* Product links */}
          <div>
            <h3 className="text-xs text-text-dim uppercase tracking-widest mb-4 font-medium">Product</h3>
            <ul className="space-y-3">
              {links.product.map(({ label, href }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="text-sm text-text-dim hover:text-text-bright transition-colors duration-200"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal links */}
          <div>
            <h3 className="text-xs text-text-dim uppercase tracking-widest mb-4 font-medium">Legal</h3>
            <ul className="space-y-3">
              {links.legal.map(({ label, href }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="text-sm text-text-dim hover:text-text-bright transition-colors duration-200"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 py-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-text-dim">
            &copy; {year} PlanPal. All rights reserved.
          </p>
          <p className="text-xs text-text-dim">
            Made with{" "}
            <span className="text-pink">♥</span>
            {" "}for groups who love great experiences together.
          </p>
        </div>
      </div>
    </footer>
  );
}

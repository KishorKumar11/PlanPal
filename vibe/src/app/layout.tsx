import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PlanPal — AI Group Activity Planner",
  description:
    "Find your archetype. Plan with friends. Get AI-powered activity recommendations that the whole group will love.",
  openGraph: {
    title: "PlanPal — AI Group Activity Planner",
    description: "Find your archetype. Plan with friends.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}

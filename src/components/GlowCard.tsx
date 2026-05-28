"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface GlowCardProps {
  children: ReactNode;
  className?: string;
  glowColor?: "purple" | "pink" | "orange" | "teal" | "yellow";
  onClick?: () => void;
  selected?: boolean;
}

const glowMap = {
  purple: "hover:shadow-[0_0_30px_rgba(124,58,237,0.4)]",
  pink: "hover:shadow-[0_0_30px_rgba(236,72,153,0.4)]",
  orange: "hover:shadow-[0_0_30px_rgba(249,115,22,0.4)]",
  teal: "hover:shadow-[0_0_30px_rgba(20,184,166,0.4)]",
  yellow: "hover:shadow-[0_0_30px_rgba(234,179,8,0.4)]",
};

const selectedBorderMap = {
  purple: "border-violet/60 shadow-[0_0_20px_rgba(124,58,237,0.3)]",
  pink: "border-pink/60 shadow-[0_0_20px_rgba(236,72,153,0.3)]",
  orange: "border-orange/60 shadow-[0_0_20px_rgba(249,115,22,0.3)]",
  teal: "border-teal-400/60 shadow-[0_0_20px_rgba(20,184,166,0.3)]",
  yellow: "border-yellow-400/60 shadow-[0_0_20px_rgba(234,179,8,0.3)]",
};

export default function GlowCard({
  children,
  className = "",
  glowColor = "purple",
  onClick,
  selected = false,
}: GlowCardProps) {
  return (
    <motion.div
      onClick={onClick}
      className={`
        rounded-2xl border bg-white/5 backdrop-blur-sm
        transition-all duration-300
        ${selected ? selectedBorderMap[glowColor] : "border-white/10"}
        ${glowMap[glowColor]}
        ${onClick ? "cursor-pointer" : ""}
        ${className}
      `}
      whileHover={onClick ? { scale: 1.02 } : undefined}
      whileTap={onClick ? { scale: 0.98 } : undefined}
      transition={{ duration: 0.15 }}
    >
      {children}
    </motion.div>
  );
}

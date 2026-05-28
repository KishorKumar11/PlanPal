"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ReactNode } from "react";

interface AnimatedSectionProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "left" | "right" | "fade";
}

export default function AnimatedSection({
  children,
  className,
  delay = 0,
  direction = "up",
}: AnimatedSectionProps) {
  const reduce = useReducedMotion();

  const variants = {
    hidden: reduce
      ? { opacity: 1, y: 0, x: 0 }
      : {
          opacity: 0,
          y: direction === "up" ? 32 : 0,
          x: direction === "left" ? -24 : direction === "right" ? 24 : 0,
        },
    visible: { opacity: 1, y: 0, x: 0 },
  };

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
      transition={{
        delay,
        duration: 0.5,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      variants={variants}
    >
      {children}
    </motion.div>
  );
}

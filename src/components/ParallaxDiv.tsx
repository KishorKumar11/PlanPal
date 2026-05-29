"use client";

import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { ReactNode, CSSProperties } from "react";

interface ParallaxDivProps {
  children: ReactNode;
  /** How fast the element moves relative to scroll. 0.1 = subtle, 0.4 = dramatic. */
  speed?: number;
  className?: string;
  style?: CSSProperties;
}

export default function ParallaxDiv({
  children,
  speed = 0.15,
  className,
  style,
}: ParallaxDivProps) {
  const reduce = useReducedMotion();
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 1000], [0, reduce ? 0 : -speed * 300]);

  return (
    <motion.div style={{ y, ...style }} className={className}>
      {children}
    </motion.div>
  );
}

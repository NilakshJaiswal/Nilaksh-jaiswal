import { motion } from "framer-motion";
import { ReactNode } from "react";
import { useReducedMotionPreference } from "../hooks/useReducedMotionPreference";

interface FadeInProps {
  children: ReactNode;
  delay?: number;
  duration?: number;
  x?: number;
  y?: number;
  className?: string;
  as?: "div" | "section" | "span" | "li" | "article";
}

/**
 * Viewport-triggered fade/slide-in wrapper used across the site for
 * consistent entrance animation. Plays once. Respects reduced-motion by
 * rendering content in place with no transform.
 */
export function FadeIn({
  children,
  delay = 0,
  duration = 0.7,
  x = 0,
  y = 30,
  className,
  as = "div",
}: FadeInProps) {
  const reduced = useReducedMotionPreference();
  const Component = (motion as unknown as Record<string, typeof motion.div>)[as];

  if (reduced) {
    const Plain = as;
    return <Plain className={className}>{children}</Plain>;
  }

  return (
    <Component
      className={className}
      initial={{ opacity: 0, x, y }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: "50px", amount: 0 }}
      transition={{ duration, delay, ease: [0.25, 0.1, 0.25, 1] }}
    >
      {children}
    </Component>
  );
}

import { useEffect, useState } from "react";

/**
 * Tracks the user's prefers-reduced-motion setting reactively, so
 * components can disable or simplify animations (video scrubbing, the
 * Magnet effect, scroll-driven text) for people who've asked for less motion.
 */
export function useReducedMotionPreference(): boolean {
  const [reduced, setReduced] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  });

  useEffect(() => {
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handler = (e: MediaQueryListEvent) => setReduced(e.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, []);

  return reduced;
}

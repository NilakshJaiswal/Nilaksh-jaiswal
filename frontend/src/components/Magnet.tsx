import { ReactNode, useEffect, useRef, useState } from "react";
import { useReducedMotionPreference } from "../hooks/useReducedMotionPreference";

interface MagnetProps {
  children: ReactNode;
  padding?: number;
  strength?: number;
  activeTransition?: string;
  inactiveTransition?: string;
  className?: string;
}

/**
 * Mouse-following magnetic hover effect. Tracks pointer position relative to
 * the element's center and applies a restrained translate3d transform.
 * Disabled on touch devices and when reduced motion is requested.
 */
export function Magnet({
  children,
  padding = 100,
  strength = 4,
  activeTransition = "transform 0.3s ease-out",
  inactiveTransition = "transform 0.6s ease-in-out",
  className,
}: MagnetProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState("translate3d(0px, 0px, 0px)");
  const [transition, setTransition] = useState(inactiveTransition);
  const reduced = useReducedMotionPreference();

  useEffect(() => {
    if (reduced) return;
    if (window.matchMedia("(pointer: coarse)").matches) return; // touch device

    function handlePointerMove(e: PointerEvent) {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const distX = e.clientX - centerX;
      const distY = e.clientY - centerY;
      const dist = Math.sqrt(distX * distX + distY * distY);
      const maxDist = Math.max(rect.width, rect.height) / 2 + padding;

      if (dist < maxDist) {
        setTransition(activeTransition);
        setTransform(`translate3d(${distX / strength}px, ${distY / strength}px, 0px)`);
      } else {
        setTransition(inactiveTransition);
        setTransform("translate3d(0px, 0px, 0px)");
      }
    }

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    return () => window.removeEventListener("pointermove", handlePointerMove);
  }, [padding, strength, activeTransition, inactiveTransition, reduced]);

  return (
    <div
      ref={ref}
      className={className}
      style={{ transform, transition, willChange: "transform" }}
    >
      {children}
    </div>
  );
}

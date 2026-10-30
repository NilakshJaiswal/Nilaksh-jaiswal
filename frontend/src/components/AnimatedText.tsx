import { useRef, CSSProperties } from "react";
import { motion, useScroll, useTransform, MotionValue } from "framer-motion";
import { useReducedMotionPreference } from "../hooks/useReducedMotionPreference";

interface AnimatedTextProps {
  text: string;
  className?: string;
  style?: CSSProperties;
}

function Char({ char, index, total, progress }: { char: string; index: number; total: number; progress: MotionValue<number> }) {
  const start = index / total;
  const end = start + 1 / total;
  const opacity = useTransform(progress, [start, end], [0.2, 1]);
  return (
    <motion.span style={{ opacity }} aria-hidden="true">
      {char}
    </motion.span>
  );
}

/**
 * Character-by-character scroll-reveal text. Each character's opacity is
 * driven by one shared scroll progress MotionValue (not per-character state),
 * so there's a single scroll listener rather than N of them.
 */
export function AnimatedText({ text, className, style }: AnimatedTextProps) {
  const ref = useRef<HTMLParagraphElement>(null);
  const reduced = useReducedMotionPreference();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.8", "end 0.2"],
  });

  const chars = text.split("");

  if (reduced) {
    return (
      <p ref={ref} className={className} style={style}>
        {text}
      </p>
    );
  }

  return (
    // pre-wrap keeps the spaces between the per-character spans visible while
    // still allowing the paragraph to wrap. (A non-breaking space would make
    // the whole paragraph one unbreakable "word" that overflows its column.)
    <p ref={ref} className={className} style={{ whiteSpace: "pre-wrap", ...style }} aria-label={text}>
      {chars.map((char, i) => (
        <Char key={i} char={char} index={i} total={chars.length} progress={scrollYProgress} />
      ))}
    </p>
  );
}

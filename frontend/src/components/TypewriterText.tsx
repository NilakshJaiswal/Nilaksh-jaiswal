import { useEffect, useRef, useState } from "react";

interface TypewriterTextProps {
  text: string;
  speed?: number;
  startDelay?: number;
  className?: string;
}

function useTypewriter(text: string, speed = 38, startDelay = 600) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDisplayed("");
    setDone(false);
    let i = 0;
    let interval: ReturnType<typeof setInterval> | undefined;

    const timeout = setTimeout(() => {
      interval = setInterval(() => {
        i += 1;
        setDisplayed(text.slice(0, i));
        if (i >= text.length) {
          if (interval) clearInterval(interval);
          setDone(true);
        }
      }, speed);
    }, startDelay);

    return () => {
      clearTimeout(timeout);
      if (interval) clearInterval(interval);
    };
  }, [text, speed, startDelay]);

  return { displayed, done };
}

/**
 * Typewriter reveal with a blinking cursor that disappears once typing
 * completes. The full text is also rendered as visually-hidden content for
 * screen readers, so the animation never hides the real copy from assistive tech.
 */
export function TypewriterText({ text, speed = 38, startDelay = 600, className }: TypewriterTextProps) {
  const { displayed, done } = useTypewriter(text, speed, startDelay);
  const reduceMotionRef = useRef(
    typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );

  const shown = reduceMotionRef.current ? text : displayed;
  const showCursor = !reduceMotionRef.current && !done;

  return (
    <span className={className} aria-label={text}>
      <span aria-hidden="true">
        {shown}
        {showCursor && (
          <span className="typewriter-cursor inline-block w-[2px] h-[1.1em] bg-white align-middle ml-[2px]" />
        )}
      </span>
    </span>
  );
}

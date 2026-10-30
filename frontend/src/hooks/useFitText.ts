import { useLayoutEffect, useRef, useState } from "react";

/**
 * Measures the rendered width of a nowrap heading at a reference font size
 * and scales it down so it always fills — but never overflows — its
 * container's width, however long the text is or however wide the viewport
 * gets. Re-measures on resize and whenever the text changes.
 */
export function useFitText<T extends HTMLElement = HTMLHeadingElement>(text: string) {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<T>(null);
  const [fontSize, setFontSize] = useState<number | null>(null);

  useLayoutEffect(() => {
    const container = containerRef.current;
    const el = textRef.current;
    if (!container || !el) return;

    function fit() {
      if (!container || !el) return;
      const REFERENCE_PX = 200;
      el.style.fontSize = `${REFERENCE_PX}px`;
      const naturalWidth = el.scrollWidth;
      const available = container.clientWidth;
      if (naturalWidth <= 0 || available <= 0) return;
      const next = (available / naturalWidth) * REFERENCE_PX;
      const maxSize = Math.max(64, window.innerHeight * 0.4);
      setFontSize(Math.min(maxSize, Math.max(24, Math.floor(next))));
    }

    fit();
    const observer = new ResizeObserver(fit);
    observer.observe(container);
    return () => observer.disconnect();
  }, [text]);

  return { containerRef, textRef, fontSize };
}

import { useEffect, useRef, useState } from "react";
import { useReducedMotionPreference } from "../hooks/useReducedMotionPreference";
import type { MarqueeItem } from "../types";

interface MarqueeSectionProps {
  items: MarqueeItem[];
}

function splitRows(items: MarqueeItem[]) {
  const mid = Math.ceil(items.length / 2);
  return [items.slice(0, mid), items.slice(mid)];
}

function Tile({ item }: { item: MarqueeItem }) {
  return (
    <div
      className="relative flex-shrink-0 rounded-2xl overflow-hidden bg-white/5"
      style={{ width: 420, height: 270 }}
    >
      <img
        src={item.imageUrl}
        alt={item.isOwnWork ? item.label || "Project preview" : `${item.label || "Inspiration reference"} (not my work)`}
        loading="lazy"
        className="w-full h-full object-cover"
      />
      {!item.isOwnWork && (
        <span className="absolute bottom-2 left-2 text-[10px] uppercase tracking-wide bg-black/60 text-mist/80 px-2 py-1 rounded-full">
          Inspiration reference
        </span>
      )}
    </div>
  );
}

export function MarqueeSection({ items }: MarqueeSectionProps) {
  const reduced = useReducedMotionPreference();
  const sectionRef = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    if (reduced) return;
    function handleScroll() {
      const section = sectionRef.current;
      if (!section) return;
      const sectionTop = section.getBoundingClientRect().top + window.scrollY;
      const raw = (window.scrollY - sectionTop + window.innerHeight) * 0.3;
      setOffset(raw);
    }
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [reduced]);

  if (!items.length) return null;

  const [row1, row2] = splitRows(items);
  const row1Tripled = [...row1, ...row1, ...row1];
  const row2Tripled = [...row2, ...row2, ...row2];

  const row1Transform = reduced ? "translateX(0)" : `translateX(${offset - 200}px)`;
  const row2Transform = reduced ? "translateX(0)" : `translateX(${-(offset - 200)}px)`;

  return (
    <section ref={sectionRef} className="bg-ink pt-24 sm:pt-32 md:pt-40 pb-10 overflow-hidden">
      <div className="flex gap-3 mb-3" style={{ willChange: "transform", transform: row1Transform }}>
        {row1Tripled.map((item, i) => (
          <Tile key={`r1-${i}-${item.imageUrl}`} item={item} />
        ))}
      </div>
      <div className="flex gap-3" style={{ willChange: "transform", transform: row2Transform }}>
        {row2Tripled.map((item, i) => (
          <Tile key={`r2-${i}-${item.imageUrl}`} item={item} />
        ))}
      </div>
    </section>
  );
}

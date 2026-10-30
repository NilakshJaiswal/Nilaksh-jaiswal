interface TechMarqueeProps {
  items: string[];
}

type Variant = "solid" | "outline";

// Sized against the half-width column the marquee sits in, not the full
// viewport. `--marquee-text` is declared on the wrapper below so the CSS that
// overlaps the two bands uses exactly the same value.
const TEXT_SIZE = "var(--marquee-text)";

function Track({ items, direction, variant }: { items: string[]; direction: "left" | "right"; variant: Variant }) {
  // Repeat the list so one "half" of the track is always wider than the box,
  // then render that half twice. Animating translateX from 0 to -50% then
  // loops seamlessly.
  const repeats = Math.max(3, Math.ceil(12 / Math.max(items.length, 1)));
  const half = Array.from({ length: repeats }, () => items).flat();
  const track = [...half, ...half];
  // Keep the on-screen speed roughly constant regardless of list length.
  const duration = half.length * 2.2;

  return (
    <div
      className="tech-marquee-track flex w-max items-center"
      style={{
        animation: `${direction === "left" ? "marquee-left" : "marquee-right"} ${duration}s linear infinite`,
      }}
    >
      {track.map((item, i) => {
        const outlined = variant === "outline" && i % 2 === 1;
        return (
          <span key={`${item}-${i}`} className="flex items-center">
            <span
              className={`font-black uppercase leading-none tracking-tight whitespace-nowrap ${
                variant === "solid" ? "text-ink" : outlined ? "tech-outline" : "hero-heading"
              }`}
              style={{ fontSize: TEXT_SIZE }}
            >
              {item}
            </span>
            <span
              className={`mx-3 sm:mx-5 ${variant === "solid" ? "text-ink/70" : "text-mist/75"}`}
              style={{ fontSize: `calc(${TEXT_SIZE} * 0.5)` }}
            >
              ✳
            </span>
          </span>
        );
      })}
    </div>
  );
}

/**
 * Two crossing bands that scroll in opposite directions, driven by the skill
 * names saved in /admin/skills. Sits inside the Skills section's half-width
 * column and clips to it.
 *
 * The animated tracks are hidden from screen readers; an sr-only list carries
 * the real content. Pauses on hover. Static under prefers-reduced-motion (the
 * global reduced-motion rule in index.css stops the animation).
 */
export function TechMarquee({ items }: TechMarqueeProps) {
  const clean = items.map((s) => s.trim()).filter(Boolean);
  if (!clean.length) return null;

  return (
    <div className="tech-marquee relative bg-ink overflow-hidden rounded-2xl py-10 sm:py-14">
      <ul className="sr-only">
        {clean.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>

      <div aria-hidden="true" className="relative">
        {/* Back band: dark, gradient + outlined text, tilted up, moves right */}
        <div className="tech-band-back relative z-0 w-[130%] -ml-[15%] border-y border-mist/15 bg-ink py-2 md:py-3">
          <Track items={clean} direction="right" variant="outline" />
        </div>

        {/* Front band: sand, solid dark text, tilted down, moves left */}
        <div
          className="tech-band-front relative z-10 w-[130%] -ml-[15%] bg-mist py-2 md:py-3"
          style={{ boxShadow: "0 20px 60px rgba(0,0,0,0.5)" }}
        >
          <Track items={clean} direction="left" variant="solid" />
        </div>
      </div>
    </div>
  );
}

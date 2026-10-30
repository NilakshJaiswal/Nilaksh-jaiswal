import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Github } from "lucide-react";
import { LiveProjectButton } from "./LiveProjectButton";
import type { Project } from "../types";

interface ProjectCardProps {
  project: Project;
  index: number;
  totalCards: number;
}

const PLACEHOLDER_IMG =
  "data:image/svg+xml;charset=utf-8," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="500"><rect width="100%" height="100%" fill="#1a1a1a"/><text x="50%" y="50%" fill="#555" font-family="sans-serif" font-size="24" text-anchor="middle">Screenshot coming soon</text></svg>`
  );

export function ProjectCard({ project, index, totalCards }: ProjectCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "start start"],
  });

  const targetScale = 1 - (totalCards - 1 - index) * 0.03;
  const scale = useTransform(scrollYProgress, [0, 1], [1, targetScale]);

  // Only render tiles we actually have an image for — no padding the grid out
  // with duplicates or placeholders beyond a single empty state.
  const gallery = [project.thumbnail, ...(project.images ?? [])].filter(Boolean) as string[];
  const tiles = gallery.length ? gallery.slice(0, 3) : [PLACEHOLDER_IMG];

  const gridCols =
    tiles.length === 1 ? "grid-cols-1" : tiles.length === 2 ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-1 sm:grid-cols-3";

  return (
    <div ref={ref} className="sticky" style={{ top: `${72 + index * 18}px` }}>
      <motion.article
        style={{ scale }}
        className="origin-top overflow-hidden rounded-[28px] sm:rounded-[36px] md:rounded-[44px] border border-mist/25 bg-[#111111] p-5 sm:p-7 md:p-9"
        aria-label={`Project: ${project.title}`}
      >
        <div className="flex flex-wrap items-start justify-between gap-4 mb-5">
          <div className="flex items-center gap-4 md:gap-6 min-w-0">
            <span
              className="hero-heading font-black leading-none shrink-0"
              style={{ fontSize: "clamp(2rem, 4.5vw, 64px)" }}
              aria-hidden="true"
            >
              {String(index + 1).padStart(2, "0")}
            </span>
            <div className="min-w-0">
              {project.category && (
                <p className="uppercase tracking-widest text-[11px] sm:text-xs text-mist/75 mb-1">
                  {project.category}
                </p>
              )}
              <h3
                className="font-medium uppercase text-mist break-words"
                style={{ fontSize: "clamp(1.1rem, 2.2vw, 1.9rem)" }}
              >
                {project.title}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${project.title} on GitHub`}
                className="inline-flex items-center justify-center w-10 h-10 rounded-full border-2 border-mist text-mist hover:bg-mist/10 transition-colors"
              >
                <Github size={17} />
              </a>
            )}
            {project.liveUrl && (
              <LiveProjectButton
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="!px-5 !py-2 !text-xs"
              />
            )}
          </div>
        </div>

        {project.shortDescription && (
          <p
            className="text-mist/75 font-light mb-4 max-w-3xl break-words"
            style={{ fontSize: "clamp(0.875rem, 1.4vw, 1.05rem)" }}
          >
            {project.shortDescription}
          </p>
        )}

        {project.technologies.length > 0 && (
          <ul className="flex flex-wrap gap-2 mb-6" aria-label="Technologies used">
            {project.technologies.map((tech) => (
              <li
                key={tech}
                className="text-[11px] uppercase tracking-wide border border-mist/25 rounded-full px-3 py-1 text-mist/75"
              >
                {tech}
              </li>
            ))}
          </ul>
        )}

        <div className={`grid gap-3 ${gridCols}`}>
          {tiles.map((src, i) => (
            <div
              key={`${src}-${i}`}
              // Fixed aspect box: the card's height follows its content, so
              // nothing can spill outside the rounded border.
              className="rounded-2xl overflow-hidden bg-black/40 border border-mist/10"
              style={{ aspectRatio: "16 / 10" }}
            >
              <img
                src={src}
                alt={`${project.title} screenshot ${i + 1}`}
                loading="lazy"
                // contain, not cover, so the whole screenshot is visible
                className="w-full h-full object-contain"
              />
            </div>
          ))}
        </div>
      </motion.article>
    </div>
  );
}

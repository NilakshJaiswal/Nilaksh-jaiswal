import { FadeIn } from "../components/FadeIn";
import { AccentHeading } from "../components/AccentHeading";
import type { Experience } from "../types";

interface ExperienceSectionProps {
  experience: Experience[];
}

function formatDate(dateStr?: string) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

export function ExperienceSection({ experience }: ExperienceSectionProps) {
  if (!experience.length) return null;

  return (
    // Left-aligned and held to roughly half the page, matching About and
    // What I Build.
    <section id="experience" className="relative z-10 px-5 sm:px-8 md:px-10 py-24 sm:py-28 md:py-32">
      <div className="glass-panel w-full max-w-3xl">
        <FadeIn y={40}>
          <AccentHeading text="My Experience" className="heading-xl mb-10 sm:mb-12" />
        </FadeIn>

        <div className="flex flex-col gap-8">
        {experience.map((item, i) => (
          <FadeIn key={item._id} delay={i * 0.1}>
            <div className="border-l-2 border-mist/20 pl-6">
              <p className="text-mist/75 text-xs uppercase tracking-widest mb-1">
                {formatDate(item.startDate)} — {item.currentlyWorking ? "Present" : formatDate(item.endDate)}
              </p>
              <h3 className="text-lg font-medium text-mist">
                {item.role} <span className="text-mist/75">· {item.company}</span>
              </h3>
              {item.employmentType && <p className="text-mist/75 text-sm">{item.employmentType}</p>}
              {item.description && <p className="text-mist/70 mt-2 text-sm leading-relaxed">{item.description}</p>}
              {item.technologies.length > 0 && (
                <ul className="flex flex-wrap gap-2 mt-3" aria-label="Technologies used">
                  {item.technologies.map((tech) => (
                    <li key={tech} className="text-xs uppercase tracking-wide border border-mist/20 rounded-full px-3 py-1 text-mist/75">
                      {tech}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

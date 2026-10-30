import { FadeIn } from "../components/FadeIn";
import { AccentHeading } from "../components/AccentHeading";
import { TechMarquee } from "../components/TechMarquee";
import type { Skill } from "../types";

interface SkillsSectionProps {
  skills: Skill[];
}

export function SkillsSection({ skills }: SkillsSectionProps) {
  // Every visible skill saved in /admin/skills scrolls past in the marquee,
  // in the order the admin list defines.
  const names = skills.map((skill) => skill.name.trim()).filter(Boolean);

  if (!names.length) {
    return (
      <section id="skills" className="relative z-10 px-5 sm:px-8 md:px-10 py-24">
        <p className="text-mist/75 text-sm uppercase tracking-widest">Skills coming soon</p>
      </section>
    );
  }

  // Left-aligned and held to roughly half the page, matching About,
  // What I Build and Experience.
  return (
    <section id="skills" className="relative z-10 px-5 sm:px-8 md:px-10 py-20 sm:py-24 md:py-28">
      <div className="glass-panel w-full max-w-3xl">
        <FadeIn y={40}>
          <AccentHeading text="My Skills" className="heading-xl mb-10 sm:mb-12" />
        </FadeIn>

        <TechMarquee items={names} />
      </div>
    </section>
  );
}

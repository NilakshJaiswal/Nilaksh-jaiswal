import { FadeIn } from "../components/FadeIn";
import { AccentHeading } from "../components/AccentHeading";
import { AnimatedText } from "../components/AnimatedText";
import type { AboutContent } from "../types";

interface AboutSectionProps {
  about: AboutContent | null;
}

/** Shown until an education line is saved in /admin/about. */
const DEFAULT_EDUCATION = "SRM Institute of Science and Technology";

export function AboutSection({ about }: AboutSectionProps) {
  if (!about || about.visible === false) {
    return (
      <section
        id="about"
        className="relative z-10 min-h-[50vh] flex items-center px-5 sm:px-8 md:px-10 py-20"
      >
        <p className="text-mist/75 text-sm uppercase tracking-widest">About content coming soon</p>
      </section>
    );
  }

  return (
    <section
      id="about"
      className="relative z-10 min-h-screen flex flex-col justify-center px-5 sm:px-8 md:px-10 py-24"
    >
      <div className="glass-panel w-full max-w-3xl">
        <FadeIn y={40}>
          <AccentHeading text={about.heading || "About Me"} className="heading-xl mb-10 sm:mb-12" />
        </FadeIn>

        {about.introduction && (
          <AnimatedText
            text={about.introduction}
            className="font-semibold leading-relaxed mb-8"
            style={{ color: "#F3E8D3", fontSize: "clamp(1rem, 1.9vw, 1.3rem)" }}
          />
        )}

        {about.biography && (
          <FadeIn delay={0.1}>
            <p className="font-bold italic text-mist leading-relaxed mb-10 text-sm sm:text-base md:text-lg">
              {about.biography}
            </p>
          </FadeIn>
        )}

        <FadeIn delay={0.15}>
          <p className="text-mist/75 uppercase tracking-widest text-xs mb-2">Education</p>
          <p className="font-bold text-mist text-base sm:text-lg md:text-xl">
            {about.education || DEFAULT_EDUCATION}
          </p>
        </FadeIn>
      </div>
    </section>
  );
}

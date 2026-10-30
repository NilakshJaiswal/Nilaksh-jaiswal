import { FadeIn } from "../components/FadeIn";
import { AccentHeading } from "../components/AccentHeading";
import type { Service } from "../types";

interface ServicesSectionProps {
  services: Service[];
}

export function ServicesSection({ services }: ServicesSectionProps) {
  if (!services.length) return null;

  // Same shape as the About section: transparent (the hero video shows
  // through), left-aligned, and held to roughly half the page width.
  return (
    <section
      id="services"
      className="relative z-10 min-h-screen flex flex-col justify-center px-5 sm:px-8 md:px-10 py-24"
    >
      <div className="glass-panel w-full max-w-3xl">
        <FadeIn y={40}>
          <AccentHeading text="What I Build" className="heading-xl mb-10 sm:mb-12" />
        </FadeIn>

        <div className="border-t border-mist/15">
          {services.map((service, i) => (
            <FadeIn key={service._id} delay={i * 0.08}>
              <div className="flex gap-4 sm:gap-7 py-7 sm:py-8 border-b border-mist/15">
                <span
                  className="hero-heading font-black leading-none shrink-0"
                  style={{ fontSize: "clamp(1.75rem, 3.5vw, 48px)" }}
                  aria-hidden="true"
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="min-w-0">
                  <h3
                    className="font-semibold uppercase tracking-wide text-mist mb-2 break-words"
                    style={{ fontSize: "clamp(1rem, 1.9vw, 1.5rem)" }}
                  >
                    {service.title}
                  </h3>
                  <p
                    className="font-light leading-relaxed text-mist/70 break-words"
                    style={{ fontSize: "clamp(0.875rem, 1.3vw, 1.05rem)" }}
                  >
                    {service.description}
                  </p>
                  {service.ctaLabel && service.ctaLink && (
                    <a
                      href={service.ctaLink}
                      className="inline-block mt-3 underline underline-offset-4 text-sm font-medium text-mist"
                    >
                      {service.ctaLabel}
                    </a>
                  )}
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

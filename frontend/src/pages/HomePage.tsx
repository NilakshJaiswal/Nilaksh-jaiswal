import { useEffect } from "react";
import { useContent } from "../hooks/useContent";
import { HeroSection } from "../sections/HeroSection";
import { MarqueeSection } from "../sections/MarqueeSection";
import { AboutSection } from "../sections/AboutSection";
import { SkillsSection } from "../sections/SkillsSection";
import { ServicesSection } from "../sections/ServicesSection";
import { ProjectsSection } from "../sections/ProjectsSection";
import { ExperienceSection } from "../sections/ExperienceSection";
import { ContactSection } from "../sections/ContactSection";
import { Footer } from "../components/Footer";
import type {
  SettingsContent,
  AboutContent,
  ContactContent,
  Skill,
  Service,
  Project,
  Experience,
} from "../types";

export function HomePage() {
  const { data: settings } = useContent<SettingsContent>("/settings");
  const { data: about } = useContent<AboutContent>("/about");
  const { data: contact } = useContent<ContactContent>("/contact");
  const { data: skills } = useContent<Skill[]>("/skills");
  const { data: services } = useContent<Service[]>("/services");
  const { data: projects } = useContent<Project[]>("/projects");
  const { data: experience } = useContent<Experience[]>("/experience");

  useEffect(() => {
    if (settings?.pageTitle) document.title = settings.pageTitle;
    if (settings?.metaDescription) {
      let meta = document.querySelector('meta[name="description"]');
      if (!meta) {
        meta = document.createElement("meta");
        meta.setAttribute("name", "description");
        document.head.appendChild(meta);
      }
      meta.setAttribute("content", settings.metaDescription);
    }
    if (settings?.favicon) {
      let link = document.querySelector<HTMLLinkElement>('link[rel="icon"]');
      if (link) link.href = settings.favicon;
    }
  }, [settings]);

  const visibility = settings?.sectionVisibility ?? {
    hero: true,
    marquee: true,
    about: true,
    skills: true,
    services: true,
    projects: true,
    experience: true,
    contact: true,
  };

  return (
    <main className="min-h-screen overflow-x-clip">
      {visibility.hero && <HeroSection settings={settings} />}
      {visibility.marquee && <MarqueeSection items={settings?.marqueeItems ?? []} />}
      {visibility.about && <AboutSection about={about} />}
      {visibility.skills && <SkillsSection skills={skills ?? []} />}
      {visibility.experience && <ExperienceSection experience={experience ?? []} />}
      {visibility.services && <ServicesSection services={services ?? []} />}
      {visibility.projects && <ProjectsSection projects={projects ?? []} />}
      {visibility.contact && <ContactSection contact={contact} />}
      <Footer contact={contact} copyrightText={settings?.copyrightText} />
    </main>
  );
}

import { FadeIn } from "../components/FadeIn";
import { AccentHeading } from "../components/AccentHeading";
import { ProjectCard } from "../components/ProjectCard";
import type { Project } from "../types";

interface ProjectsSectionProps {
  projects: Project[];
}

export function ProjectsSection({ projects }: ProjectsSectionProps) {
  return (
    <section
      id="projects"
      className="relative z-10 bg-ink rounded-t-[40px] sm:rounded-t-[50px] md:rounded-t-[60px] -mt-10 sm:-mt-12 md:-mt-14 px-5 sm:px-8 md:px-10 pt-20 sm:pt-24 md:pt-28 pb-24"
    >
      <FadeIn y={40}>
        <AccentHeading text="Featured Projects" className="heading-xl text-center mb-14 sm:mb-16" />
      </FadeIn>

      {projects.length === 0 ? (
        <p className="text-center text-mist/75 text-sm uppercase tracking-widest">Projects coming soon</p>
      ) : (
        <div className="flex flex-col gap-8 md:gap-12 max-w-6xl mx-auto">
          {projects.map((project, i) => (
            <ProjectCard key={project._id} project={project} index={i} totalCards={projects.length} />
          ))}
        </div>
      )}
    </section>
  );
}

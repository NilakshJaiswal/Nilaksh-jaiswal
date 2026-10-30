import { useState } from "react";
import { motion } from "framer-motion";
import { MobileMenu } from "./MobileMenu";
import { ContactButton } from "./ContactButton";
import { useReducedMotionPreference } from "../hooks/useReducedMotionPreference";
import type { SettingsContent } from "../types";

interface NavbarProps {
  settings: SettingsContent | null;
}

const DEFAULT_LABELS = {
  about: "About",
  skills: "Skills",
  projects: "Projects",
  experience: "Experience",
  contact: "Contact",
};

export function Navbar({ settings }: NavbarProps) {
  const [open, setOpen] = useState(false);
  const reduced = useReducedMotionPreference();
  const labels = settings?.navLabels ?? DEFAULT_LABELS;

  const links = [
    { label: labels.about, href: "#about" },
    { label: labels.skills, href: "#skills" },
    { label: labels.projects, href: "#projects" },
    { label: labels.experience, href: "#experience" },
  ];

  return (
    <>
      {/* z-20 keeps the bar above every page section (which sit at z-10). */}
      <motion.nav
        initial={reduced ? false : { opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
        className="fixed top-0 left-0 right-0 z-20 flex items-center justify-end md:justify-center px-5 sm:px-8 md:px-10 pt-6 md:pt-8"
      >
        <div className="hidden md:flex items-center gap-8 lg:gap-12">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-mist font-medium uppercase tracking-wider text-sm md:text-base lg:text-lg hover:opacity-70 transition-opacity duration-200"
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="hidden md:block absolute right-5 sm:right-8 md:right-10">
          <ContactButton href="#contact" label={labels.contact} className="!px-6 !py-2 !text-xs" />
        </div>

        <button
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
          className="md:hidden flex flex-col gap-[5px] relative z-20"
        >
          <span
            className={`w-6 h-[2px] bg-white transition-transform duration-300 ${
              open ? "rotate-45 translate-y-[7px]" : ""
            }`}
          />
          <span className={`w-6 h-[2px] bg-white transition-opacity duration-300 ${open ? "opacity-0" : ""}`} />
          <span
            className={`w-6 h-[2px] bg-white transition-transform duration-300 ${
              open ? "-rotate-45 -translate-y-[7px]" : ""
            }`}
          />
        </button>
      </motion.nav>

      <MobileMenu open={open} links={links} contactLabel={labels.contact} />
    </>
  );
}

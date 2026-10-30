import { ArrowUp, Github, Linkedin, Mail } from "lucide-react";
import type { ContactContent } from "../types";

interface FooterProps {
  contact: ContactContent | null;
  copyrightText?: string;
}

export function Footer({ contact, copyrightText }: FooterProps) {
  const year = new Date().getFullYear();

  return (
    <footer className="relative z-10 bg-ink border-t border-mist/10 px-5 sm:px-8 md:px-10 py-10 flex flex-col sm:flex-row items-center justify-between gap-6">
      <p className="text-mist/75 text-sm text-center sm:text-left">
        {copyrightText || `© ${year} Nilaksh Jaiswal. All rights reserved.`}
      </p>

      <div className="flex items-center gap-4">
        {contact?.email && (
          <a
            href={`mailto:${contact.email}`}
            aria-label="Email"
            className="text-mist/70 hover:text-mist transition-colors"
          >
            <Mail size={20} />
          </a>
        )}
        {contact?.githubUrl && (
          <a
            href={contact.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub profile"
            className="text-mist/70 hover:text-mist transition-colors"
          >
            <Github size={20} />
          </a>
        )}
        {contact?.linkedinUrl && (
          <a
            href={contact.linkedinUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn profile"
            className="text-mist/70 hover:text-mist transition-colors"
          >
            <Linkedin size={20} />
          </a>
        )}
        <a
          href="#top"
          aria-label="Back to top"
          className="text-mist/70 hover:text-mist transition-colors border border-mist/30 rounded-full p-2"
        >
          <ArrowUp size={16} />
        </a>
      </div>
    </footer>
  );
}

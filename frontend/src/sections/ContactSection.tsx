import { FormEvent, useState } from "react";
import { Mail, Github, Linkedin, Phone, MapPin } from "lucide-react";
import { FadeIn } from "../components/FadeIn";
import { AccentHeading } from "../components/AccentHeading";
import { ContactButton } from "../components/ContactButton";
import { api } from "../lib/api";
import type { ContactContent } from "../types";

interface ContactSectionProps {
  contact: ContactContent | null;
}

export function ContactSection({ contact }: ContactSectionProps) {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus("sending");
    setErrorMsg("");
    try {
      await api.post("/contact-form", form);
      setStatus("sent");
      setForm({ name: "", email: "", message: "" });
    } catch (err: any) {
      setStatus("error");
      setErrorMsg(err?.response?.data?.error || "Could not send your message. Please try again later.");
    }
  }

  const links = [
    contact?.email && { icon: Mail, label: contact.email, href: `mailto:${contact.email}`, external: false },
    contact?.phone && { icon: Phone, label: contact.phone, href: `tel:${contact.phone}`, external: false },
    contact?.githubUrl && { icon: Github, label: "GitHub", href: contact.githubUrl, external: true },
    contact?.linkedinUrl && { icon: Linkedin, label: "LinkedIn", href: contact.linkedinUrl, external: true },
    ...(contact?.otherSocialLinks ?? [])
      .filter((l) => l.url && l.label)
      .map((l) => ({ icon: Linkedin, label: l.label, href: l.url, external: true })),
  ].filter(Boolean) as { icon: typeof Mail; label: string; href: string; external: boolean }[];

  return (
    <section
      id="contact"
      className="relative z-10 bg-ink px-5 sm:px-8 md:px-10 py-24 sm:py-28 md:py-32"
    >
      <div className="max-w-5xl mx-auto text-center">
        <FadeIn y={40}>
          <AccentHeading text={contact?.heading || "Let's Build Something"} className="heading-cta mb-8" />
        </FadeIn>

        <FadeIn delay={0.1}>
          <p className="text-mist/70 max-w-xl mx-auto mb-10 text-base sm:text-lg">
            {contact?.description || "Have an idea, a project, or an opportunity? Let's connect."}
          </p>
        </FadeIn>

        {contact?.location && (
          <FadeIn delay={0.15}>
            <p className="inline-flex items-center gap-2 text-mist/75 text-sm mb-8">
              <MapPin size={15} /> {contact.location}
            </p>
          </FadeIn>
        )}

        {links.length > 0 && (
          <FadeIn delay={0.2}>
            <ul className="flex flex-wrap justify-center gap-3 mb-10">
              {links.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    {...(link.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                    className="inline-flex items-center gap-2 border border-mist/25 rounded-full px-5 py-2.5 text-sm text-mist hover:bg-mist/10 hover:border-mist/50 transition-colors break-all"
                  >
                    <link.icon size={15} className="shrink-0" />
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </FadeIn>
        )}

        <FadeIn delay={0.25}>
          {contact?.email ? (
            <ContactButton href={`mailto:${contact.email}`} label={contact.ctaLabel || "Contact Me"} />
          ) : (
            <p className="text-mist/75 text-sm uppercase tracking-widest">
              Add your contact details in /admin/contact
            </p>
          )}
        </FadeIn>

        {contact?.contactFormEnabled && (
          <FadeIn delay={0.3}>
            <form onSubmit={handleSubmit} className="max-w-md mx-auto flex flex-col gap-4 text-left mt-14">
              <label className="text-sm text-mist/75">
                Name
                <input
                  required
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  className="mt-1 w-full bg-transparent border border-mist/20 rounded-lg px-4 py-2 text-mist"
                />
              </label>
              <label className="text-sm text-mist/75">
                Email
                <input
                  required
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  className="mt-1 w-full bg-transparent border border-mist/20 rounded-lg px-4 py-2 text-mist"
                />
              </label>
              <label className="text-sm text-mist/75">
                Message
                <textarea
                  required
                  rows={4}
                  value={form.message}
                  onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                  className="mt-1 w-full bg-transparent border border-mist/20 rounded-lg px-4 py-2 text-mist resize-y"
                />
              </label>
              <button
                type="submit"
                disabled={status === "sending"}
                className="self-start inline-flex items-center justify-center rounded-full border-2 border-mist text-mist font-medium uppercase tracking-widest px-8 py-3 text-sm hover:bg-mist/10 transition-colors disabled:opacity-50"
              >
                {status === "sending" ? "Sending…" : "Send Message"}
              </button>
              {status === "sent" && <p className="text-green-400 text-sm">Message sent — thank you!</p>}
              {status === "error" && <p className="text-red-400 text-sm">{errorMsg}</p>}
            </form>
          </FadeIn>
        )}
      </div>
    </section>
  );
}

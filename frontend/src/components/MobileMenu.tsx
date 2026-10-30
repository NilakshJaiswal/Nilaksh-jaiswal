interface NavLink {
  label: string;
  href: string;
}

interface MobileMenuProps {
  open: boolean;
  links: NavLink[];
  contactLabel: string;
}

export function MobileMenu({ open, links, contactLabel }: MobileMenuProps) {
  return (
    <div
      className={`fixed inset-0 bg-black/90 backdrop-blur-md flex flex-col justify-center items-start px-8 gap-8
        md:hidden transition-opacity duration-300 z-[15]
        ${open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
      aria-hidden={!open}
    >
      {links.map((link) => (
        <a
          key={link.href}
          href={link.href}
          className="text-[32px] font-medium text-mist hover:opacity-70 transition-opacity"
          tabIndex={open ? 0 : -1}
        >
          {link.label}
        </a>
      ))}
      <a
        href="#contact"
        className="text-[32px] font-medium text-mist underline underline-offset-4 hover:opacity-70 transition-opacity"
        tabIndex={open ? 0 : -1}
      >
        {contactLabel}
      </a>
    </div>
  );
}

import type { ElementType } from "react";

interface AccentHeadingProps {
  text: string;
  className?: string;
  as?: ElementType;
}

/**
 * Big section heading whose last word is set in an italic serif, e.g.
 * "ABOUT <em>me</em>". The gradient fill comes from the `hero-heading` class
 * on the element, which the accent word inherits.
 */
export function AccentHeading({ text, className = "", as: Tag = "h2" }: AccentHeadingProps) {
  const words = text.trim().split(/\s+/);
  const last = words.pop() ?? "";
  return (
    <Tag className={`hero-heading font-black uppercase tracking-tight ${className}`}>
      {words.length > 0 && `${words.join(" ")} `}
      <span className="accent-word">{last}</span>
    </Tag>
  );
}

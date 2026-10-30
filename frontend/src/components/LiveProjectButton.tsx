import { AnchorHTMLAttributes } from "react";

interface LiveProjectButtonProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  label?: string;
}

export function LiveProjectButton({ label = "Live Project", className = "", ...rest }: LiveProjectButtonProps) {
  return (
    <a
      {...rest}
      className={`inline-flex items-center justify-center rounded-full border-2 border-mist text-mist
        font-medium uppercase tracking-widest px-8 py-3 sm:px-10 sm:py-3.5 text-sm sm:text-base
        hover:bg-mist/10 transition-colors duration-200 ${className}`}
    >
      {label}
    </a>
  );
}

import Link from "next/link";
import clsx from "clsx";

type Variant = "primary" | "secondary" | "ghost" | "outline-light";
type Size = "md" | "lg";

const VARIANT: Record<Variant, string> = {
  primary: "bg-lb-red text-lb-cream hover:bg-lb-red-deep",
  secondary: "bg-lb-charcoal text-lb-cream hover:bg-lb-charcoal-soft",
  ghost: "bg-transparent text-lb-charcoal hover:bg-lb-charcoal/5 border border-lb-charcoal/20",
  "outline-light": "bg-transparent text-lb-cream border border-lb-cream/60 hover:bg-lb-cream/10",
};

const SIZE: Record<Size, string> = {
  md: "px-5 py-3 text-sm",
  lg: "px-7 py-4 text-base",
};

interface ButtonProps {
  href?: string;
  onClick?: () => void;
  children: React.ReactNode;
  variant?: Variant;
  size?: Size;
  className?: string;
  type?: "button" | "submit";
  disabled?: boolean;
}

export default function Button({
  href,
  onClick,
  children,
  variant = "primary",
  size = "md",
  className,
  type = "button",
  disabled,
}: ButtonProps) {
  const classes = clsx(
    "inline-flex items-center justify-center gap-2 rounded-full font-semibold tracking-wide transition-colors duration-200 disabled:opacity-50 disabled:pointer-events-none",
    VARIANT[variant],
    SIZE[size],
    className
  );

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} onClick={onClick} className={classes} disabled={disabled}>
      {children}
    </button>
  );
}

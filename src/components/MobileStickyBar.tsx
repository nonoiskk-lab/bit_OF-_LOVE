"use client";

import Link from "next/link";

const ITEMS = [
  { href: "/order", label: "Order", icon: "🛍" },
  { href: "/table", label: "Book", icon: "📅" },
  { href: "tel:+919031627293", label: "Call", icon: "📞" },
  {
    href: "https://wa.me/919031627293",
    label: "WhatsApp",
    icon: "💬",
    external: true,
  },
];

export default function MobileStickyBar() {
  return (
    <nav
      aria-label="Quick actions"
      className="fixed bottom-0 inset-x-0 z-30 md:hidden bg-white text-lb-charcoal border-t border-lb-charcoal/10 grid grid-cols-4 shadow-[0_-2px_12px_rgba(0,0,0,0.05)]"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      {ITEMS.map((item) =>
        item.external ? (
          <a
            key={item.label}
            href={item.href}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center justify-center gap-0.5 py-2.5 text-[11px] font-semibold uppercase tracking-wide active:bg-lb-red/10 active:text-lb-red"
          >
            <span className="text-lg leading-none">{item.icon}</span>
            {item.label}
          </a>
        ) : (
          <Link
            key={item.label}
            href={item.href}
            className="flex flex-col items-center justify-center gap-0.5 py-2.5 text-[11px] font-semibold uppercase tracking-wide active:bg-lb-red/10 active:text-lb-red"
          >
            <span className="text-lg leading-none">{item.icon}</span>
            {item.label}
          </Link>
        )
      )}
    </nav>
  );
}

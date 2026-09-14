"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getMealContext, MEAL_CONTEXT_COPY } from "@/lib/utils";

/** Time-based promotional strip (brief §48). Purely presentational nudging — never gates ordering. */
export default function MealContextBar() {
  const [copy, setCopy] = useState<typeof MEAL_CONTEXT_COPY[keyof typeof MEAL_CONTEXT_COPY] | null>(
    null
  );

  useEffect(() => {
    // Reads the visitor's local clock — must run client-side only, after mount, to avoid an SSR mismatch.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCopy(MEAL_CONTEXT_COPY[getMealContext()]);
  }, []);

  if (!copy) return null;

  return (
    <div className="bg-lb-red text-lb-cream text-sm">
      <div className="mx-auto max-w-[1600px] px-5 md:px-8 py-2.5 flex items-center justify-between gap-4">
        <p className="font-medium truncate">{copy.headline}</p>
        <Link href={copy.href} className="shrink-0 font-semibold underline underline-offset-2">
          {copy.cta} →
        </Link>
      </div>
    </div>
  );
}

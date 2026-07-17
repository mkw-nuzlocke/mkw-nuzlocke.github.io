"use client";

import { motion } from "framer-motion";
import { WIN_POINTS } from "@/lib/game";

type Props = {
  points: number;
};

export function PointsMeter({ points }: Props) {
  const clamped = Math.min(points, WIN_POINTS);
  const pct = (clamped / WIN_POINTS) * 100;

  return (
    <div className="w-full max-w-md">
      <div className="mb-1 flex items-end justify-between">
        <span className="slant text-lg font-black italic text-[var(--n-black)]">
          Points
        </span>
        <span className="slant text-2xl font-black italic text-[var(--n-red)]">
          {points}
          <span className="text-base text-[var(--n-ink)]"> / {WIN_POINTS}</span>
        </span>
      </div>
      <div className="relative h-6 -skew-x-12 overflow-hidden rounded-lg border-2 border-[var(--n-black)] bg-[var(--n-gray)] shadow-[3px_4px_0_rgba(17,25,33,0.35)]">
        <motion.div
          className="h-full bg-gradient-to-r from-[var(--n-yellow)] to-[var(--n-yellow-soft)]"
          initial={false}
          animate={{ width: `${pct}%` }}
          transition={{ type: "spring", stiffness: 120, damping: 18 }}
        />
        <div className="pointer-events-none absolute inset-0 flex">
          {Array.from({ length: WIN_POINTS - 1 }).map((_, i) => (
            <div
              key={i}
              className="h-full border-r border-black/15"
              style={{ width: `${100 / WIN_POINTS}%` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

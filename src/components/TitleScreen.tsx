"use client";

import { motion } from "framer-motion";
import { BrushHeading } from "./BrushHeading";

type Props = {
  onStart: () => void;
};

const RULES = [
  "You start with 3 random racers, each assigned a random vehicle",
  "Finish 6th or lower and you lose that racer for good",
  "Finish on the podium to choose your reward: points (3/2/1) or a new racer",
  "Transformed by Kamek into a character you don't own? Claim them for free",
  "Reach 10 points to win. Lose every racer and the run ends",
];

export function TitleScreen({ onStart }: Props) {
  return (
    <div className="mx-auto flex min-h-[70vh] w-full max-w-3xl flex-col items-center justify-center gap-10 px-4 py-16 text-center">
      <motion.div
        initial={{ y: -24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 120 }}
      >
        <p className="slant mb-2 text-sm font-bold uppercase tracking-[0.35em] text-[var(--n-orange)] italic">
          Online Race Challenge
        </p>
        <BrushHeading size="lg">The Nuzlocke Run!</BrushHeading>
      </motion.div>

      <motion.ul
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="hard-shadow w-full max-w-xl space-y-3 rounded-2xl border-2 border-[var(--n-black)] bg-white px-8 py-6 text-left"
      >
        {RULES.map((rule, i) => (
          <li key={i} className="flex items-start gap-3 text-sm font-semibold text-[var(--n-ink)]">
            <span className="slant mt-0.5 shrink-0 font-black italic text-[var(--n-red)]">
              {i + 1}.
            </span>
            {rule}
          </li>
        ))}
      </motion.ul>

      <motion.button
        type="button"
        onClick={onStart}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4 }}
        className="mk-pill mk-pill--yellow px-12 py-4"
      >
        <span className="mk-chevron slant text-xl font-black italic text-[var(--n-black)]">
          Start your engines
        </span>
      </motion.button>
    </div>
  );
}

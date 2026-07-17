"use client";

import { motion } from "framer-motion";
import type { RaceResult } from "@/lib/game";
import { BrushHeading } from "./BrushHeading";
import { Confetti } from "./Confetti";
import { RunSummary } from "./RunSummary";

type Props = {
  eyebrow: string;
  eyebrowClassName: string;
  title: string;
  subtitle: string;
  history: RaceResult[];
  cta: string;
  onNewRun: () => void;
  confetti?: boolean;
};

export function EndScreen({
  eyebrow,
  eyebrowClassName,
  title,
  subtitle,
  history,
  cta,
  onNewRun,
  confetti = false,
}: Props) {
  return (
    <div className="relative mx-auto flex min-h-[70vh] w-full max-w-3xl flex-col items-center justify-center gap-8 overflow-hidden px-4 py-12 text-center">
      {confetti && <Confetti />}
      <motion.div
        initial={{ scale: 0.7, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 140 }}
        className="relative z-10 flex flex-col items-center gap-2"
      >
        <p
          className={`slant text-sm font-black uppercase tracking-[0.3em] italic ${eyebrowClassName}`}
        >
          {eyebrow}
        </p>
        <BrushHeading size="lg">{title}</BrushHeading>
        <p className="slant mt-1 text-lg font-black italic text-[var(--n-black)]">
          {subtitle}
        </p>
      </motion.div>

      <RunSummary history={history} />

      <button
        type="button"
        onClick={onNewRun}
        className="mk-pill mk-pill--yellow relative z-10 px-10 py-3.5"
      >
        <span className="mk-chevron slant text-lg font-black italic text-[var(--n-black)]">
          {cta}
        </span>
      </button>
    </div>
  );
}

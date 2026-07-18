"use client";

import { motion } from "framer-motion";

type Props = {
  children: React.ReactNode;
  size?: "md" | "lg";
  className?: string;
};

export function BrushHeading({ children, size = "lg", className = "" }: Props) {
  const sizeClass =
    size === "lg"
      ? "text-4xl md:text-6xl"
      : "text-2xl md:text-4xl";

  return (
    <div
      className={`relative inline-flex max-w-full items-center justify-center px-4 py-2 ${className}`}
    >
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-1/2 h-[125%] -translate-y-1/2 opacity-90 sm:inset-x-[-20%] sm:h-[150%]"
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 0.9 }}
        transition={{ type: "spring", stiffness: 160, damping: 14 }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/patterns/heading-scribble.svg"
          alt=""
          className="h-full w-full object-fill"
          draggable={false}
        />
      </motion.div>

      <h2 className={`mk-shadow-text slant relative font-black italic leading-[1.1] ${sizeClass}`}>
        <span className="mk-shadow-text__shadow">{children}</span>
        <span className="mk-shadow-text__stroke" aria-hidden>
          {children}
        </span>
        <span className="mk-shadow-text__fill" aria-hidden>
          {children}
        </span>
      </h2>
    </div>
  );
}

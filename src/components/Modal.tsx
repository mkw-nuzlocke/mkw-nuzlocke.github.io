"use client";

import { motion } from "framer-motion";

type Props = {
  children: React.ReactNode;
  titleId: string;
  onClose?: () => void;
  maxWidth?: "md" | "lg";
  showClose?: boolean;
  closeOnBackdrop?: boolean;
};

export function Modal({
  children,
  titleId,
  onClose,
  maxWidth = "md",
  showClose = Boolean(onClose),
  closeOnBackdrop = Boolean(onClose),
}: Props) {
  const width = maxWidth === "lg" ? "max-w-lg" : "max-w-md";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-[2px]"
      onClick={closeOnBackdrop ? onClose : undefined}
      role="presentation"
    >
      <motion.div
        initial={{ scale: 0.85, y: 24, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        className={`mk-panel relative w-full ${width}`}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
      >
        <div className="h-2 bg-[var(--n-yellow)]" />
        {showClose && onClose && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full border-2 border-[var(--n-black)] bg-white text-lg font-black leading-none text-[var(--n-black)] shadow-[2px_2px_0_rgba(17,25,33,0.85)] transition-transform hover:-translate-y-0.5"
          >
            ×
          </button>
        )}
        {children}
      </motion.div>
    </div>
  );
}

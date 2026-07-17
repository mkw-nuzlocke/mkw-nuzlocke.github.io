"use client";

import { motion } from "framer-motion";

const COLORS = [
  "#e60012",
  "#ffca32",
  "#111921",
  "#db4e1a",
  "#f7b22e",
  "#ffffff",
];

function hash(n: number) {
  const x = Math.sin(n * 12.9898) * 43758.5453;
  return x - Math.floor(x);
}

const PIECES = Array.from({ length: 48 }).map((_, i) => ({
  id: i,
  left: hash(i + 1) * 100,
  delay: hash(i + 17) * 0.8,
  duration: 2.2 + hash(i + 31) * 1.6,
  color: COLORS[i % COLORS.length]!,
  size: 6 + hash(i + 53) * 10,
  rotate: hash(i + 71) * 360,
}));

export function Confetti() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {PIECES.map((piece) => (
        <motion.span
          key={piece.id}
          className="absolute top-0 rounded-sm"
          style={{
            left: `${piece.left}%`,
            width: piece.size,
            height: piece.size * 1.4,
            backgroundColor: piece.color,
          }}
          initial={{ y: -40, opacity: 1, rotate: piece.rotate }}
          animate={{
            y: ["-40px", "110vh"],
            opacity: [1, 1, 0],
            rotate: [piece.rotate, piece.rotate + 480],
            x: [0, 30, -20, 10],
          }}
          transition={{
            duration: piece.duration,
            delay: piece.delay,
            ease: "easeIn",
            repeat: Infinity,
            repeatDelay: 0,
          }}
        />
      ))}
    </div>
  );
}

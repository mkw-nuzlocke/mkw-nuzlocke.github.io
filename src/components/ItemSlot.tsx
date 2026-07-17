"use client";

import { useEffect } from "react";
import {
  animate,
  motion,
  useMotionValue,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { racerEmblem, type Racer } from "@/lib/data/racers";

type Props = {
  racer: Racer;
  spinning: boolean;
  tick?: number;
  size?: "md" | "lg";
  pool?: Racer[];
  poolOffset?: number;
};

const SIZE_PX = {
  md: 144,
  lg: 208,
} as const;

const sizeClass = {
  md: "h-36 w-36",
  lg: "h-52 w-52",
} as const;

const emblemClass = {
  md: "h-22 w-22",
  lg: "h-32 w-32",
} as const;

const ROLL_SECONDS = 0.11;

const INNER_TRANSFORMS = [
  "rotateX(0deg)",
  "rotateX(90deg)",
  "rotateX(180deg)",
  "rotateX(-90deg)",
  "rotateY(90deg)",
  "rotateY(-90deg)",
] as const;

function racerAtTick(pool: Racer[], tick: number, offset: number): Racer {
  if (pool.length === 0) throw new Error("empty pool");
  if (tick < 0) return pool[0]!;
  return pool[(tick + offset) % pool.length]!;
}

function faceRacer(
  pool: Racer[],
  tick: number,
  offset: number,
  faceIndex: number,
): Racer {
  const age = (((tick - faceIndex) % 4) + 4) % 4;
  return racerAtTick(pool, tick - age, offset);
}

function normalizeDeg(angle: number): number {
  return ((angle % 360) + 540) % 360 - 180;
}

export function ItemSlot({
  racer,
  spinning,
  tick = 0,
  size = "lg",
  pool,
  poolOffset = 0,
}: Props) {
  const px = SIZE_PX[size];
  const half = px / 2;
  const spinPool = pool && pool.length > 0 ? pool : [racer];

  const rotation = useMotionValue(-tick * 90);

  useEffect(() => {
    const controls = animate(rotation, -tick * 90, {
      duration: ROLL_SECONDS,
      ease: "linear",
    });
    return () => controls.stop();
  }, [rotation, tick]);

  if (!spinning) {
    return (
      <div className={`relative ${sizeClass[size]}`}>
        <div className="item-slot absolute inset-0 grid place-items-center overflow-hidden">
          <motion.span
            aria-hidden
            className="item-slot-glow [grid-area:1/1]"
            initial={{ opacity: 0, scale: 0.4 }}
            animate={{ opacity: 1, scale: 1.15 }}
            transition={{ duration: 0.35 }}
          />
          <motion.img
            src={racerEmblem(racer.id)}
            alt={`${racer.name} emblem`}
            className={`${emblemClass[size]} [grid-area:1/1] object-contain drop-shadow-lg`}
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 13 }}
            draggable={false}
          />
          <span aria-hidden className="item-slot-gloss" />
        </div>
      </div>
    );
  }

  return (
    <div
      className={`relative ${sizeClass[size]}`}
      style={{ perspective: `${px * 2.4}px`, perspectiveOrigin: "50% 45%" }}
    >
      <div
        className="absolute inset-0"
        style={{
          transform: `translateZ(-${half}px)`,
          transformStyle: "preserve-3d",
        }}
      >
        <motion.div
          className="absolute inset-0"
          style={{ transformStyle: "preserve-3d", rotateX: rotation }}
        >
          {INNER_TRANSFORMS.map((rot, i) => (
            <div
              key={`body-${i}`}
              aria-hidden
              className="item-slot-body absolute inset-0"
              style={{ transform: `${rot} translateZ(${half}px)` }}
            />
          ))}

          {[0, 1, 2, 3].map((i) => (
            <CubeFace
              key={i}
              index={i}
              racer={faceRacer(spinPool, tick, poolOffset, i)}
              rotation={rotation}
              half={half}
              size={size}
            />
          ))}
        </motion.div>
      </div>
    </div>
  );
}

function CubeFace({
  index,
  racer,
  rotation,
  half,
  size,
}: {
  index: number;
  racer: Racer;
  rotation: MotionValue<number>;
  half: number;
  size: "md" | "lg";
}) {
  const angle = useTransform(rotation, (r) => normalizeDeg(index * 90 + r));

  const glossOpacity = useTransform(angle, (a) =>
    Math.max(0, Math.cos((a * Math.PI) / 180)),
  );
  const glossY = useTransform(angle, (a) =>
    Math.sin((a * Math.PI) / 180) * -half * 0.6,
  );

  const sheenOpacity = useTransform(angle, (a) =>
    Math.max(0, Math.sin((a * Math.PI) / 180)) * 0.28,
  );

  const shadeOpacity = useTransform(angle, (a) => {
    const rad = (a * Math.PI) / 180;
    const tilt = 1 - Math.cos(rad);
    const down = Math.max(0, -Math.sin(rad));
    return Math.min(0.7, tilt * 0.25 + down * 0.5);
  });

  return (
    <div
      className="item-slot item-slot--cube absolute inset-0 grid place-items-center overflow-hidden"
      style={{
        backfaceVisibility: "hidden",
        WebkitBackfaceVisibility: "hidden",
        transform: `rotateX(${index * 90}deg) translateZ(${half + 0.5}px)`,
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={racerEmblem(racer.id)}
        alt=""
        className={`${emblemClass[size]} object-contain`}
        draggable={false}
      />
      <motion.span
        aria-hidden
        className="item-slot-gloss"
        style={{ opacity: glossOpacity, y: glossY }}
      />
      <motion.span
        aria-hidden
        className="item-slot-light"
        style={{ opacity: sheenOpacity }}
      />
      <motion.span
        aria-hidden
        className="item-slot-shade"
        style={{ opacity: shadeOpacity }}
      />
    </div>
  );
}

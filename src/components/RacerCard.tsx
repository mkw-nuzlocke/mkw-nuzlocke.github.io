"use client";

import { AnimatePresence, motion } from "framer-motion";
import { racerEmblem, type Racer } from "@/lib/data/racers";
import { vehicleImage, type Vehicle } from "@/lib/data/vehicles";

type Props = {
  racer: Racer;
  vehicle?: Vehicle;
  lost?: boolean;
  selected?: boolean;
  onClick?: () => void;
  size?: "sm" | "md" | "lg";
};

const sizeMap = {
  sm: "w-24 text-[11px]",
  md: "w-32 text-sm",
  lg: "w-44 text-base",
};

const emblemSizeMap = {
  sm: "h-12 w-12",
  md: "h-20 w-20",
  lg: "h-28 w-28",
};

const vehicleSizeMap = {
  sm: "h-7 w-10",
  md: "h-9 w-14",
  lg: "h-12 w-20",
};

const badgeSizeMap = {
  sm: "h-5 w-5 text-[10px] -top-1.5 -right-1.5",
  md: "h-6 w-6 text-xs -top-2 -right-2",
  lg: "h-7 w-7 text-sm -top-2.5 -right-2.5",
};

export function RacerCard({
  racer,
  vehicle,
  lost = false,
  selected = false,
  onClick,
  size = "md",
}: Props) {
  const interactive = Boolean(onClick) && !lost;
  const shellClass = `relative flex flex-col items-center overflow-hidden rounded-2xl bg-white p-2 pb-2.5 ${sizeMap[size]} ${
    lost ? "grayscale opacity-50" : ""
  } ${
    selected
      ? "border-[3px] border-[var(--n-yellow)] shadow-[5px_6px_0_rgba(17,25,33,0.85)]"
      : "border-2 border-[var(--n-black)] shadow-[5px_6px_0_rgba(17,25,33,0.85)]"
  } ${interactive ? "cursor-pointer" : "cursor-default"}`;

  const body = (
    <>
      <span
        aria-hidden
        className="absolute inset-x-0 top-0 h-2/3"
        style={{
          background: `linear-gradient(180deg, ${racer.color}33 0%, transparent 100%)`,
        }}
      />
      <span
        aria-hidden
        className="absolute inset-x-0 top-0 h-1.5"
        style={{ backgroundColor: racer.color }}
      />

      <span
        className={`relative mt-2 flex items-center justify-center ${emblemSizeMap[size]}`}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={racerEmblem(racer.id)}
          alt={`${racer.name} emblem`}
          className="h-full w-full object-contain drop-shadow-sm"
          draggable={false}
        />
      </span>

      <div className="relative mt-1 w-full text-center">
        <p className="slant truncate font-black italic leading-tight text-[var(--n-black)]">
          {racer.name}
        </p>
        {vehicle && (
          <div className="mt-1 flex w-full flex-col items-center border-t-2 border-dashed border-[var(--n-black)]/20 pt-1">
            <span
              className={`flex shrink-0 items-center justify-center ${vehicleSizeMap[size]}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={vehicleImage(vehicle.id)}
                alt={vehicle.name}
                className="h-full w-full object-contain drop-shadow-sm"
                draggable={false}
              />
            </span>
            <span className="-mt-0.5 w-full truncate text-[10px] font-bold text-[var(--n-orange)]">
              {vehicle.name}
            </span>
          </div>
        )}
      </div>

      {lost && (
        <span className="slant absolute inset-0 z-10 flex items-center justify-center bg-black/45 text-2xl font-black italic text-white">
          OUT
        </span>
      )}
    </>
  );

  return (
    <span className="relative inline-block">
      {interactive ? (
        <motion.button
          type="button"
          onClick={onClick}
          whileHover={{ y: -5, rotate: -1.5 }}
          whileTap={{ scale: 0.97 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className={shellClass}
        >
          {body}
        </motion.button>
      ) : (
        <div className={shellClass}>{body}</div>
      )}

      <AnimatePresence>
        {selected && !lost && (
          <motion.span
            aria-hidden
            initial={{ scale: 0, rotate: -35, opacity: 0 }}
            animate={{ scale: 1, rotate: 0, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 15 }}
            className={`absolute z-20 flex items-center justify-center rounded-full border-2 border-[var(--n-black)] bg-[var(--n-yellow)] font-black leading-none text-[var(--n-black)] shadow-[2px_2px_0_rgba(17,25,33,0.85)] ${badgeSizeMap[size]}`}
          >
            ✓
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  );
}

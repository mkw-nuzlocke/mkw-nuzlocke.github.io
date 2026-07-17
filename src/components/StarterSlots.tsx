"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { RACERS, getRacer, type Racer } from "@/lib/data/racers";
import { getVehicle } from "@/lib/data/vehicles";
import type { OwnedRacer } from "@/lib/game";
import {
  playItemDecide,
  resumeAudio,
  startItemRoulette,
  stopItemRoulette,
} from "@/lib/sound";
import { REVEAL_HOLD_MS, TICK_MS, preloadEmblems } from "@/lib/roulette";
import { ItemSlot } from "./ItemSlot";
import { BrushHeading } from "./BrushHeading";

type Props = {
  starters: OwnedRacer[];
  onComplete: () => void;
};

const STOP_TICKS = [16, 26, 36];

export function StarterSlots({ starters, onComplete }: Props) {
  const pool = useMemo(() => {
    const targetIds = new Set(starters.map((s) => s.racerId));
    const list = RACERS.filter((r) => !targetIds.has(r.id));
    return list.length > 0 ? list : RACERS;
  }, [starters]);

  const [tick, setTick] = useState(0);
  const completed = useRef(false);
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    preloadEmblems([
      ...pool.map((r) => r.id),
      ...starters.map((s) => s.racerId),
    ]);
  }, [pool, starters]);

  const lastStop = STOP_TICKS[Math.min(starters.length, STOP_TICKS.length) - 1]!;

  useEffect(() => {
    void resumeAudio();
    startItemRoulette();
    completed.current = false;

    let localTick = 0;
    const interval = setInterval(() => {
      localTick += 1;
      setTick(localTick);

      if (STOP_TICKS.includes(localTick)) {
        playItemDecide();
      }
      if (localTick >= lastStop) {
        stopItemRoulette();
        clearInterval(interval);
        setTimeout(() => {
          if (completed.current) return;
          completed.current = true;
          onCompleteRef.current();
        }, REVEAL_HOLD_MS);
      }
    }, TICK_MS);

    return () => {
      clearInterval(interval);
      stopItemRoulette();
    };
  }, [lastStop]);

  return (
    <div className="flex w-full max-w-3xl flex-col items-center gap-8 px-4 py-10">
      <BrushHeading size="md">Your starting team!</BrushHeading>

      <div className="flex flex-wrap items-start justify-center gap-5 md:gap-8">
        {starters.map((starter, i) => (
          <SlotReel
            key={starter.racerId}
            starter={starter}
            stopped={tick >= (STOP_TICKS[i] ?? lastStop)}
            tick={tick}
            pool={pool}
            poolOffset={i * 7}
          />
        ))}
      </div>
    </div>
  );
}

function SlotReel({
  starter,
  stopped,
  tick,
  pool,
  poolOffset,
}: {
  starter: OwnedRacer;
  stopped: boolean;
  tick: number;
  pool: Racer[];
  poolOffset: number;
}) {
  const racer = getRacer(starter.racerId);
  const vehicle = getVehicle(starter.vehicleId);

  return (
    <div className="flex w-36 flex-col items-center gap-3 md:w-40">
      <motion.div
        animate={stopped ? { scale: [1, 1.08, 1] } : undefined}
        transition={{ duration: 0.3 }}
      >
        <ItemSlot
          racer={racer}
          spinning={!stopped}
          tick={tick}
          pool={pool}
          poolOffset={poolOffset}
          size="md"
        />
      </motion.div>

      <div className="flex h-12 items-start justify-center">
        {stopped && (
          <motion.div
            className="text-center"
            initial={{ y: 12, opacity: 0, scale: 0.85 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 18 }}
          >
            <p className="slant text-sm font-black italic leading-tight text-[var(--n-black)]">
              {racer.name}
            </p>
            <p className="text-[11px] font-bold text-[var(--n-orange)]">
              {vehicle.name}
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}

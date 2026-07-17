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
  target: OwnedRacer;
  label?: string;
  skipSpin?: boolean;
  onComplete: () => void;
};

const SPIN_TICKS = 26;

export function ItemBoxRoulette({
  target,
  label = "Item Box!",
  skipSpin = false,
  onComplete,
}: Props) {
  const pool = useMemo(() => {
    const list = RACERS.filter((r) => r.id !== target.racerId);
    return list.length > 0 ? list : [getRacer(target.racerId)];
  }, [target.racerId]);

  const [phase, setPhase] = useState<"spinning" | "reveal">(
    skipSpin ? "reveal" : "spinning",
  );
  const [current, setCurrent] = useState<Racer>(() =>
    skipSpin ? getRacer(target.racerId) : pool[0]!,
  );
  const [tick, setTick] = useState(0);
  const completed = useRef(false);
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    preloadEmblems([...pool.map((r) => r.id), target.racerId]);
  }, [pool, target.racerId]);

  useEffect(() => {
    void resumeAudio();
    completed.current = false;

    function finish() {
      if (completed.current) return;
      completed.current = true;
      onCompleteRef.current();
    }

    if (skipSpin) {
      playItemDecide();
      const revealTimeout = setTimeout(finish, REVEAL_HOLD_MS);
      return () => clearTimeout(revealTimeout);
    }

    startItemRoulette();

    let localTick = 0;
    const interval = setInterval(() => {
      localTick += 1;

      if (localTick >= SPIN_TICKS) {
        clearInterval(interval);
        stopItemRoulette();
        playItemDecide();
        setCurrent(getRacer(target.racerId));
        setPhase("reveal");
        setTimeout(finish, REVEAL_HOLD_MS);
        return;
      }

      setCurrent(pool[localTick % pool.length]!);
      setTick(localTick);
    }, TICK_MS);

    return () => {
      clearInterval(interval);
      stopItemRoulette();
    };
  }, [pool, target.racerId, skipSpin]);

  const vehicle = getVehicle(target.vehicleId);
  const revealedRacer = getRacer(target.racerId);

  return (
    <div className="flex w-full max-w-lg flex-col items-center gap-7 px-4">
      <BrushHeading size="md">
        <span id="roulette-title">{label}</span>
      </BrushHeading>

      <motion.div
        animate={phase === "reveal" ? { scale: [1, 1.08, 1] } : undefined}
        transition={{ duration: 0.3 }}
      >
        <ItemSlot
          racer={phase === "reveal" ? revealedRacer : current}
          spinning={phase === "spinning"}
          tick={tick}
          pool={pool}
          size="lg"
        />
      </motion.div>

      <div className="flex h-12 items-center">
        {phase === "reveal" && (
          <motion.p
            className="mk-pill mk-pill--yellow px-6 py-2"
            initial={{ y: 16, opacity: 0, scale: 0.85 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 18 }}
          >
            <span className="slant text-sm font-black italic text-[var(--n-black)]">
              {revealedRacer.name} + {vehicle.name}
            </span>
          </motion.p>
        )}
      </div>
    </div>
  );
}

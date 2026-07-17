"use client";

import { motion } from "framer-motion";
import { getRacer } from "@/lib/data/racers";
import { getVehicle } from "@/lib/data/vehicles";
import type { OwnedRacer } from "@/lib/game";
import { NewRunButton } from "./NewRunButton";
import { PointsMeter } from "./PointsMeter";
import { PositionInput } from "./PositionInput";
import { RacerCard } from "./RacerCard";
import { RosterStrip } from "./RosterStrip";

type Props = {
  points: number;
  roster: OwnedRacer[];
  activeRacerId: string;
  onPosition: (position: number) => void;
  onNewRun: () => void;
  onRedeemKamek: () => void;
  kamekAvailable: number;
  disabled?: boolean;
};

export function RaceHud({
  points,
  roster,
  activeRacerId,
  onPosition,
  onNewRun,
  onRedeemKamek,
  kamekAvailable,
  disabled,
}: Props) {
  const entry = roster.find((r) => r.racerId === activeRacerId)!;
  const racer = getRacer(entry.racerId);
  const vehicle = getVehicle(entry.vehicleId);

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col items-center gap-8 px-4 py-8">
      <div className="flex w-full items-start justify-between gap-4">
        <PointsMeter points={points} />
        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={onRedeemKamek}
            disabled={disabled || kamekAvailable === 0}
            title={
              kamekAvailable === 0
                ? "No Kamek characters left to unlock"
                : "Redeem a character you were transformed into"
            }
            className="mk-pill gap-1.5 px-4 py-1.5 disabled:cursor-not-allowed"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/patterns/kamek.png"
              alt=""
              className="h-4 w-4 object-contain"
              draggable={false}
            />
            <span className="slant text-xs font-black italic">Kamek</span>
          </button>
          <NewRunButton onClick={onNewRun} />
        </div>
      </div>

      <motion.div layout className="flex flex-col items-center gap-3">
        <p className="slant text-sm font-black uppercase tracking-[0.3em] text-[var(--n-orange)] italic">
          Now racing
        </p>
        <RacerCard racer={racer} vehicle={vehicle} size="lg" selected />
      </motion.div>

      <div className="w-full rounded-2xl border-2 border-[var(--n-black)] bg-[var(--n-gray)]/40 px-4 py-5 shadow-[5px_6px_0_rgba(17,25,33,0.2)]">
        <PositionInput onSelect={onPosition} disabled={disabled} />
      </div>

      <div className="w-full border-t-2 border-dashed border-[var(--n-black)]/15 pt-5">
        <p className="slant mb-3 text-sm font-black uppercase tracking-[0.2em] text-[var(--n-orange)] italic">
          Your roster
        </p>
        <RosterStrip roster={roster} activeRacerId={activeRacerId} />
      </div>
    </div>
  );
}

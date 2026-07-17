import { getRacer } from "@/lib/data/racers";
import { getVehicle } from "@/lib/data/vehicles";
import type { OwnedRacer } from "@/lib/game";
import { BrushHeading } from "./BrushHeading";
import { RacerCard } from "./RacerCard";

type Props = {
  roster: OwnedRacer[];
  onSelect: (racerId: string) => void;
};

export function RacerSelect({ roster, onSelect }: Props) {
  const alive = roster.filter((entry) => !entry.lost);

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col items-center gap-8 px-4 py-10">
      <BrushHeading size="md">Choose your racer!</BrushHeading>
      <p className="-mt-4 text-center text-sm font-semibold text-[var(--n-ink)]">
        Pick who races next. Their paired vehicle is locked in.
      </p>
      <div className="flex flex-wrap justify-center gap-6">
        {alive.map((entry) => (
          <RacerCard
            key={entry.racerId}
            racer={getRacer(entry.racerId)}
            vehicle={getVehicle(entry.vehicleId)}
            size="lg"
            onClick={() => onSelect(entry.racerId)}
          />
        ))}
      </div>
    </div>
  );
}

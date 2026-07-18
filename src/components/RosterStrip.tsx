import { getRacer } from "@/lib/data/racers";
import { getVehicle } from "@/lib/data/vehicles";
import type { OwnedRacer } from "@/lib/game";
import { RacerCard } from "./RacerCard";

type Props = {
  roster: OwnedRacer[];
  activeRacerId?: string | null;
};

export function RosterStrip({ roster, activeRacerId }: Props) {
  const ordered = [
    ...roster.filter((entry) => !entry.lost),
    ...roster.filter((entry) => entry.lost),
  ];

  return (
    <div className="flex w-full flex-wrap justify-center gap-2 pb-2 sm:justify-start">
      {ordered.map((entry) => (
        <RacerCard
          key={entry.racerId}
          racer={getRacer(entry.racerId)}
          vehicle={getVehicle(entry.vehicleId)}
          lost={entry.lost}
          selected={entry.racerId === activeRacerId}
          size="sm"
        />
      ))}
    </div>
  );
}

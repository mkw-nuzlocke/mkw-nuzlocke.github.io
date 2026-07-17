import type { RaceResult } from "@/lib/game";
import { getRacer } from "@/lib/data/racers";

function formatFinish(position: number): string {
  if (position >= 6) return "6th or worse";
  if (position === 1) return "1st";
  if (position === 2) return "2nd";
  if (position === 3) return "3rd";
  return `${position}th`;
}

export function RunSummary({ history }: { history: RaceResult[] }) {
  if (history.length === 0) return null;
  return (
    <div className="hard-shadow relative z-10 max-h-52 w-full max-w-md overflow-y-auto rounded-2xl border-2 border-[var(--n-black)] bg-white p-5 text-left">
      <p className="slant mb-2 font-black italic text-[var(--n-black)]">
        Race log
      </p>
      <ul className="space-y-1.5 text-sm font-semibold text-[var(--n-ink)]">
        {history.map((race, i) => (
          <li key={i}>
            <span className="slant font-black italic text-[var(--n-red)]">
              #{i + 1}
            </span>{" "}
            {getRacer(race.racerId).name} finished {formatFinish(race.position)}
            {race.outcome === "points" && ` (+${race.pointsGained} pts)`}
            {race.outcome === "new-racer" && " (new racer)"}
            {race.outcome === "loss" && " (racer lost)"}
            {race.outcome === "neutral" && " (safe)"}
          </li>
        ))}
      </ul>
    </div>
  );
}

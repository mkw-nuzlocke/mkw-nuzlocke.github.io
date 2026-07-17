import type { RaceResult } from "@/lib/game";
import { EndScreen } from "./EndScreen";

type Props = {
  points: number;
  history: RaceResult[];
  onNewRun: () => void;
};

export function WinScreen({ points, history, onNewRun }: Props) {
  return (
    <EndScreen
      eyebrow="Challenge complete"
      eyebrowClassName="text-[var(--n-orange)]"
      title="You win!"
      subtitle={`${points} points · ${history.length} races`}
      history={history}
      cta="Start new run"
      onNewRun={onNewRun}
      confetti
    />
  );
}

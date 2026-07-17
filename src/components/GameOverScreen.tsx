import type { RaceResult } from "@/lib/game";
import { EndScreen } from "./EndScreen";

type Props = {
  history: RaceResult[];
  onNewRun: () => void;
};

export function GameOverScreen({ history, onNewRun }: Props) {
  return (
    <EndScreen
      eyebrow="All racers out"
      eyebrowClassName="text-[var(--n-red)]"
      title="Game over"
      subtitle={`${history.length} races completed`}
      history={history}
      cta="Try again"
      onNewRun={onNewRun}
    />
  );
}

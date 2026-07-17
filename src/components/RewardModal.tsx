import { pointsForPosition } from "@/lib/game";
import { BrushHeading } from "./BrushHeading";
import { Modal } from "./Modal";

type Props = {
  position: number;
  canRollRacer: boolean;
  onPoints: () => void;
  onRacer: () => void;
  onClose: () => void;
};

export function RewardModal({
  position,
  canRollRacer,
  onPoints,
  onRacer,
  onClose,
}: Props) {
  const pts = pointsForPosition(position);
  const place = position === 1 ? "1st" : position === 2 ? "2nd" : "3rd";

  return (
    <Modal titleId="reward-modal-title" onClose={onClose}>
      <div className="px-8 py-6 text-center">
        <p className="slant text-xs font-black uppercase tracking-[0.3em] text-[var(--n-orange)] italic">
          Podium finish
        </p>
        <BrushHeading size="md" className="mt-1">
          <span id="reward-modal-title">{place} place!</span>
        </BrushHeading>
        <p className="mt-1 text-sm font-semibold text-[var(--n-ink)]">
          Choose your reward
        </p>

        <div className="mt-6 grid gap-4">
          <button
            type="button"
            onClick={onPoints}
            className="mk-pill mk-pill--yellow w-full px-6 py-4"
          >
            <span className="flex w-full items-center justify-between">
              <span className="mk-chevron slant text-lg font-black italic text-[var(--n-black)]">
                Take points
              </span>
              <span className="slant text-lg font-black italic text-[var(--n-red)]">
                +{pts}
              </span>
            </span>
          </button>

          <button
            type="button"
            disabled={!canRollRacer}
            onClick={onRacer}
            className="mk-pill mk-pill--orange w-full px-6 py-4"
          >
            <span className="flex w-full flex-col items-start">
              <span className="mk-chevron slant text-lg font-black italic">
                New racer
              </span>
              <span className="text-xs font-semibold opacity-85">
                {canRollRacer
                  ? "Open an item box for a random racer + vehicle"
                  : "No racers left in the pool"}
              </span>
            </span>
          </button>
        </div>
      </div>
    </Modal>
  );
}

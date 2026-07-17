import { racerEmblem, type Racer } from "@/lib/data/racers";
import { BrushHeading } from "./BrushHeading";
import { Modal } from "./Modal";

type Props = {
  racers: Racer[];
  onSelect: (racerId: string) => void;
  onClose: () => void;
};

export function KamekRedeemModal({ racers, onSelect, onClose }: Props) {
  return (
    <Modal titleId="kamek-modal-title" onClose={onClose} maxWidth="lg">
      <div className="px-8 py-6 text-center">
        <div className="flex flex-col items-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/patterns/kamek.png"
            alt=""
            className="h-16 w-16 object-contain drop-shadow-[3px_3px_0_rgba(17,25,33,0.35)]"
            draggable={false}
          />
          <p className="slant mt-2 text-xs font-black uppercase tracking-[0.3em] text-[var(--n-orange)] italic">
            Transformed by Kamek!
          </p>
          <BrushHeading size="md" className="mt-1">
            <span id="kamek-modal-title">Free unlock</span>
          </BrushHeading>
        </div>

        <p className="mx-auto mt-1 max-w-sm text-sm font-semibold text-[var(--n-ink)]">
          Got turned into a character you don&apos;t own yet? Redeem it for free
          and add it to your roster.
        </p>

        {racers.length === 0 ? (
          <p className="mt-6 rounded-2xl border-2 border-dashed border-[var(--n-black)]/20 px-4 py-6 text-sm font-semibold text-[var(--n-ink)]/70">
            You already own every Kamek character. Nothing left to redeem!
          </p>
        ) : (
          <div className="mt-6 grid max-h-[46vh] grid-cols-3 gap-3 overflow-y-auto px-1.5 py-2 sm:grid-cols-4">
            {racers.map((racer) => (
              <button
                key={racer.id}
                type="button"
                onClick={() => onSelect(racer.id)}
                className="hard-shadow transform-gpu flex flex-col items-center gap-1.5 rounded-2xl border-2 border-[var(--n-black)] bg-white px-2 py-3 transition-transform hover:-translate-y-1 focus:-translate-y-1 focus:outline-none"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={racerEmblem(racer.id)}
                  alt=""
                  className="h-12 w-12 object-contain"
                  draggable={false}
                />
                <span className="slant text-[11px] font-black italic leading-tight text-[var(--n-black)]">
                  {racer.name}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>
    </Modal>
  );
}

import { Modal } from "./Modal";

type Props = {
  onConfirm: () => void;
  onCancel: () => void;
};

export function NewRunModal({ onConfirm, onCancel }: Props) {
  return (
    <Modal titleId="new-run-modal-title" onClose={onCancel}>
      <div className="px-8 py-6 text-center">
        <p className="slant text-xs font-black uppercase tracking-[0.3em] text-[var(--n-orange)] italic">
          Warning
        </p>
        <h2
          id="new-run-modal-title"
          className="slant mt-1 text-3xl font-black italic text-[var(--n-black)]"
        >
          Start a new run?
        </h2>
        <p className="mt-2 text-sm font-semibold text-[var(--n-ink)]">
          Current progress will be lost.
        </p>

        <div className="mt-6 grid gap-3">
          <button
            type="button"
            onClick={onConfirm}
            className="mk-pill mk-pill--orange w-full px-6 py-3.5"
          >
            <span className="mk-chevron slant text-base font-black italic">
              Yes, start over
            </span>
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="mk-pill w-full px-6 py-3.5"
          >
            <span className="slant text-base font-black italic text-[var(--n-black)]">
              Keep playing
            </span>
          </button>
        </div>
      </div>
    </Modal>
  );
}

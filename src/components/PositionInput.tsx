type Props = {
  onSelect: (position: number) => void;
  disabled?: boolean;
};

const OPTIONS = [
  { position: 1, label: "1st", hint: "Reward" },
  { position: 2, label: "2nd", hint: "Reward" },
  { position: 3, label: "3rd", hint: "Reward" },
  { position: 4, label: "4th", hint: "Safe" },
  { position: 5, label: "5th", hint: "Safe" },
  { position: 6, label: "6th or worse", hint: "Lost" },
];

function pillClass(position: number) {
  if (position <= 3) return "mk-pill--yellow";
  if (position <= 5) return "";
  return "mk-pill--dark";
}

export function PositionInput({ onSelect, disabled }: Props) {
  return (
    <div className="w-full max-w-2xl">
      <h3 className="slant mb-1 text-center text-2xl font-black italic text-[var(--n-black)]">
        Where did you finish?
      </h3>
      <p className="mb-4 text-center text-xs font-semibold text-[var(--n-ink)]">
        Yellow = reward · White = safe · Black = racer lost
      </p>
      <div className="grid grid-cols-3 gap-x-5 gap-y-4 px-1">
        {OPTIONS.map(({ position, label, hint }) => (
          <button
            key={position}
            type="button"
            disabled={disabled}
            onClick={() => onSelect(position)}
            className={`mk-pill px-2 py-3 ${pillClass(position)}`}
          >
            <span className="flex flex-col items-center leading-tight">
              <span className="slant text-sm font-black italic md:text-base">
                {position === 6 ? (
                  <>
                    <span className="sm:hidden">6th+</span>
                    <span className="hidden sm:inline">6th or worse</span>
                  </>
                ) : (
                  label
                )}
              </span>
              <span
                className={`mt-0.5 text-[9px] font-bold uppercase tracking-wider ${
                  position >= 6 ? "text-white/70" : "text-[var(--n-black)]/55"
                }`}
              >
                {hint}
              </span>
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

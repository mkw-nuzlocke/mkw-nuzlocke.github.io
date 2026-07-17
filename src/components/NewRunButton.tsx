type Props = {
  onClick: () => void;
};

export function NewRunButton({ onClick }: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="mk-pill shrink-0 px-4 py-1.5"
    >
      <span className="slant text-xs font-black italic">New Run</span>
    </button>
  );
}

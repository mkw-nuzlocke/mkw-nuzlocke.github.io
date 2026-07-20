export function PageFrame({ children }: { children?: React.ReactNode }) {
  return (
    <div className="bg-pattern-light flex min-h-screen flex-col">
      <header className="relative z-20">
        <div className="flex items-center justify-between bg-[var(--n-red)] px-4 py-2 md:px-8">
          <span className="slant text-lg font-black italic tracking-tight text-white md:text-xl">
            MARIO KART WORLD
            <span className="ml-2 rounded-md bg-white px-2 py-0.5 text-[var(--n-red)]">
              NUZLOCKE
            </span>
          </span>
          <span className="hidden text-[11px] font-semibold text-white/85 md:block">
            Companion run tracker
          </span>
        </div>
        <div className="h-2 bg-[var(--n-yellow)]" />
      </header>

      <main className="relative z-10 flex-1 px-3 py-8 md:px-6">
        <div className="mk-debris mx-auto w-full max-w-5xl rounded-[2rem] border-2 border-[var(--n-black)] shadow-[10px_12px_0_rgba(17,25,33,0.45)]">
          {children}
        </div>
      </main>

      <footer className="relative z-10">
        <div className="h-2 bg-[var(--n-yellow)]" />
        <div className="bg-pattern-dark flex items-center justify-center px-4 py-6">
          <p className="max-w-lg text-center text-xs font-semibold leading-relaxed text-white/80">
            Nuzlocke rules by{" "}
            <a
              href="https://www.youtube.com/watch?v=TXEu7ROf6po"
              target="_blank"
              rel="noopener noreferrer"
              className="underline decoration-white/35 underline-offset-2 transition-colors hover:text-white hover:decoration-white"
            >
              JHart
            </a>
            <span className="mt-1 block text-white/65">
              Fan-made companion tracker · Not affiliated with Nintendo
            </span>
          </p>
        </div>
      </footer>
    </div>
  );
}

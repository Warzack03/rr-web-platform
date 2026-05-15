type ClubMarkProps = {
  compact?: boolean;
};

export function ClubMark({ compact = false }: ClubMarkProps) {
  return (
    <div
      className={`relative overflow-hidden rounded-full border border-[var(--rr-border-strong)] bg-[linear-gradient(145deg,#132540,#0b1b32)] ${
        compact ? "h-10 w-10" : "h-12 w-12"
      }`}
      aria-hidden="true"
    >
      <div className="absolute inset-[18%] rounded-full border border-white/10" />
      <div className="absolute inset-y-[18%] left-[48%] w-[3px] -translate-x-1/2 rotate-[16deg] bg-[var(--rr-accent)] shadow-[0_0_18px_rgba(253,203,88,0.42)]" />
      <div className="absolute left-[30%] top-[46%] h-[3px] w-[40%] -rotate-[16deg] bg-[var(--rr-accent)] shadow-[0_0_18px_rgba(253,203,88,0.42)]" />
    </div>
  );
}

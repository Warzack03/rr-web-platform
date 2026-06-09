type SquadPageTitleProps = {
  title: string;
};

export function SquadPageTitle({ title }: SquadPageTitleProps) {
  return (
    <header className="mx-auto max-w-[64rem] text-center">
      <h1 className="rr-display text-[3.8rem] leading-[0.9] text-[color:var(--rr-gold)] sm:text-[5.4rem] lg:text-[7rem]">
        {title}
      </h1>
      <div className="rr-bolt-divider mt-8" />
    </header>
  );
}

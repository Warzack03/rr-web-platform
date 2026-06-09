type PlayerShopCTAPlayer = {
  number: number;
  name: string;
  lastName: string;
  shopHref?: string;
};

type PlayerShopCTAProps = {
  player: PlayerShopCTAPlayer;
};

export function PlayerShopCTA({ player }: PlayerShopCTAProps) {
  if (!player.shopHref) {
    return null;
  }

  return (
    <section className="rr-panel border-[color:var(--rr-border-strong)] px-6 py-8 md:px-8 md:py-10">
      <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_14rem] xl:items-center">
        <div className="max-w-[34rem]">
          <h2 className="rr-display text-[3.3rem] leading-[0.9] text-white md:text-[4.2rem]">
            Consigue la <span className="text-[color:var(--rr-gold)]">#{player.number}</span>
          </h2>
          <p className="mt-4 max-w-[26rem] text-[1.1rem] text-[color:var(--rr-muted)]">
            Equipate con la camiseta de {player.name} y lleva el estilo del Primer Equipo.
          </p>
          <a
            href={player.shopHref}
            target="_blank"
            rel="noreferrer"
            className="mt-6 inline-flex min-h-12 items-center justify-center border border-[color:var(--rr-gold)] bg-[color:var(--rr-gold)] px-6 py-3 font-[var(--rr-font-body)] text-[0.96rem] font-bold uppercase leading-none tracking-[0.18em] text-[color:var(--rr-on-gold)] transition hover:-translate-y-0.5 hover:bg-[#ffd46f]"
          >
            Ir a tienda
          </a>
        </div>

        <div className="mx-auto w-full max-w-[12rem]">
          <div className="relative aspect-[4/5] border border-white/10 bg-[linear-gradient(180deg,rgba(19,28,43,0.98),rgba(10,16,28,0.98))] shadow-[0_24px_48px_rgba(0,0,0,0.3)] [transform:rotate(6deg)]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_24%)]" />
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
              <span className="rr-display text-[5rem] leading-none text-[color:var(--rr-gold)]">
                {player.number}
              </span>
              <span className="rr-kicker text-[0.86rem] text-white">{player.lastName}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

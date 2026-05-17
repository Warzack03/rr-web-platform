export function PublicFooter() {
  return (
    <footer className="border-t border-[color:var(--rr-border)] bg-[#0a0f10]">
      <div className="mx-auto flex w-full max-w-[1280px] flex-col items-center gap-6 px-5 py-14 text-center md:px-8 xl:px-16">
        <div className="rr-brand text-[2.6rem] leading-none text-[color:var(--rr-gold)]">
          Rising Raimon
        </div>
        <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[0.92rem] uppercase tracking-[0.16em] text-[color:var(--rr-muted)]/85">
          <span>Aviso Legal</span>
          <span>Politica de Privacidad</span>
          <span>Contacto</span>
          <span>Socio</span>
          <span>Prensa</span>
        </div>
        <p className="text-sm uppercase tracking-[0.12em] text-[color:var(--rr-muted)]/72">
          (c) 2024 Rising Raimon Football Club. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
}

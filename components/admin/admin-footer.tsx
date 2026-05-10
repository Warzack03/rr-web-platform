const sponsors = [
  "Patrocinador principal",
  "Partner tecnico",
  "Colaborador local",
  "Escuela asociada",
];

export function AdminFooter() {
  return (
    <footer className="rounded-[30px] border border-white/10 bg-slate-950/55 px-5 py-6 backdrop-blur xl:px-7">
      <div className="flex flex-col items-center gap-5">
        <div className="space-y-2 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-amber-300/90">
            Patrocinadores
          </p>
          <h2 className="text-2xl font-semibold text-white">Partners del club</h2>
        </div>

        <div className="grid w-full gap-3 sm:grid-cols-2 xl:max-w-[980px] xl:grid-cols-4">
          {sponsors.map((sponsor) => (
            <div
              key={sponsor}
              className="flex min-h-24 items-center justify-center rounded-[24px] border border-dashed border-white/15 bg-white/[0.03] px-4 text-center text-sm font-medium text-slate-300"
            >
              {sponsor}
            </div>
          ))}
        </div>
      </div>
    </footer>
  );
}

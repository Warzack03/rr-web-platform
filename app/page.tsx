import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(245,158,11,0.18),_transparent_24%),linear-gradient(180deg,_#020617_0%,_#0f172a_100%)] px-4 py-10 text-slate-100">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-6xl items-center">
        <section className="grid gap-8 rounded-[36px] border border-white/10 bg-slate-950/65 p-8 backdrop-blur lg:grid-cols-[1.15fr_0.85fr] lg:p-10">
          <div className="space-y-6">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-300/90">
              Rising Raimon
            </p>
            <div className="space-y-3">
              <h1 className="max-w-3xl text-4xl font-semibold leading-tight text-white md:text-5xl">
                Rising Raimon
              </h1>
              <p className="max-w-2xl text-base leading-8 text-slate-300">
                Futbol, cantera y club.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <article className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
                <p className="text-sm font-semibold text-white">Admin</p>
              </article>
              <article className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
                <p className="text-sm font-semibold text-white">Equipos</p>
              </article>
              <article className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
                <p className="text-sm font-semibold text-white">Tienda</p>
              </article>
            </div>
          </div>

          <div className="flex flex-col justify-between rounded-[32px] border border-white/10 bg-white/[0.04] p-6">
            <div className="space-y-3">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-400">
                Accesos
              </p>
              <h2 className="text-3xl font-semibold text-white">Entrar</h2>
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/admin/login"
                className="inline-flex items-center justify-center rounded-full bg-amber-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-amber-300"
              >
                Ir al admin
              </Link>
              <a
                href="https://tienda.risingraimon.es"
                className="inline-flex items-center justify-center rounded-full border border-white/12 px-5 py-3 text-sm font-semibold text-slate-100 transition hover:bg-white/6"
              >
                Tienda externa
              </a>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

import { ShieldCheck } from "lucide-react";
import { redirect } from "next/navigation";
import { LoginForm } from "@/components/admin/login-form";
import { getAuthenticatedAdmin } from "@/server/auth/session";

export default async function AdminLoginPage() {
  const user = await getAuthenticatedAdmin();

  if (user) {
    redirect("/admin");
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(245,158,11,0.2),_transparent_28%),linear-gradient(180deg,_#020617_0%,_#111827_100%)] px-4 py-10 text-slate-100">
      <div className="mx-auto grid min-h-[calc(100vh-5rem)] w-full max-w-6xl items-center gap-8 lg:grid-cols-[1.15fr_0.85fr]">
        <section className="rounded-[32px] border border-white/10 bg-slate-950/60 p-8 backdrop-blur xl:p-10">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-300/90">
            Rising Raimon
          </p>
          <div className="mt-8 space-y-4">
            <h1 className="max-w-2xl text-4xl font-semibold leading-tight text-white md:text-5xl">
              Backoffice
            </h1>
            <p className="max-w-2xl text-base leading-8 text-slate-300">Acceso interno.</p>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-3">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
              <p className="text-sm font-semibold text-white">Roles</p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
              <p className="text-sm font-semibold text-white">Acceso</p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
              <p className="text-sm font-semibold text-white">Control</p>
            </div>
          </div>
        </section>

        <section className="rounded-[32px] border border-white/10 bg-slate-950/78 p-8 shadow-[0_28px_80px_-48px_rgba(251,191,36,0.55)] backdrop-blur xl:p-10">
          <div className="mb-8 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-400 text-slate-950">
            <ShieldCheck className="h-7 w-7" />
          </div>
          <div className="mb-8 space-y-3">
            <h2 className="text-3xl font-semibold text-white">Iniciar sesion</h2>
          </div>

          <LoginForm />
        </section>
      </div>
    </div>
  );
}

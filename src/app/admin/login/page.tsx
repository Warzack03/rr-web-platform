import { ShieldCheck } from "lucide-react";
import { redirect } from "next/navigation";
import { LoginForm } from "@/src/components/admin/login-form";
import { getAuthenticatedAdmin } from "@/server/auth/session";

export default async function AdminLoginPage() {
  const user = await getAuthenticatedAdmin();

  if (user) {
    redirect("/admin");
  }

  return (
    <div className="rr-page-shell flex min-h-screen items-center justify-center px-4 py-10">
      <main className="w-full max-w-[600px] rounded-[24px] border border-[var(--rr-border)] bg-[rgba(39,58,88,0.94)] p-8 shadow-[0_32px_80px_-40px_rgba(0,0,0,0.75)] sm:p-10">
        <div className="mx-auto max-w-[420px]">
          <div className="mx-auto inline-flex rounded-[20px] border border-[var(--rr-border)] bg-[rgba(30,32,32,0.72)] p-5 text-[var(--rr-accent)]">
            <ShieldCheck className="h-7 w-7" />
          </div>

          <div className="mt-8 text-center">
            <h1 className="font-display text-6xl uppercase text-[var(--rr-accent)] sm:text-7xl">
              Rising Raimon
            </h1>
            <p className="mt-4 text-2xl text-[var(--rr-text-muted)]">Area Privada de Gestion</p>
          </div>

          <div className="mt-10">
            <LoginForm />
          </div>

          <div className="mt-10 border-t border-[var(--rr-border)] pt-6 text-sm leading-7 text-[var(--rr-text-soft)]">
            Acceso solo para personal autorizado del club.
          </div>
        </div>
      </main>
    </div>
  );
}

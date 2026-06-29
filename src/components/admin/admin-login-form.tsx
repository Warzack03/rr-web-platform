"use client";

import type { FormEvent } from "react";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { LoaderCircle, ShieldCheck } from "lucide-react";

type AdminLoginFormProps = {
  callbackUrl?: string;
  error?: string;
};

const demoAccounts = [
  {
    id: "admin-demo",
    displayName: "Administrador",
    roleLabel: "Control total",
    username: "superadmin",
  },
] as const;

export function AdminLoginForm({
  callbackUrl = "/admin",
  error,
}: AdminLoginFormProps) {
  const router = useRouter();
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [feedback, setFeedback] = useState<string | null>(
    error ? "Credenciales invalidas o sesion no disponible." : null,
  );
  const [isPending, startTransition] = useTransition();

  function fillAccount(username: string) {
    setLogin(username);
    setPassword("ChangeMe123!");
    setFeedback(null);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFeedback(null);

    startTransition(async () => {
      const result = await signIn("credentials", {
        login,
        password,
        callbackUrl,
        redirect: false,
      });

      if (!result || result.error) {
        setFeedback("No se pudo iniciar sesion. Revisa email/usuario y contrasena.");
        return;
      }

      router.push(result.url ?? callbackUrl);
      router.refresh();
    });
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
      <form
        onSubmit={handleSubmit}
        className="rounded-[10px] border border-[color:var(--rr-border)] bg-[linear-gradient(180deg,rgba(20,31,49,0.98),rgba(10,18,31,0.98))] p-6 shadow-[var(--rr-shadow)] sm:p-8"
      >
        <div className="space-y-6">
          <div className="space-y-3">
            <p className="rr-kicker text-[color:var(--rr-gold)]">Acceso interno</p>
            <h1 className="rr-display text-[3rem] leading-[0.92] text-white sm:text-[3.6rem]">
              Backoffice deportivo
            </h1>
            <p className="max-w-xl text-[1rem] leading-6 text-[color:var(--rr-muted)]">
              Acceso unico para controlar la informacion deportiva que se publica en la web.
            </p>
          </div>

          <div className="grid gap-4">
            <label className="grid gap-2">
              <span className="rr-kicker text-[0.74rem] text-[color:var(--rr-muted)]">
                Email o usuario
              </span>
              <input
                value={login}
                onChange={(event) => setLogin(event.target.value)}
                className="min-h-12 rounded-[8px] border border-[color:var(--rr-border)] bg-[rgba(7,19,34,0.9)] px-4 text-white outline-none transition focus:border-[rgba(253,203,88,0.45)]"
                placeholder="superadmin"
                autoComplete="username"
              />
            </label>

            <label className="grid gap-2">
              <span className="rr-kicker text-[0.74rem] text-[color:var(--rr-muted)]">Contrasena</span>
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="min-h-12 rounded-[8px] border border-[color:var(--rr-border)] bg-[rgba(7,19,34,0.9)] px-4 text-white outline-none transition focus:border-[rgba(253,203,88,0.45)]"
                placeholder="ChangeMe123!"
                autoComplete="current-password"
              />
            </label>
          </div>

          {feedback ? (
            <div className="rounded-[8px] border border-[rgba(214,64,69,0.3)] bg-[rgba(214,64,69,0.12)] px-4 py-3 text-[0.94rem] text-[#ffb4ab]">
              {feedback}
            </div>
          ) : null}

          <button
            type="submit"
            disabled={isPending}
            className="rr-button rr-button-primary w-full justify-center disabled:cursor-wait disabled:opacity-70"
          >
            {isPending ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <ShieldCheck className="h-4 w-4" />}
            Entrar al admin
          </button>
        </div>
      </form>

      <div className="rounded-[10px] border border-[color:var(--rr-border)] bg-[linear-gradient(180deg,rgba(11,22,38,0.96),rgba(7,14,24,0.96))] p-6 shadow-[var(--rr-shadow)] sm:p-8">
        <div className="space-y-5">
          <div>
            <p className="rr-kicker text-[color:var(--rr-gold)]">Cuentas demo</p>
            <h2 className="rr-display mt-2 text-[2.25rem] leading-[0.94] text-white">
              Entrada rapida
            </h2>
          </div>

          <div className="grid gap-3">
            {demoAccounts.map((account) => (
              <button
                key={account.id}
                type="button"
                onClick={() => fillAccount(account.username)}
                className="rounded-[10px] border border-white/10 bg-[rgba(255,255,255,0.04)] px-4 py-4 text-left transition hover:border-[rgba(253,203,88,0.25)] hover:bg-[rgba(253,203,88,0.08)]"
              >
                <p className="text-[1rem] font-semibold text-white">{account.displayName}</p>
                <p className="mt-1 text-[0.92rem] text-[color:var(--rr-muted)]">
                  {account.roleLabel} · {account.username}
                </p>
              </button>
            ))}
          </div>

          <div className="rounded-[10px] border border-white/10 bg-[rgba(255,255,255,0.04)] px-4 py-4 text-[0.94rem] leading-6 text-[color:var(--rr-muted)]">
            La cuenta inicial usa <span className="font-semibold text-white">ADMIN_INITIAL_PASSWORD</span> si existe, o <span className="font-semibold text-white">ChangeMe123!</span> en local.
          </div>
        </div>
      </div>
    </div>
  );
}

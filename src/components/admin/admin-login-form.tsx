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
  const feedbackId = "admin-login-feedback";
  const hasFeedback = Boolean(feedback);

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
    <div className="mx-auto w-full max-w-[680px]">
      <form
        onSubmit={handleSubmit}
        aria-describedby={hasFeedback ? feedbackId : undefined}
        className="rounded-[22px] border border-[color:var(--rr-border)] bg-[linear-gradient(160deg,rgba(255,255,255,0.055),rgba(255,255,255,0.028))] p-6 shadow-[var(--rr-shadow)] backdrop-blur-md sm:p-8"
      >
        <div className="space-y-6">
          <div className="space-y-3">
            <p className="rr-kicker text-[color:var(--rr-gold)]">Acceso interno</p>
            <h1 className="rr-display text-[3rem] leading-[1] text-white sm:text-[3.55rem]">
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
                className="min-h-12 rounded-[14px] border border-[color:var(--rr-border)] bg-[rgba(255,255,255,0.04)] px-4 text-white outline-none transition focus:border-[rgba(243,203,69,0.48)]"
                placeholder="Introduce tu email o usuario"
                autoComplete="username"
                required
                aria-invalid={hasFeedback}
                aria-describedby={hasFeedback ? feedbackId : undefined}
              />
            </label>

            <label className="grid gap-2">
              <span className="rr-kicker text-[0.74rem] text-[color:var(--rr-muted)]">Contrasena</span>
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="min-h-12 rounded-[14px] border border-[color:var(--rr-border)] bg-[rgba(255,255,255,0.04)] px-4 text-white outline-none transition focus:border-[rgba(243,203,69,0.48)]"
                placeholder="Introduce tu contrasena"
                autoComplete="current-password"
                required
                aria-invalid={hasFeedback}
                aria-describedby={hasFeedback ? feedbackId : undefined}
              />
            </label>
          </div>

          {feedback ? (
            <div
              id={feedbackId}
              role="alert"
              className="rounded-[14px] border border-[rgba(221,108,112,0.34)] bg-[rgba(221,108,112,0.12)] px-4 py-3 text-[0.94rem] text-[#ffc1c4]"
            >
              {feedback}
            </div>
          ) : null}

          <button
            type="submit"
            disabled={isPending}
            className="rr-button rr-button-primary w-full justify-center disabled:cursor-wait disabled:opacity-70"
          >
            {isPending ? (
              <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden="true" />
            ) : (
              <ShieldCheck className="h-4 w-4" aria-hidden="true" />
            )}
            Entrar al admin
          </button>
        </div>
      </form>
    </div>
  );
}

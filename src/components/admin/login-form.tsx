"use client";

import { Eye, EyeOff, LoaderCircle, ShieldCheck } from "lucide-react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useMemo, useState } from "react";

function sanitizeCallbackUrl(value: string | null) {
  if (!value || !value.startsWith("/admin")) {
    return "/admin";
  }

  return value;
}

function getInitialError(error: string | null) {
  if (error === "CredentialsSignin") {
    return "Las credenciales no son validas.";
  }

  if (error === "SessionRequired") {
    return "Inicia sesion para acceder al backoffice.";
  }

  return null;
}

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = useMemo(
    () => sanitizeCallbackUrl(searchParams.get("callbackUrl")),
    [searchParams],
  );
  const [error, setError] = useState<string | null>(getInitialError(searchParams.get("error")));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const formData = new FormData(event.currentTarget);
    const login = String(formData.get("login") ?? "");
    const password = String(formData.get("password") ?? "");

    const result = await signIn("credentials", {
      login,
      password,
      redirect: false,
      callbackUrl,
    });

    setIsSubmitting(false);

    if (!result || result.error) {
      setError("No hemos podido iniciar sesion. Revisa tus credenciales.");
      return;
    }

    router.push(result.url ?? callbackUrl);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-2">
        <label
          htmlFor="login"
          className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--rr-text-soft)]"
        >
          Email o usuario
        </label>
        <input
          id="login"
          name="login"
          type="text"
          autoComplete="username"
          required
          className="w-full rounded-[14px] border border-[var(--rr-border)] bg-[rgba(8,20,38,0.66)] px-4 py-3 text-base text-white outline-none transition placeholder:text-[var(--rr-text-soft)] focus:border-[var(--rr-border-strong)] focus:ring-2 focus:ring-[rgba(253,203,88,0.16)]"
          placeholder="admin@risingraimon.local"
        />
      </div>

      <div className="space-y-2">
        <label
          htmlFor="password"
          className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--rr-text-soft)]"
        >
          Contrasena
        </label>
        <div className="relative">
          <input
            id="password"
            name="password"
            type={isPasswordVisible ? "text" : "password"}
            autoComplete="current-password"
            required
            className="w-full rounded-[14px] border border-[var(--rr-border)] bg-[rgba(8,20,38,0.66)] px-4 py-3 pr-12 text-base text-white outline-none transition placeholder:text-[var(--rr-text-soft)] focus:border-[var(--rr-border-strong)] focus:ring-2 focus:ring-[rgba(253,203,88,0.16)]"
            placeholder="Introduce tu contrasena"
          />
          <button
            type="button"
            onClick={() => setIsPasswordVisible((currentValue) => !currentValue)}
            aria-label={isPasswordVisible ? "Ocultar contrasena" : "Mostrar contrasena"}
            aria-pressed={isPasswordVisible}
            className="absolute inset-y-0 right-0 inline-flex w-12 items-center justify-center text-[var(--rr-text-soft)] transition hover:text-white"
          >
            {isPasswordVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {error ? (
        <div className="rounded-[14px] border border-[rgba(255,180,171,0.35)] bg-[rgba(147,0,10,0.2)] px-4 py-3 text-sm text-[var(--rr-danger)]">
          {error}
        </div>
      ) : null}

      <button
        type="submit"
        disabled={isSubmitting}
        className="inline-flex w-full items-center justify-center gap-2 rounded-[14px] border border-[var(--rr-accent)] bg-[var(--rr-accent)] px-4 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-[var(--rr-bg)] transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-80"
      >
        {isSubmitting ? (
          <>
            <LoaderCircle className="h-4 w-4 animate-spin" />
            Accediendo
          </>
        ) : (
          <>
            <ShieldCheck className="h-4 w-4" />
            Entrar al admin
          </>
        )}
      </button>
    </form>
  );
}

"use client";

import { AlertTriangle } from "lucide-react";

type PublicErrorStateProps = {
  title?: string;
  description?: string;
  onRetry?: () => void;
};

export function PublicErrorState({
  title = "No hemos podido cargar esta pagina",
  description = "Prueba de nuevo en unos segundos.",
  onRetry,
}: PublicErrorStateProps) {
  return (
    <section className="mx-auto flex min-h-[62vh] w-full max-w-[1280px] items-center px-5 py-16 md:px-8 xl:px-16">
      <div className="rr-panel max-w-2xl border-[rgba(214,64,69,0.34)] p-8">
        <div className="flex items-center gap-3">
          <AlertTriangle className="h-5 w-5 text-[color:var(--rr-gold)]" />
          <p className="rr-kicker text-[color:var(--rr-gold)]">Error</p>
        </div>
        <h1 className="rr-display mt-4 text-[3.4rem] leading-none text-white md:text-[4rem]">
          {title}
        </h1>
        <p className="mt-4 text-[1.08rem] leading-7 text-[color:var(--rr-muted)]">
          {description}
        </p>
        {onRetry ? (
          <button
            type="button"
            onClick={onRetry}
            className="rr-button rr-button-primary mt-6 text-[0.84rem]"
          >
            Reintentar
          </button>
        ) : null}
      </div>
    </section>
  );
}

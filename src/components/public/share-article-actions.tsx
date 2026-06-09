"use client";

import { useState } from "react";
import { Link2, Share2 } from "lucide-react";

type ShareArticleActionsProps = {
  title: string;
};

type ShareStatus = "idle" | "copied" | "shared" | "error";

export function ShareArticleActions({ title }: ShareArticleActionsProps) {
  const [status, setStatus] = useState<ShareStatus>("idle");

  async function copyCurrentUrl() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setStatus("copied");
    } catch {
      setStatus("error");
    }
  }

  async function handleShare() {
    try {
      if (typeof navigator.share === "function") {
        await navigator.share({
          title,
          url: window.location.href,
        });
        setStatus("shared");
        return;
      }

      await copyCurrentUrl();
    } catch {
      setStatus("error");
    }
  }

  return (
    <section className="border-t border-[color:var(--rr-border)] pt-6 md:pt-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="rr-kicker text-[0.82rem] text-[color:var(--rr-gold)]">Compartir noticia</p>
          <p className="mt-2 text-[0.96rem] text-[color:var(--rr-muted)]">
            {status === "copied" && "Enlace copiado."}
            {status === "shared" && "Panel de compartir abierto."}
            {status === "error" && "No se pudo compartir ahora."}
            {status === "idle" && "Comparte o copia el enlace de esta noticia."}
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={handleShare}
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-[6px] border border-[color:var(--rr-border)] bg-[rgba(255,255,255,0.03)] px-4 py-3 text-[color:var(--rr-text)] transition hover:border-[color:var(--rr-border-strong)] hover:text-[color:var(--rr-gold)]"
          >
            <Share2 className="h-4 w-4" strokeWidth={1.9} />
            <span className="rr-kicker text-[0.82rem]">Compartir</span>
          </button>
          <button
            type="button"
            onClick={copyCurrentUrl}
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-[6px] border border-[color:var(--rr-border)] bg-[rgba(255,255,255,0.03)] px-4 py-3 text-[color:var(--rr-text)] transition hover:border-[color:var(--rr-border-strong)] hover:text-[color:var(--rr-gold)]"
          >
            <Link2 className="h-4 w-4" strokeWidth={1.9} />
            <span className="rr-kicker text-[0.82rem]">Copiar enlace</span>
          </button>
        </div>
      </div>
    </section>
  );
}

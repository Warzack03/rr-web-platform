import { Loader2 } from "lucide-react";

type PublicLoadingStateProps = {
  title?: string;
  description?: string;
};

export function PublicLoadingState({
  title = "Cargando contenido",
  description = "Preparando la seccion.",
}: PublicLoadingStateProps) {
  return (
    <section className="mx-auto flex min-h-[62vh] w-full max-w-[1280px] items-center px-5 py-16 md:px-8 xl:px-16">
      <div className="rr-panel max-w-2xl p-8">
        <div className="flex items-center gap-3">
          <Loader2 className="h-5 w-5 animate-spin text-[color:var(--rr-gold)]" />
          <p className="rr-kicker text-[color:var(--rr-gold)]">Un momento</p>
        </div>
        <h1 className="rr-display mt-4 text-[3.4rem] leading-none text-white md:text-[4rem]">
          {title}
        </h1>
        <p className="mt-4 text-[1.08rem] leading-7 text-[color:var(--rr-muted)]">
          {description}
        </p>
      </div>
    </section>
  );
}

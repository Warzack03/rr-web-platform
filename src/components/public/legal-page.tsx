import Link from "next/link";
import type { LegalDocument } from "@/lib/public/legal-content";

type LegalPageProps = {
  document: LegalDocument;
};

export function LegalPage({ document }: LegalPageProps) {
  return (
    <section className="px-5 py-14 md:px-8 md:py-18 xl:px-16">
      <div className="mx-auto flex w-full max-w-[980px] flex-col gap-8">
        <div className="rr-panel-dark px-6 py-6 md:px-8 md:py-8">
          <p className="rr-kicker text-[color:var(--rr-gold)]">Legal</p>
          <h1 className="rr-display mt-3 text-4xl leading-none text-[color:var(--rr-text)] md:text-5xl">
            {document.title}
          </h1>
          <div className="mt-5 space-y-3 text-[1.02rem] leading-7 text-[color:var(--rr-muted)]">
            {document.intro.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          {document.sections.map((section) => (
            <article
              key={section.title}
              className="rr-panel-dark px-6 py-6 md:px-8 md:py-7"
            >
              <h2 className="rr-display text-[1.8rem] leading-none text-[color:var(--rr-gold)] md:text-[2.1rem]">
                {section.title}
              </h2>

              {section.paragraphs ? (
                <div className="mt-4 space-y-3 text-[1rem] leading-7 text-[color:var(--rr-text)]/88">
                  {section.paragraphs.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
              ) : null}

              {section.items ? (
                <ul className="mt-4 space-y-3 pl-5 text-[1rem] leading-7 text-[color:var(--rr-text)]/88 marker:text-[color:var(--rr-gold)]">
                  {section.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              ) : null}

              {section.orderedItems ? (
                <ol className="mt-4 space-y-3 pl-5 text-[1rem] leading-7 text-[color:var(--rr-text)]/88 marker:font-bold marker:text-[color:var(--rr-gold)]">
                  {section.orderedItems.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ol>
              ) : null}
            </article>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-4 text-[0.92rem] uppercase tracking-[0.16em] text-[color:var(--rr-muted)]/85">
          <Link
            href="/"
            className="transition hover:text-[color:var(--rr-gold)]"
          >
            Volver a inicio
          </Link>
          <Link
            href="/politica-de-privacidad"
            className="transition hover:text-[color:var(--rr-gold)]"
          >
            Privacidad
          </Link>
          <Link
            href="/politica-de-cookies"
            className="transition hover:text-[color:var(--rr-gold)]"
          >
            Cookies
          </Link>
        </div>
      </div>
    </section>
  );
}

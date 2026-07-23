import type { PublicNewsQuoteBlock } from "@/lib/contracts/public";

type ArticleQuoteProps = {
  block: PublicNewsQuoteBlock;
};

export function ArticleQuote({ block }: ArticleQuoteProps) {
  return (
    <blockquote className="border-l-2 border-[color:var(--rr-gold)] bg-[rgba(17,31,53,0.88)] px-5 py-5 shadow-[var(--rr-shadow)] md:px-6">
      <p className="rr-display text-[2rem] leading-[1] text-[color:var(--rr-gold)] md:text-[2.35rem]">
        <span aria-hidden="true">&ldquo;</span>
        {block.text}
        <span aria-hidden="true">&rdquo;</span>
      </p>
      {block.attribution ? (
        <footer className="rr-kicker mt-3 text-[0.84rem] text-[color:var(--rr-text)]">
          {block.attribution}
        </footer>
      ) : null}
    </blockquote>
  );
}

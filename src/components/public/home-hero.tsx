import Link from "next/link";
import { ArrowRight, Shield } from "lucide-react";
import { CTAButton } from "@/components/public/cta-button";
import type { HomeHeroContent } from "@/lib/public/home-content";

type HomeHeroProps = {
  content: HomeHeroContent;
};

export function HomeHero({ content }: HomeHeroProps) {
  return (
    <section className="relative isolate overflow-hidden border-b border-[color:var(--rr-border)] bg-[linear-gradient(180deg,#112947_0%,#09172d_100%)]">
      <div className="absolute inset-0 opacity-95">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(216,236,255,0.48),transparent_22%),radial-gradient(circle_at_top_right,rgba(216,236,255,0.42),transparent_22%),linear-gradient(180deg,rgba(7,22,41,0.18),rgba(7,22,41,0.94))]" />
        <div className="absolute left-[-18%] top-[-32%] h-[24rem] w-[68%] rounded-[100%] border border-white/10 opacity-45 md:h-[34rem]" />
        <div className="absolute right-[-18%] top-[-32%] h-[24rem] w-[68%] rounded-[100%] border border-white/10 opacity-45 md:h-[34rem]" />
        <div className="absolute left-[12%] top-[18%] h-24 w-24 rounded-full bg-white/55 blur-[72px] md:h-40 md:w-40" />
        <div className="absolute right-[12%] top-[18%] h-24 w-24 rounded-full bg-white/55 blur-[72px] md:h-40 md:w-40" />
        <div className="absolute left-[17%] top-[40%] h-2 w-[15%] rounded-full bg-white/40 blur-sm" />
        <div className="absolute right-[17%] top-[40%] h-2 w-[15%] rounded-full bg-white/40 blur-sm" />
        <div className="absolute inset-x-[4%] bottom-[18%] h-[18rem] rounded-t-[100%] border-t border-white/8 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.08),transparent_62%)] opacity-75" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(7,22,41,0.1)_0%,rgba(7,22,41,0.18)_48%,rgba(7,22,41,0.92)_100%)]" />
      </div>

      <div className="relative mx-auto flex min-h-[31rem] w-full max-w-[1280px] items-end px-5 pb-14 pt-24 md:min-h-[35rem] md:px-8 md:pb-16 xl:px-16">
        <div className="max-w-[43rem]">
          <div className="flex items-center gap-3">
            <span className="h-px w-10 bg-[color:var(--rr-gold)]" />
            <span className="rr-kicker text-[color:var(--rr-gold)]">{content.eyebrow}</span>
          </div>

          <h1 className="rr-display mt-7 text-[4.25rem] leading-[0.9] text-white sm:text-[5.6rem] lg:text-[7rem]">
            <span className="block">{content.titleLead}</span>
            <span className="mt-1 block text-[color:var(--rr-gold)]">{content.titleAccent}</span>
          </h1>

          <p className="mt-6 max-w-[34rem] text-[1.08rem] leading-7 text-[color:var(--rr-muted)] md:text-[1.18rem]">
            {content.description}
          </p>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
            <CTAButton href={content.primaryCta.href} className="w-full sm:w-auto">
              <ArrowRight className="h-4 w-4" strokeWidth={1.9} />
              {content.primaryCta.label}
            </CTAButton>

            <Link
              href={content.secondaryHref}
              className="rr-kicker inline-flex items-center gap-2 text-[0.88rem] text-[color:var(--rr-muted)] transition hover:text-[color:var(--rr-gold)]"
            >
              <Shield className="h-4 w-4" strokeWidth={1.9} />
              {content.secondaryLabel}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

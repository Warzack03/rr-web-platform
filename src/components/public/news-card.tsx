import Link from "next/link";
import { cn } from "@/lib/utils";

type NewsCardProps = {
  href: string;
  category: string;
  title: string;
  tone: "ball" | "tactics";
};

export function NewsCard({ href, category, title, tone }: NewsCardProps) {
  return (
    <Link
      href={href}
      className="group relative isolate block overflow-hidden rounded-[6px] border border-[color:var(--rr-border)] bg-[#161b20] aspect-[4/3] sm:aspect-[16/10]"
    >
      <div
        className={cn(
          "absolute inset-0 transition duration-500 group-hover:scale-[1.03]",
          tone === "ball" &&
            "bg-[radial-gradient(circle_at_18%_8%,rgba(218,238,255,0.7),transparent_18%),radial-gradient(circle_at_82%_8%,rgba(218,238,255,0.5),transparent_16%),linear-gradient(180deg,rgba(16,31,43,0.3),rgba(6,19,36,0.74)),linear-gradient(135deg,#1a303f_0%,#0b1725_64%,#0a1d33_100%)]",
          tone === "tactics" &&
            "bg-[linear-gradient(135deg,rgba(10,26,24,0.85),rgba(14,58,52,0.72)),radial-gradient(circle_at_top,rgba(189,255,229,0.15),transparent_40%)]",
        )}
      />

      {tone === "ball" ? (
        <>
          <div className="absolute left-1/2 top-[56%] h-[70%] w-[70%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#2d0f0f] bg-[radial-gradient(circle_at_30%_30%,#70403a,#311310_62%,#180707_100%)] shadow-[0_18px_34px_rgba(0,0,0,0.42)]" />
          <div className="absolute inset-x-0 bottom-0 h-16 bg-[linear-gradient(180deg,transparent,rgba(10,20,32,0.78))]" />
        </>
      ) : (
        <>
          <div className="absolute left-1/2 top-1/2 h-[78%] w-[54%] -translate-x-1/2 -translate-y-1/2 rounded-[4px] border border-white/18" />
          <div className="absolute left-1/2 top-1/2 h-[34%] w-[34%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/18" />
          <div className="absolute inset-y-[22%] left-1/2 w-px -translate-x-1/2 bg-white/18" />
          <div className="absolute inset-x-[23%] top-1/2 h-px -translate-y-1/2 bg-white/18" />
        </>
      )}

      <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_32%,rgba(5,11,18,0.28)_58%,rgba(5,11,18,0.94)_100%)]" />
      <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
        <span className="rr-kicker inline-flex bg-[rgba(7,22,41,0.88)] px-2.5 py-1 text-[0.82rem] text-[color:var(--rr-gold)]">
          {category}
        </span>
        <h3 className="rr-display mt-3 text-[2rem] leading-[0.95] text-white sm:text-[2.35rem]">
          {title}
        </h3>
      </div>
    </Link>
  );
}

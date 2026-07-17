import Image from "next/image";
import { Shield } from "lucide-react";
import { cn } from "@/lib/utils";

type StandingTeamCrestProps = {
  logoUrl?: string;
  logoAlt?: string;
  isClub?: boolean;
  className?: string;
  imageClassName?: string;
  iconClassName?: string;
};

function canUsePublicImage(logoUrl?: string) {
  return Boolean(logoUrl?.startsWith("/"));
}

export function StandingTeamCrest({
  logoUrl,
  logoAlt,
  isClub,
  className,
  imageClassName,
  iconClassName,
}: StandingTeamCrestProps) {
  return (
    <span
      className={cn(
        "relative flex shrink-0 items-center justify-center overflow-hidden border",
        isClub
          ? "border-[color:var(--rr-border-strong)] bg-[rgba(253,203,88,0.1)] shadow-[inset_0_0_18px_rgba(253,203,88,0.08)]"
          : "border-white/10 bg-[rgba(255,255,255,0.03)]",
        className,
      )}
    >
      {canUsePublicImage(logoUrl) ? (
        <Image
          src={logoUrl as string}
          alt={logoAlt ?? ""}
          width={64}
          height={64}
          className={cn("h-[78%] w-[78%] object-contain", imageClassName)}
        />
      ) : (
        <Shield
          className={cn(
            "h-5 w-5",
            isClub ? "text-[color:var(--rr-gold)]" : "text-[color:var(--rr-muted)]",
            iconClassName,
          )}
          strokeWidth={1.8}
        />
      )}
    </span>
  );
}

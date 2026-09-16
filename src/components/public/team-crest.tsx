"use client";

import { useState } from "react";
import { getTeamInitials } from "@/lib/public/team-initials";
import { cn } from "@/lib/utils";

type TeamCrestProps = {
  name: string;
  logoUrl?: string;
  logoAlt?: string;
  fallbackLabel?: string;
  isClub?: boolean;
  className?: string;
  imageClassName?: string;
  initialsClassName?: string;
};

export function TeamCrest({
  name,
  logoUrl,
  logoAlt,
  fallbackLabel,
  isClub = false,
  className,
  imageClassName,
  initialsClassName,
}: TeamCrestProps) {
  const [failedLogoUrl, setFailedLogoUrl] = useState<string>();
  const normalizedLogoUrl = logoUrl?.trim();

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
      {normalizedLogoUrl && normalizedLogoUrl !== failedLogoUrl ? (
        // Media URLs are selected by an admin and may be local or remote.
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={normalizedLogoUrl}
          alt={logoAlt ?? `Escudo ${name}`}
          className={cn("h-[78%] w-[78%] object-contain", imageClassName)}
          onError={() => setFailedLogoUrl(normalizedLogoUrl)}
        />
      ) : (
        <span
          aria-label={`Iniciales de ${name}`}
          className={cn(
            "rr-display leading-none",
            isClub ? "text-[color:var(--rr-gold)]" : "text-[color:var(--rr-text)]/78",
            initialsClassName,
          )}
        >
          {fallbackLabel?.trim() || getTeamInitials(name)}
        </span>
      )}
    </span>
  );
}

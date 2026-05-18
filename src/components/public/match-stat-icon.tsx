import Image from "next/image";
import { cn } from "@/lib/utils";

type MatchStatIconProps = {
  type: "goal" | "assist";
  size?: number;
  className?: string;
};

const ICON_ASSETS = {
  goal: {
    src: "/icons/match/goal.webp",
    alt: "Gol",
  },
  assist: {
    src: "/icons/match/assist-boot.png",
    alt: "Asistencia",
  },
} as const;

export function MatchStatIcon({
  type,
  size = 16,
  className,
}: MatchStatIconProps) {
  const asset = ICON_ASSETS[type];

  return (
    <span
      className={cn("inline-flex shrink-0 items-center justify-center", className)}
      aria-hidden="true"
    >
      <Image
        src={asset.src}
        alt={asset.alt}
        width={size}
        height={size}
        className="h-auto w-auto object-contain"
      />
    </span>
  );
}

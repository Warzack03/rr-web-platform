import { ArrowUpRight, CirclePlay } from "lucide-react";
import { cn } from "@/lib/utils";

type HighlightsButtonProps = {
  href: string;
  className?: string;
};

export function HighlightsButton({ href, className }: HighlightsButtonProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className={cn(
        "rr-button rr-button-primary min-w-[12rem] justify-center text-[0.94rem]",
        className,
      )}
    >
      <CirclePlay className="h-4 w-4" strokeWidth={1.9} />
      <span>Ver resumen</span>
      <ArrowUpRight className="h-4 w-4" strokeWidth={1.9} />
    </a>
  );
}

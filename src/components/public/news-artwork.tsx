import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/utils";
import type { PublicNewsImageTone } from "@/lib/contracts/public";

type NewsArtworkProps = {
  imageTone: PublicNewsImageTone;
  imageUrl?: string;
  className?: string;
  alt?: string;
  children?: ReactNode;
};

function getArticleToneClassName(imageTone: PublicNewsImageTone) {
  switch (imageTone) {
    case "stadium-night":
      return "bg-[radial-gradient(circle_at_14%_14%,rgba(224,242,255,0.82),transparent_16%),radial-gradient(circle_at_86%_12%,rgba(224,242,255,0.64),transparent_14%),linear-gradient(180deg,rgba(6,14,24,0.08),rgba(7,18,32,0.84)),linear-gradient(135deg,#23374b_0%,#10233c_58%,#081626_100%)]";
    case "locker-room":
      return "bg-[linear-gradient(180deg,rgba(6,15,27,0.14),rgba(5,12,22,0.84)),linear-gradient(135deg,#1b2c44_0%,#0e1f34_38%,#071321_100%)]";
    case "academy-surge":
      return "bg-[radial-gradient(circle_at_66%_42%,rgba(252,117,76,0.34),transparent_14%),radial-gradient(circle_at_58%_52%,rgba(252,117,76,0.18),transparent_22%),linear-gradient(135deg,#071a2f_0%,#0d1f38_56%,#08111b_100%)]";
    case "press-room":
      return "bg-[radial-gradient(circle_at_22%_14%,rgba(212,229,255,0.3),transparent_18%),linear-gradient(135deg,#1e3048_0%,#0d1e33_50%,#081321_100%)]";
    case "training-ground":
      return "bg-[radial-gradient(circle_at_22%_14%,rgba(225,244,255,0.54),transparent_16%),radial-gradient(circle_at_80%_20%,rgba(192,234,255,0.3),transparent_18%),linear-gradient(180deg,rgba(7,22,41,0.04),rgba(7,22,41,0.82)),linear-gradient(135deg,#20364f_0%,#0f243b_50%,#081422_100%)]";
    case "crowd-lights":
      return "bg-[radial-gradient(circle_at_18%_18%,rgba(218,238,255,0.62),transparent_16%),radial-gradient(circle_at_82%_18%,rgba(218,238,255,0.52),transparent_16%),linear-gradient(180deg,rgba(6,15,24,0.05),rgba(7,18,31,0.84)),linear-gradient(135deg,#223852_0%,#10243e_54%,#071220_100%)]";
    default:
      return "bg-[linear-gradient(135deg,#20344c_0%,#0e2138_55%,#071321_100%)]";
  }
}

export function NewsArtwork({ imageTone, imageUrl, className, alt, children }: NewsArtworkProps) {
  const coverImageStyle: CSSProperties | undefined = imageUrl
    ? {
        backgroundImage: `url(${JSON.stringify(imageUrl)})`,
      }
    : undefined;

  return (
    <div
      role={alt ? "img" : undefined}
      aria-label={alt}
      className={cn("relative overflow-hidden", getArticleToneClassName(imageTone), className)}
    >
      {imageUrl ? (
        <div
          className="absolute inset-0 scale-[1.01] bg-cover bg-center opacity-95"
          style={coverImageStyle}
        />
      ) : null}

      {imageTone === "locker-room" ? (
        <>
          <div className="absolute inset-x-[14%] top-[14%] bottom-[14%] rounded-[4px] border border-white/12" />
          <div className="absolute inset-y-[14%] left-[33%] w-px bg-white/10" />
          <div className="absolute inset-y-[14%] right-[33%] w-px bg-white/10" />
          <div className="absolute inset-x-[14%] top-[34%] h-px bg-white/10" />
        </>
      ) : null}

      {imageTone === "academy-surge" ? (
        <>
          <div className="absolute left-[45%] top-[18%] h-[56%] w-[34%] rounded-full border border-[#d85f3f]/40" />
          <div className="absolute left-[40%] top-[26%] h-[42%] w-[24%] rounded-full border border-[#ff8a63]/35" />
        </>
      ) : null}

      {imageTone === "press-room" ? (
        <>
          <div className="absolute left-[18%] right-[18%] top-[24%] h-[36%] rounded-[4px] border border-white/10" />
          <div className="absolute left-[24%] right-[24%] bottom-[18%] h-[16%] rounded-[4px] border border-white/8" />
        </>
      ) : null}

      {(imageTone === "stadium-night" ||
        imageTone === "training-ground" ||
        imageTone === "crowd-lights") ? (
        <>
          <div className="absolute left-[14%] top-[14%] h-16 w-16 rounded-full bg-white/30 blur-[46px]" />
          <div className="absolute right-[14%] top-[14%] h-16 w-16 rounded-full bg-white/25 blur-[46px]" />
          <div className="absolute inset-x-[8%] bottom-[12%] h-[7rem] rounded-t-[100%] border-t border-white/8 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.08),transparent_60%)]" />
        </>
      ) : null}

      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(7,18,31,0.04)_0%,rgba(7,18,31,0.2)_46%,rgba(7,18,31,0.92)_100%)]" />
      {children ? <div className="absolute inset-0">{children}</div> : null}
    </div>
  );
}

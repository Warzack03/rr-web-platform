import { AlertTriangle, CheckCircle2, Info } from "lucide-react";
import { AdminPanel } from "@/components/admin/admin-panel";
import { cn } from "@/lib/utils";

type AdminFeedbackBannerProps = {
  message: string;
  tone?: "success" | "danger" | "info";
};

const toneClasses: Record<
  NonNullable<AdminFeedbackBannerProps["tone"]>,
  { panel: string; icon: string; Icon: typeof CheckCircle2 }
> = {
  success: {
    panel: "border-[rgba(243,203,69,0.3)]",
    icon: "text-[color:var(--rr-gold)]",
    Icon: CheckCircle2,
  },
  danger: {
    panel: "border-[rgba(221,108,112,0.34)]",
    icon: "text-[#ffc1c4]",
    Icon: AlertTriangle,
  },
  info: {
    panel: "border-[rgba(107,159,255,0.3)]",
    icon: "text-[#b8d3ff]",
    Icon: Info,
  },
};

export function AdminFeedbackBanner({
  message,
  tone = "success",
}: AdminFeedbackBannerProps) {
  const config = toneClasses[tone];

  return (
    <AdminPanel className={cn("px-4 py-3.5", config.panel)}>
      <div className="flex items-center gap-3 text-[0.92rem] leading-5 text-white">
        <config.Icon className={cn("h-4.5 w-4.5", config.icon)} />
        <p>{message}</p>
      </div>
    </AdminPanel>
  );
}

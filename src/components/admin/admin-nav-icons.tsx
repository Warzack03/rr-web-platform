import type { LucideIcon } from "lucide-react";
import {
  BarChart3,
  CalendarRange,
  FileClock,
  FileImage,
  FileText,
  LayoutDashboard,
  ShieldCheck,
  Swords,
  Trophy,
  UserCog,
  Users,
  UsersRound,
} from "lucide-react";
import type { AdminSectionKey } from "@/server/auth/permissions";

const iconBySection: Record<AdminSectionKey, LucideIcon> = {
  dashboard: LayoutDashboard,
  seasons: CalendarRange,
  teams: ShieldCheck,
  players: UsersRound,
  assignments: Users,
  matches: Swords,
  standings: Trophy,
  stats: BarChart3,
  news: FileText,
  media: FileImage,
  imports: FileClock,
  users: UserCog,
  settings: UserCog,
};

export function getAdminNavIcon(section: AdminSectionKey) {
  return iconBySection[section];
}

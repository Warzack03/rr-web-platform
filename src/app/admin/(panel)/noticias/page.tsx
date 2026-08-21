import type { Metadata } from "next";
import { AdminNewsWorkspace } from "@/components/admin/admin-news-workspace";
import { requireAdminSectionAccess } from "@/server/auth/session";
import { getAdminMediaPickerOptions } from "@/server/services/admin-media";
import { getAdminNewsScreenData } from "@/server/services/admin-news";

export const metadata: Metadata = {
  title: "Noticias",
};

export default async function AdminNewsPage() {
  const user = await requireAdminSectionAccess("news");
  const [data, coverMediaOptions] = await Promise.all([
    getAdminNewsScreenData(user),
    getAdminMediaPickerOptions(["NEWS_COVER"]),
  ]);

  return <AdminNewsWorkspace initialData={data} coverMediaOptions={coverMediaOptions} />;
}

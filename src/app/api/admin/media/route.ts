import { NextResponse } from "next/server";
import { canAccessAdminSection } from "@/server/auth/permissions";
import { getAuthenticatedAdmin } from "@/server/auth/session";
import { storeUploadedMediaAsset } from "@/server/services/admin-media";

export async function POST(request: Request) {
  const user = await getAuthenticatedAdmin();

  if (!user) {
    return NextResponse.json({ ok: false, message: "Sesion no valida." }, { status: 401 });
  }

  if (!canAccessAdminSection(user.role, "media")) {
    return NextResponse.json({ ok: false, message: "No tienes permiso para subir media." }, { status: 403 });
  }

  try {
    const formData = await request.formData();
    const item = await storeUploadedMediaAsset(user, formData);

    return NextResponse.json({
      ok: true,
      item,
      message: "Media subida y guardada.",
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        message: error instanceof Error ? error.message : "No hemos podido subir la media.",
      },
      { status: 400 },
    );
  }
}

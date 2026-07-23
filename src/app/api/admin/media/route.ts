import { NextResponse } from "next/server";
import { canAccessAdminSection } from "@/server/auth/permissions";
import { getAuthenticatedAdmin } from "@/server/auth/session";
import {
  getSafeServerErrorMessage,
  logServerError,
} from "@/server/logging/safe-server-log";
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
    logServerError("admin.media.upload", error, { userId: user.id });

    return NextResponse.json(
      {
        ok: false,
        message: getSafeServerErrorMessage(error, "No hemos podido subir la media."),
      },
      { status: 400 },
    );
  }
}

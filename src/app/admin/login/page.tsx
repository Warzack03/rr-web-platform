import type { Metadata } from "next";
import { AdminLoginForm } from "@/components/admin/admin-login-form";

export const metadata: Metadata = {
  title: "Login admin",
  description: "Acceso interno al backoffice deportivo de Rising Raimon.",
};

type AdminLoginPageProps = {
  searchParams: Promise<{
    callbackUrl?: string | string[];
    error?: string | string[];
  }>;
};

function getSingleValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function AdminLoginPage({
  searchParams,
}: AdminLoginPageProps) {
  const resolvedSearchParams = await searchParams;
  const callbackUrl = getSingleValue(resolvedSearchParams.callbackUrl);
  const error = getSingleValue(resolvedSearchParams.error);

  return (
    <div className="rr-admin min-h-screen bg-[radial-gradient(circle_at_top_right,rgba(243,203,69,0.16),transparent_26%),linear-gradient(165deg,#06111d_0%,#0b223d_52%,#07111b_100%)] px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
      <div className="mx-auto max-w-6xl">
        <AdminLoginForm callbackUrl={callbackUrl} error={error} />
      </div>
    </div>
  );
}

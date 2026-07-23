"use client";

import { AdminErrorState } from "@/components/admin/admin-error-state";

export default function AdminError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="rr-admin min-h-screen bg-[radial-gradient(circle_at_top_right,rgba(243,203,69,0.16),transparent_26%),linear-gradient(165deg,#06111d_0%,#0b223d_52%,#07111b_100%)] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1280px]">
        <AdminErrorState onRetry={reset} />
      </div>
    </div>
  );
}

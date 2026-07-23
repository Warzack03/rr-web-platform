"use client";

import { AdminErrorState } from "@/components/admin/admin-error-state";

export default function AdminPanelError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return <AdminErrorState onRetry={reset} />;
}

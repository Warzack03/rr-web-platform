"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { adminPreviewRoleOptions, adminRoleLabels, type AdminRole } from "@/lib/admin/roles";

type AdminRoleSwitcherProps = {
  actualRole: AdminRole;
  previewRole: AdminRole;
};

export function AdminRoleSwitcher({
  actualRole,
  previewRole,
}: AdminRoleSwitcherProps) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  function handleChange(nextRole: AdminRole) {
    const params = new URLSearchParams(searchParams.toString());

    if (nextRole === actualRole) {
      params.delete("previewRole");
    } else {
      params.set("previewRole", nextRole);
    }

    const query = params.toString();
    router.push(query ? `${pathname}?${query}` : pathname);
  }

  return (
    <label className="flex min-w-0 flex-1 flex-col gap-1 text-left sm:min-w-[13rem] sm:flex-none">
      <span className="rr-kicker text-[0.7rem] text-[color:var(--rr-muted)]">Vista</span>
      <select
        value={previewRole}
        onChange={(event) => handleChange(event.target.value as AdminRole)}
        className="min-h-11 rounded-[8px] border border-[color:var(--rr-border)] bg-[rgba(7,19,34,0.92)] px-3 text-[0.95rem] text-white outline-none transition focus:border-[rgba(253,203,88,0.45)]"
      >
        {adminPreviewRoleOptions.map((role) => (
          <option key={role} value={role}>
            {adminRoleLabels[role]}
            {role === actualRole ? " · actual" : " · prueba"}
          </option>
        ))}
      </select>
    </label>
  );
}

"use client";

import { LogOut, Settings } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";

type LogoutButtonProps = {
  showSettings?: boolean;
};

export function LogoutButton({ showSettings = false }: LogoutButtonProps) {
  const pathname = usePathname();

  return (
    <div className="flex flex-col gap-2">
      {showSettings ? (
        <Link
          href="/admin/configuracion"
          aria-label="Configuracion"
          className={`inline-flex items-center gap-3 rounded-[18px] border px-4 py-3 text-sm font-semibold uppercase tracking-[0.16em] transition ${
            pathname === "/admin/configuracion"
              ? "border-[var(--rr-border-strong)] bg-[var(--rr-accent)] text-[var(--rr-bg)]"
              : "border-[var(--rr-border)] bg-white/5 text-[var(--rr-text)] hover:border-[var(--rr-border-strong)] hover:text-[var(--rr-accent)]"
          }`}
        >
          <Settings className="h-4 w-4" />
          Configuracion
        </Link>
      ) : null}

      <button
        type="button"
        onClick={() => signOut({ callbackUrl: "/admin/login" })}
        className="inline-flex items-center gap-3 rounded-[18px] border border-[var(--rr-border)] bg-white/5 px-4 py-3 text-sm font-semibold uppercase tracking-[0.16em] text-[var(--rr-text)] transition hover:border-[var(--rr-border-strong)] hover:text-[var(--rr-accent)]"
      >
        <LogOut className="h-4 w-4" />
        Cerrar sesion
      </button>
    </div>
  );
}

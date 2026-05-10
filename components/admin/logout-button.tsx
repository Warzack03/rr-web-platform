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
    <div className="flex items-center gap-2">
      {showSettings ? (
        <Link
          href="/admin/configuracion"
          aria-label="Configuracion"
          className={`inline-flex h-11 w-11 items-center justify-center rounded-full border text-slate-100 transition ${
            pathname === "/admin/configuracion"
              ? "border-amber-300/60 bg-amber-400 text-slate-950"
              : "border-white/12 bg-white/[0.04] hover:border-white/20 hover:bg-white/[0.08]"
          }`}
        >
          <Settings className="h-4 w-4" />
        </Link>
      ) : null}

      <button
        type="button"
        onClick={() => signOut({ callbackUrl: "/admin/login" })}
        className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.04] px-4 py-2.5 text-sm font-medium text-slate-100 transition hover:border-white/20 hover:bg-white/[0.08]"
      >
        <LogOut className="h-4 w-4" />
        Cerrar sesion
      </button>
    </div>
  );
}

"use client";

import { useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

type CoachTeamOption = {
  slug: string;
  name: string;
};

type AdminCoachTeamSwitcherProps = {
  options: CoachTeamOption[];
  value: string;
  onChange: (teamSlug: string) => void;
};

const fieldClassName =
  "min-h-11 rounded-[14px] border border-[color:var(--rr-border)] bg-[rgba(255,255,255,0.04)] px-3 text-white outline-none transition focus:border-[rgba(243,203,69,0.48)]";

export function AdminCoachTeamSwitcher({
  options,
  value,
  onChange,
}: AdminCoachTeamSwitcherProps) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const selectedTeam =
    options.find((team) => team.slug === value) ?? options[0];

  useEffect(() => {
    if (!selectedTeam) {
      return;
    }

    if (searchParams.get("team") === selectedTeam.slug) {
      return;
    }

    const params = new URLSearchParams(searchParams.toString());
    params.set("team", selectedTeam.slug);
    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname);
  }, [pathname, router, searchParams, selectedTeam]);

  function handleChange(nextTeamSlug: string) {
    onChange(nextTeamSlug);

    const params = new URLSearchParams(searchParams.toString());
    params.set("team", nextTeamSlug);
    const query = params.toString();
    router.push(query ? `${pathname}?${query}` : pathname);
  }

  if (options.length <= 1) {
    return (
      <div className="grid gap-2">
        <span className="rr-kicker text-[0.74rem] text-[color:var(--rr-muted)]">
          Equipo activo
        </span>
        <div className="flex min-h-11 items-center rounded-[14px] border border-white/10 bg-white/5 px-3 text-[0.92rem] text-white">
          {selectedTeam?.name ?? "Equipo asignado"}
        </div>
      </div>
    );
  }

  return (
    <label className="grid gap-2">
      <span className="rr-kicker text-[0.74rem] text-[color:var(--rr-muted)]">
        Cambiar equipo
      </span>
      <select
        value={value}
        onChange={(event) => handleChange(event.target.value)}
        className={fieldClassName}
      >
        {options.map((team) => (
          <option key={team.slug} value={team.slug}>
            {team.name}
          </option>
        ))}
      </select>
    </label>
  );
}

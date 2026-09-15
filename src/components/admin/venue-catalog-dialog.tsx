"use client";

import { useMemo, useState, type FormEvent } from "react";
import { MapPin, Pencil, Plus, X } from "lucide-react";
import { saveVenueAction } from "@/app/admin/(panel)/partidos/actions";
import type {
  MatchManagementTeam,
  MatchManagementVenue,
} from "@/lib/admin/match-management";
import type { AdminMatchesScreenData } from "@/server/services/admin-matches";

type VenueCatalogDialogProps = {
  open: boolean;
  venues: MatchManagementVenue[];
  teams: MatchManagementTeam[];
  onClose: () => void;
  onSaved: (data: AdminMatchesScreenData, message: string) => void;
  onError: (message: string) => void;
};

type VenueFormState = {
  venueId?: string;
  competitionId: string;
  name: string;
  address: string;
  active: boolean;
};

const fieldClassName =
  "min-h-11 rounded-[14px] border border-[color:var(--rr-border)] bg-[rgba(255,255,255,0.04)] px-3 text-white outline-none transition focus:border-[rgba(243,203,69,0.48)]";

export function VenueCatalogDialog({
  open,
  venues,
  teams,
  onClose,
  onSaved,
  onError,
}: VenueCatalogDialogProps) {
  const competitions = useMemo(
    () =>
      Array.from(
        new Map(
          teams
            .filter((team) => team.competitionId)
            .map((team) => [team.competitionId as string, {
              id: team.competitionId as string,
              name: team.competition,
            }]),
        ).values(),
      ),
    [teams],
  );
  const [form, setForm] = useState<VenueFormState>({
    competitionId: competitions[0]?.id ?? "",
    name: "",
    address: "",
    active: true,
  });
  const [isSaving, setIsSaving] = useState(false);

  if (!open) return null;

  function resetForm(competitionId = form.competitionId || competitions[0]?.id || "") {
    setForm({ competitionId, name: "", address: "", active: true });
  }

  function editVenue(venue: MatchManagementVenue) {
    setForm({
      venueId: venue.id,
      competitionId: venue.competitionId,
      name: venue.name,
      address: venue.address ?? "",
      active: venue.active,
    });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSaving(true);
    const result = await saveVenueAction(form);
    setIsSaving(false);

    if (!result.ok) {
      onError(result.message);
      return;
    }

    resetForm();
    onSaved(result.data, result.message);
  }

  const catalogVenues = venues.filter((venue) => venue.competitionId);

  return (
    <div className="fixed inset-0 z-40 flex items-start justify-center overflow-y-auto bg-[rgba(5,10,18,0.78)] px-4 py-6 backdrop-blur-sm sm:px-6 sm:py-10">
      <div className="w-full max-w-6xl rounded-[22px] border border-[color:var(--rr-border)] bg-[linear-gradient(160deg,rgba(13,32,55,0.98),rgba(7,22,41,0.98))] shadow-[0_32px_90px_rgba(0,0,0,0.42)]">
        <div className="flex items-start justify-between gap-4 border-b border-white/10 px-5 py-5 sm:px-6">
          <div>
            <p className="rr-kicker text-[color:var(--rr-gold)]">Catalogo por competicion</p>
            <h2 className="rr-display mt-2 text-[2.2rem] leading-none text-white">Campos</h2>
            <p className="mt-2 text-[0.92rem] text-[color:var(--rr-muted)]">
              Define una vez las pistas y reutilizalas en todo el calendario.
            </p>
          </div>
          <button type="button" onClick={onClose} disabled={isSaving} className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5" aria-label="Cerrar">
            <X className="h-5 w-5 text-[color:var(--rr-gold)]" />
          </button>
        </div>

        <div className="grid gap-5 p-5 sm:p-6 lg:grid-cols-[minmax(0,1fr)_23rem]">
          <div className="grid content-start gap-3 sm:grid-cols-2">
            {catalogVenues.map((venue) => (
              <button
                key={venue.id}
                type="button"
                onClick={() => editVenue(venue)}
                className="flex items-center gap-4 rounded-[17px] border border-white/10 bg-white/[0.035] p-4 text-left transition hover:border-[rgba(243,203,69,0.3)]"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[12px] border border-white/10 bg-white/5">
                  <MapPin className="h-5 w-5 text-[color:var(--rr-gold)]" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold text-white">{venue.name}</p>
                  <p className="mt-1 truncate text-[0.8rem] text-[color:var(--rr-muted)]">
                    {venue.address || venue.competition}
                  </p>
                  {!venue.active ? <span className="mt-2 inline-block text-[0.7rem] uppercase tracking-wider text-[#ff9a9a]">Inactivo</span> : null}
                </div>
                <Pencil className="h-4 w-4 shrink-0 text-[color:var(--rr-gold)]" />
              </button>
            ))}

            {catalogVenues.length === 0 ? (
              <div className="rounded-[17px] border border-dashed border-white/15 px-5 py-8 text-center sm:col-span-2">
                <MapPin className="mx-auto h-7 w-7 text-[color:var(--rr-gold)]" />
                <p className="mt-3 font-semibold text-white">Aun no hay campos</p>
                <p className="mt-1 text-[0.86rem] text-[color:var(--rr-muted)]">Crea el primero con el formulario.</p>
              </div>
            ) : null}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 rounded-[19px] border border-white/10 bg-white/[0.035] p-5 lg:sticky lg:top-5 lg:self-start">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="rr-kicker text-[color:var(--rr-gold)]">{form.venueId ? "Editar" : "Nuevo campo"}</p>
                <p className="mt-1 font-semibold text-white">Datos reutilizables</p>
              </div>
              {form.venueId ? <button type="button" onClick={() => resetForm()} className="text-[0.78rem] text-[color:var(--rr-muted)] hover:text-white">Cancelar</button> : null}
            </div>

            <label className="grid gap-2">
              <span className="rr-kicker text-[0.72rem] text-[color:var(--rr-muted)]">Competicion</span>
              <select value={form.competitionId} onChange={(event) => setForm((current) => ({ ...current, competitionId: event.target.value }))} disabled={Boolean(form.venueId) || isSaving} className={fieldClassName} required>
                {competitions.map((competition) => <option key={competition.id} value={competition.id}>{competition.name}</option>)}
              </select>
            </label>

            <label className="grid gap-2">
              <span className="rr-kicker text-[0.72rem] text-[color:var(--rr-muted)]">Nombre publico</span>
              <input value={form.name} onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} disabled={isSaving} className={fieldClassName} placeholder="Sant Ignasi Sarria · Pista 1" required maxLength={180} />
            </label>

            <label className="grid gap-2">
              <span className="rr-kicker text-[0.72rem] text-[color:var(--rr-muted)]">Direccion opcional</span>
              <input value={form.address} onChange={(event) => setForm((current) => ({ ...current, address: event.target.value }))} disabled={isSaving} className={fieldClassName} placeholder="Direccion o referencia" maxLength={255} />
            </label>

            <label className="flex items-center gap-3 rounded-[14px] border border-white/10 bg-white/4 px-3 py-3 text-[0.86rem] text-white">
              <input type="checkbox" checked={form.active} onChange={(event) => setForm((current) => ({ ...current, active: event.target.checked }))} className="h-4 w-4 accent-[color:var(--rr-gold)]" />
              Disponible para nuevos partidos
            </label>

            <button type="submit" disabled={isSaving || competitions.length === 0} className="rr-button rr-button-primary w-full justify-center text-[0.8rem]">
              {form.venueId ? <Pencil className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
              {isSaving ? "Guardando..." : form.venueId ? "Guardar campo" : "Crear campo"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

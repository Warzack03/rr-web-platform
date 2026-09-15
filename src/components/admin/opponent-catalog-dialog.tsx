"use client";

import { useMemo, useState, type FormEvent } from "react";
import { ImagePlus, Pencil, Plus, Shield, X } from "lucide-react";
import { saveOpponentAction } from "@/app/admin/(panel)/partidos/actions";
import { MediaPickerDialog } from "@/components/admin/media-picker-dialog";
import type { AdminMediaPickerItem } from "@/lib/admin/media-management";
import type {
  MatchManagementOpponent,
  MatchManagementTeam,
} from "@/lib/admin/match-management";
import type { AdminMatchesScreenData } from "@/server/services/admin-matches";

type OpponentCatalogDialogProps = {
  open: boolean;
  opponents: MatchManagementOpponent[];
  teams: MatchManagementTeam[];
  mediaItems: AdminMediaPickerItem[];
  onClose: () => void;
  onSaved: (data: AdminMatchesScreenData, message: string) => void;
  onError: (message: string) => void;
};

type FormState = {
  opponentId?: string;
  competitionId: string;
  name: string;
  logoMediaId: string;
  active: boolean;
};

const fieldClassName =
  "min-h-11 rounded-[14px] border border-[color:var(--rr-border)] bg-[rgba(255,255,255,0.04)] px-3 text-white outline-none transition focus:border-[rgba(243,203,69,0.48)]";

export function OpponentCatalogDialog({
  open,
  opponents,
  teams,
  mediaItems,
  onClose,
  onSaved,
  onError,
}: OpponentCatalogDialogProps) {
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
  const [form, setForm] = useState<FormState>({
    competitionId: competitions[0]?.id ?? "",
    name: "",
    logoMediaId: "",
    active: true,
  });
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const selectedLogo = mediaItems.find((item) => item.id === form.logoMediaId);

  if (!open) return null;

  function resetForm(competitionId = form.competitionId || competitions[0]?.id || "") {
    setForm({ competitionId, name: "", logoMediaId: "", active: true });
  }

  function editOpponent(opponent: MatchManagementOpponent) {
    setForm({
      opponentId: opponent.id,
      competitionId: opponent.competitionId,
      name: opponent.name,
      logoMediaId: opponent.logoMediaId ?? "",
      active: opponent.active,
    });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSaving(true);
    const result = await saveOpponentAction(form);
    setIsSaving(false);

    if (!result.ok) {
      onError(result.message);
      return;
    }

    resetForm();
    onSaved(result.data, result.message);
  }

  return (
    <>
      <div className="fixed inset-0 z-40 flex items-start justify-center overflow-y-auto bg-[rgba(5,10,18,0.78)] px-4 py-6 backdrop-blur-sm sm:px-6 sm:py-10">
        <div className="w-full max-w-6xl rounded-[22px] border border-[color:var(--rr-border)] bg-[linear-gradient(160deg,rgba(13,32,55,0.98),rgba(7,22,41,0.98))] shadow-[0_32px_90px_rgba(0,0,0,0.42)]">
          <div className="flex items-start justify-between gap-4 border-b border-white/10 px-5 py-5 sm:px-6">
            <div>
              <p className="rr-kicker text-[color:var(--rr-gold)]">Catalogo por competicion</p>
              <h2 className="rr-display mt-2 text-[2.2rem] leading-none text-white">Equipos rivales</h2>
              <p className="mt-2 text-[0.92rem] text-[color:var(--rr-muted)]">
                Un solo nombre y escudo para partidos, calendario y clasificacion.
              </p>
            </div>
            <button type="button" onClick={onClose} disabled={isSaving} className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5" aria-label="Cerrar">
              <X className="h-5 w-5 text-[color:var(--rr-gold)]" />
            </button>
          </div>

          <div className="grid gap-5 p-5 sm:p-6 lg:grid-cols-[minmax(0,1fr)_23rem]">
            <div className="grid content-start gap-3 sm:grid-cols-2">
              {opponents.filter((opponent) => opponent.competitionId).map((opponent) => (
                <button
                  key={opponent.id}
                  type="button"
                  onClick={() => editOpponent(opponent)}
                  className="flex items-center gap-4 rounded-[17px] border border-white/10 bg-white/[0.035] p-4 text-left transition hover:border-[rgba(243,203,69,0.3)]"
                >
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-[12px] border border-white/10 bg-white/5">
                    {opponent.logoUrl ? (
                      // The media library can contain admin-approved external image URLs.
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={opponent.logoUrl} alt={opponent.logoAlt ?? `Escudo ${opponent.name}`} className="h-full w-full object-contain p-1" />
                    ) : (
                      <Shield className="h-6 w-6 text-[color:var(--rr-muted)]" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold text-white">{opponent.name}</p>
                    <p className="mt-1 truncate text-[0.8rem] text-[color:var(--rr-muted)]">{opponent.competition}</p>
                    {!opponent.active ? <span className="mt-2 inline-block text-[0.7rem] uppercase tracking-wider text-[#ff9a9a]">Inactivo</span> : null}
                  </div>
                  <Pencil className="h-4 w-4 shrink-0 text-[color:var(--rr-gold)]" />
                </button>
              ))}

              {opponents.every((opponent) => !opponent.competitionId) ? (
                <div className="rounded-[17px] border border-dashed border-white/15 px-5 py-8 text-center sm:col-span-2">
                  <Shield className="mx-auto h-7 w-7 text-[color:var(--rr-gold)]" />
                  <p className="mt-3 font-semibold text-white">Aun no hay rivales</p>
                  <p className="mt-1 text-[0.86rem] text-[color:var(--rr-muted)]">Crea el primero con el formulario.</p>
                </div>
              ) : null}
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 rounded-[19px] border border-white/10 bg-white/[0.035] p-5 lg:sticky lg:top-5 lg:self-start">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="rr-kicker text-[color:var(--rr-gold)]">{form.opponentId ? "Editar" : "Nuevo rival"}</p>
                  <p className="mt-1 font-semibold text-white">Datos reutilizables</p>
                </div>
                {form.opponentId ? (
                  <button type="button" onClick={() => resetForm()} className="text-[0.78rem] text-[color:var(--rr-muted)] hover:text-white">Cancelar</button>
                ) : null}
              </div>

              <label className="grid gap-2">
                <span className="rr-kicker text-[0.72rem] text-[color:var(--rr-muted)]">Competicion</span>
                <select value={form.competitionId} onChange={(event) => setForm((current) => ({ ...current, competitionId: event.target.value }))} disabled={Boolean(form.opponentId) || isSaving} className={fieldClassName} required>
                  {competitions.map((competition) => <option key={competition.id} value={competition.id}>{competition.name}</option>)}
                </select>
              </label>

              <label className="grid gap-2">
                <span className="rr-kicker text-[0.72rem] text-[color:var(--rr-muted)]">Nombre</span>
                <input value={form.name} onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} disabled={isSaving} className={fieldClassName} placeholder="Nombre del rival" required maxLength={150} />
              </label>

              <div className="grid gap-2">
                <span className="rr-kicker text-[0.72rem] text-[color:var(--rr-muted)]">Escudo</span>
                {selectedLogo ? (
                  <div className="flex items-center gap-3 rounded-[14px] border border-white/10 bg-white/4 p-3">
                    {/* The media library can contain admin-approved external image URLs. */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={selectedLogo.publicUrl} alt={selectedLogo.altText} className="h-12 w-12 rounded-lg object-contain" />
                    <span className="min-w-0 flex-1 truncate text-[0.85rem] text-white">{selectedLogo.label}</span>
                    <button type="button" onClick={() => setForm((current) => ({ ...current, logoMediaId: "" }))} className="text-[0.76rem] text-[color:var(--rr-muted)] hover:text-white">Quitar</button>
                  </div>
                ) : null}
                <button type="button" onClick={() => setIsPickerOpen(true)} disabled={isSaving} className="rr-button rr-button-secondary justify-center text-[0.78rem]">
                  <ImagePlus className="h-4 w-4" />
                  {selectedLogo ? "Cambiar escudo" : "Elegir escudo"}
                </button>
              </div>

              <label className="flex items-center gap-3 rounded-[14px] border border-white/10 bg-white/4 px-3 py-3 text-[0.86rem] text-white">
                <input type="checkbox" checked={form.active} onChange={(event) => setForm((current) => ({ ...current, active: event.target.checked }))} className="h-4 w-4 accent-[color:var(--rr-gold)]" />
                Disponible para nuevos partidos
              </label>

              <button type="submit" disabled={isSaving || competitions.length === 0} className="rr-button rr-button-primary w-full justify-center text-[0.8rem]">
                {form.opponentId ? <Pencil className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                {isSaving ? "Guardando..." : form.opponentId ? "Guardar rival" : "Crear rival"}
              </button>
            </form>
          </div>
        </div>
      </div>

      <MediaPickerDialog
        open={isPickerOpen}
        title="Elegir escudo del rival"
        description="Muestra recursos subidos con el uso Logo rival."
        items={mediaItems}
        allowedUsages={["OPPONENT_LOGO"]}
        selectedMediaId={form.logoMediaId}
        onClose={() => setIsPickerOpen(false)}
        onSelect={(item) => {
          setForm((current) => ({ ...current, logoMediaId: item.id }));
          setIsPickerOpen(false);
        }}
      />
    </>
  );
}

"use client";

import { useMemo, useState } from "react";
import { ImagePlus, Search, X } from "lucide-react";
import type { AdminMediaPickerItem, AdminMediaUsage } from "@/lib/admin/media-management";
import { formatMediaBytes } from "@/lib/admin/media-management";
import { cn } from "@/lib/utils";

type MediaPickerDialogProps = {
  open: boolean;
  title: string;
  description?: string;
  items: AdminMediaPickerItem[];
  allowedUsages: AdminMediaUsage[];
  selectedMediaId?: string;
  onClose: () => void;
  onSelect: (item: AdminMediaPickerItem) => void;
};

function inputClassName(className?: string) {
  return cn(
    "min-h-11 rounded-[14px] border border-white/10 bg-[rgba(255,255,255,0.04)] px-3 text-[0.94rem] text-white outline-none transition focus:border-[rgba(243,203,69,0.48)]",
    className,
  );
}

export function MediaPickerDialog({
  open,
  title,
  description,
  items,
  allowedUsages,
  selectedMediaId,
  onClose,
  onSelect,
}: MediaPickerDialogProps) {
  const [search, setSearch] = useState("");

  const filteredItems = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return items.filter((item) => {
      if (!allowedUsages.includes(item.usage)) {
        return false;
      }

      if (!normalizedSearch) {
        return true;
      }

      return [item.label, item.altText, item.usageLabel]
        .join(" ")
        .toLowerCase()
        .includes(normalizedSearch);
    });
  }, [allowedUsages, items, search]);

  const selectedItem =
    filteredItems.find((item) => item.id === selectedMediaId) ??
    items.find((item) => item.id === selectedMediaId) ??
    filteredItems[0];

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-[rgba(5,10,18,0.78)] px-4 py-6 backdrop-blur-sm sm:px-6 sm:py-10">
      <div className="w-full max-w-6xl rounded-[22px] border border-[color:var(--rr-border)] bg-[linear-gradient(160deg,rgba(13,32,55,0.98),rgba(7,22,41,0.98))] shadow-[0_32px_90px_rgba(0,0,0,0.42)]">
        <div className="flex items-start justify-between gap-4 border-b border-[rgba(255,255,255,0.1)] px-5 py-5 sm:px-6">
          <div className="space-y-2">
            <p className="rr-kicker text-[color:var(--rr-gold)]">Biblioteca real</p>
            <div>
              <h2 className="rr-display text-[2.25rem] leading-[1] text-white">{title}</h2>
              {description ? (
                <p className="mt-2 max-w-2xl text-[0.92rem] leading-6 text-[color:var(--rr-muted)]">
                  {description}
                </p>
              ) : null}
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-[color:var(--rr-muted)] transition hover:border-[rgba(243,203,69,0.28)] hover:text-white"
            aria-label="Cerrar selector de media"
          >
            <X className="h-5 w-5 text-[color:var(--rr-gold)]" />
          </button>
        </div>

        <div className="grid gap-4 px-5 py-5 sm:px-6 sm:py-6 xl:grid-cols-[minmax(0,1fr)_22rem]">
          <div className="space-y-4">
            <label className="relative block">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[color:var(--rr-muted)]" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Buscar recurso"
                className={inputClassName("w-full pl-9")}
              />
            </label>

            <div className="grid max-h-[32rem] gap-3 overflow-y-auto pr-1 md:grid-cols-2 xl:grid-cols-3">
              {filteredItems.map((item) => {
                const active = item.id === selectedItem?.id;

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => onSelect(item)}
                    className={cn(
                      "overflow-hidden rounded-[16px] border text-left transition",
                      active
                        ? "border-[rgba(243,203,69,0.34)] bg-[rgba(243,203,69,0.09)]"
                        : "border-white/10 bg-[rgba(255,255,255,0.045)] hover:border-white/20",
                    )}
                  >
                    <div className="aspect-[1.2/1] bg-[rgba(255,255,255,0.04)]">
                      <img
                        src={item.publicUrl}
                        alt={item.altText}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="space-y-2 px-4 py-3">
                      <p className="font-semibold text-white">{item.label}</p>
                      <p className="text-[0.82rem] text-[color:var(--rr-muted)]">
                        {item.usageLabel}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-4 xl:sticky xl:top-[7rem] xl:self-start">
            <div className="rounded-[20px] border border-[color:var(--rr-border)] bg-[linear-gradient(160deg,rgba(255,255,255,0.055),rgba(255,255,255,0.028))] p-5 shadow-[var(--rr-shadow)]">
              {selectedItem ? (
                <div className="space-y-4">
                  <div>
                    <p className="rr-kicker text-[color:var(--rr-gold)]">Seleccion actual</p>
                    <h3 className="mt-1 text-[1.12rem] font-semibold text-white">
                      {selectedItem.label}
                    </h3>
                  </div>

                  <div className="overflow-hidden rounded-[12px] border border-white/10 bg-white/4">
                    <img
                      src={selectedItem.publicUrl}
                      alt={selectedItem.altText}
                      className="max-h-72 w-full object-cover"
                    />
                  </div>

                  <div className="space-y-3 text-[0.88rem] text-[color:var(--rr-muted)]">
                    <div className="rounded-[16px] border border-white/10 bg-white/4 px-4 py-3">
                      <p className="rr-kicker text-[0.68rem]">Uso</p>
                      <p className="mt-2 text-white">{selectedItem.usageLabel}</p>
                    </div>
                    <div className="rounded-[16px] border border-white/10 bg-white/4 px-4 py-3">
                      <p className="rr-kicker text-[0.68rem]">Alt</p>
                      <p className="mt-2 text-white">{selectedItem.altText}</p>
                    </div>
                    <div className="rounded-[16px] border border-white/10 bg-white/4 px-4 py-3">
                      <p className="rr-kicker text-[0.68rem]">Tamanio</p>
                      <p className="mt-2 text-white">{formatMediaBytes(selectedItem.sizeBytes)}</p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => onSelect(selectedItem)}
                    className="rr-button rr-button-primary w-full text-[0.82rem]"
                  >
                    Usar este recurso
                  </button>
                </div>
              ) : (
                <div className="space-y-3 rounded-[12px] border border-white/10 bg-white/4 px-4 py-5 text-center">
                  <ImagePlus className="mx-auto h-5 w-5 text-[color:var(--rr-gold)]" />
                  <p className="font-semibold text-white">Sin recursos disponibles</p>
                  <p className="text-[0.88rem] leading-6 text-[color:var(--rr-muted)]">
                    Sube antes la imagen en la biblioteca de media o ajusta la busqueda.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

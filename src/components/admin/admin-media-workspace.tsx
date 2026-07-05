"use client";

import { useMemo, useRef, useState, type ChangeEvent } from "react";
import {
  FileImage,
  ImagePlus,
  Search,
  Shield,
  UserRound,
} from "lucide-react";
import { AdminFeedbackBanner } from "@/components/admin/admin-feedback-banner";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminPanel } from "@/components/admin/admin-panel";
import { AdminStatusBadge } from "@/components/admin/admin-status-badge";
import {
  adminMockMedia,
  getMediaTypeLabel,
  type AdminMediaItem,
  type AdminMediaType,
} from "@/lib/admin/mock-data";
import { cn } from "@/lib/utils";

type MediaFilter = "all" | AdminMediaType;
type EditableAdminMediaItem = AdminMediaItem & {
  previewUrl?: string;
};

const mediaTypeOptions: Array<{ value: MediaFilter; label: string }> = [
  { value: "all", label: "Todo" },
  { value: "player-photo", label: "Fotos" },
  { value: "card", label: "Cromos" },
  { value: "logo", label: "Logos" },
  { value: "banner", label: "Banners" },
  { value: "placeholder", label: "Placeholders" },
];

const usageNotes: Record<AdminMediaType, string> = {
  logo: "Escudos y marcas de equipos.",
  banner: "Cabeceras de equipo y bloques publicos.",
  "player-photo": "Base visual para ficha y cromo de jugador.",
  card: "Recursos de apoyo para composicion por capas.",
  placeholder: "Fallbacks para rivales, jugadores o equipos sin imagen.",
};

const typeTone: Record<AdminMediaType, "gold" | "blue" | "slate" | "success"> = {
  logo: "blue",
  banner: "gold",
  "player-photo": "success",
  card: "gold",
  placeholder: "slate",
};

function inputClassName(className?: string) {
  return cn(
    "min-h-11 rounded-[8px] border border-white/10 bg-[rgba(7,19,34,0.92)] px-3 text-[0.94rem] text-white outline-none transition focus:border-[rgba(253,203,88,0.45)]",
    className,
  );
}

function getMediaIcon(type: AdminMediaType) {
  if (type === "player-photo" || type === "card") {
    return UserRound;
  }

  if (type === "logo") {
    return Shield;
  }

  return FileImage;
}

export function AdminMediaWorkspace() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [mediaItems, setMediaItems] = useState<EditableAdminMediaItem[]>(adminMockMedia);
  const [selectedId, setSelectedId] = useState(mediaItems[0]?.id ?? "");
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<MediaFilter>("all");
  const [feedback, setFeedback] = useState<string | null>(null);
  const selectedItem =
    mediaItems.find((item) => item.id === selectedId) ?? mediaItems[0];

  const filteredItems = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return mediaItems.filter((item) => {
      const matchesSearch =
        normalizedSearch.length === 0 ||
        item.label.toLowerCase().includes(normalizedSearch) ||
        item.format.toLowerCase().includes(normalizedSearch);
      const matchesType = typeFilter === "all" || item.type === typeFilter;

      return matchesSearch && matchesType;
    });
  }, [mediaItems, search, typeFilter]);

  function inferUploadType(file: File): AdminMediaType {
    if (typeFilter !== "all") {
      return typeFilter;
    }

    if (file.type === "image/svg+xml") {
      return "logo";
    }

    return selectedItem?.type ?? "player-photo";
  }

  function handleOpenUpload() {
    fileInputRef.current?.click();
  }

  function handleFileSelection(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const nextType = inferUploadType(file);
    const format = file.name.split(".").pop()?.toUpperCase() ?? file.type ?? "Archivo";
    const previewUrl = file.type.startsWith("image/") ? URL.createObjectURL(file) : undefined;
    const nextItem: EditableAdminMediaItem = {
      id: `media-local-${Date.now()}`,
      label: file.name.replace(/\.[^/.]+$/, ""),
      type: nextType,
      updatedLabel: "Subida local pendiente",
      format,
      previewUrl,
    };

    setMediaItems((currentItems) => [nextItem, ...currentItems]);
    setSelectedId(nextItem.id);
    setFeedback("Archivo anadido a la biblioteca mock. Aun no se guarda en base de datos.");
    window.setTimeout(() => setFeedback(null), 2600);
    event.target.value = "";
  }

  return (
    <div className="space-y-6 lg:space-y-8">
      <AdminPageHeader
        eyebrow="Media"
        title="Biblioteca visual"
        description="Organiza fotos, logos, banners y recursos que alimentan fichas, cromos, equipos y noticias."
        actions={
          <button
            type="button"
            onClick={handleOpenUpload}
            className="rr-button rr-button-primary text-[0.84rem]"
          >
            Preparar subida
          </button>
        }
      />

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,.svg"
        onChange={handleFileSelection}
        className="hidden"
      />

      {feedback ? <AdminFeedbackBanner message={feedback} /> : null}

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_24rem]">
        <AdminPanel className="p-4 sm:p-5">
          <div className="space-y-4">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="rr-kicker text-[color:var(--rr-gold)]">Recursos mock</p>
                <h2 className="mt-1 text-[1.2rem] font-semibold text-white">
                  {filteredItems.length} archivos
                </h2>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <label className="relative block sm:min-w-[18rem]">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[color:var(--rr-muted)]" />
                  <input
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Buscar recurso"
                    className={inputClassName("w-full pl-9")}
                  />
                </label>
                <select
                  value={typeFilter}
                  onChange={(event) => setTypeFilter(event.target.value as MediaFilter)}
                  className={inputClassName("sm:min-w-[12rem]")}
                >
                  {mediaTypeOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid gap-3 md:grid-cols-2 2xl:grid-cols-3">
              {filteredItems.map((item) => {
                const Icon = getMediaIcon(item.type);
                const active = item.id === selectedItem?.id;

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setSelectedId(item.id)}
                    className={cn(
                      "rounded-[12px] border px-4 py-4 text-left transition",
                      active
                        ? "border-[rgba(253,203,88,0.34)] bg-[rgba(253,203,88,0.1)]"
                        : "border-white/10 bg-[rgba(255,255,255,0.04)] hover:border-white/20",
                    )}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-[10px] border border-white/10 bg-white/5">
                        <Icon className="h-5 w-5 text-[color:var(--rr-gold)]" />
                      </span>
                      <AdminStatusBadge
                        label={getMediaTypeLabel(item.type)}
                        tone={typeTone[item.type]}
                      />
                    </div>
                    <p className="mt-4 font-semibold text-white">{item.label}</p>
                    <p className="mt-1 text-[0.86rem] text-[color:var(--rr-muted)]">
                      {item.updatedLabel}
                    </p>
                    <p className="mt-3 text-[0.8rem] uppercase tracking-[0.14em] text-[color:var(--rr-muted)]">
                      {item.format}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>
        </AdminPanel>

        <div className="space-y-4 xl:sticky xl:top-[7.5rem] xl:self-start">
          <AdminPanel className="p-5">
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="rr-kicker text-[color:var(--rr-gold)]">Detalle</p>
                  <h2 className="mt-1 text-[1.16rem] font-semibold text-white">
                    {selectedItem?.label ?? "Sin recurso"}
                  </h2>
                </div>
                <ImagePlus className="h-5 w-5 text-[color:var(--rr-gold)]" />
              </div>

              {selectedItem ? (
                <>
                  <div className="rounded-[14px] border border-white/10 bg-[radial-gradient(circle_at_top,rgba(253,203,88,0.12),transparent_40%),rgba(255,255,255,0.04)] px-5 py-8 text-center">
                    {selectedItem.previewUrl ? (
                      <img
                        src={selectedItem.previewUrl}
                        alt={selectedItem.label}
                        className="mx-auto max-h-56 w-auto rounded-[12px] border border-white/10 object-contain"
                      />
                    ) : (
                      <>
                        <FileImage className="mx-auto h-12 w-12 text-[color:var(--rr-gold)]" />
                        <p className="mt-4 text-[0.96rem] font-semibold text-white">
                          Preview pendiente
                        </p>
                        <p className="mt-2 text-[0.86rem] leading-5 text-[color:var(--rr-muted)]">
                          En datos reales aqui se vera miniatura, dimensiones y ruta publica.
                        </p>
                      </>
                    )}
                  </div>

                  <div className="grid gap-3">
                    <div className="rounded-[10px] border border-white/10 bg-white/4 px-4 py-3">
                      <p className="rr-kicker text-[0.68rem] text-[color:var(--rr-muted)]">
                        Uso principal
                      </p>
                      <p className="mt-2 text-[0.92rem] text-white">
                        {usageNotes[selectedItem.type]}
                      </p>
                    </div>
                    <div className="rounded-[10px] border border-white/10 bg-white/4 px-4 py-3">
                      <p className="rr-kicker text-[0.68rem] text-[color:var(--rr-muted)]">
                        Formato
                      </p>
                      <p className="mt-2 text-[0.92rem] text-white">
                        {selectedItem.format}
                      </p>
                    </div>
                  </div>
                </>
              ) : null}
            </div>
          </AdminPanel>
        </div>
      </div>
    </div>
  );
}

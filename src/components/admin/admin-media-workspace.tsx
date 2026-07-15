"use client";

import { useEffect, useMemo, useRef, useState, type ChangeEvent } from "react";
import {
  FileImage,
  ImagePlus,
  Search,
  Shield,
  Trash2,
  Upload,
  UserRound,
} from "lucide-react";
import { deleteMediaAssetAction, updateMediaAssetAction } from "@/app/admin/(panel)/media/actions";
import { AdminFeedbackBanner } from "@/components/admin/admin-feedback-banner";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminPanel } from "@/components/admin/admin-panel";
import { AdminStatusBadge } from "@/components/admin/admin-status-badge";
import {
  adminMediaUsageValues,
  formatMediaBytes,
  getAdminMediaUsageLabel,
  getAdminMediaUsageNote,
  type AdminMediaItem,
  type AdminMediaUsage,
} from "@/lib/admin/media-management";
import { cn } from "@/lib/utils";

type AdminMediaWorkspaceProps = {
  initialItems: AdminMediaItem[];
};

type MediaFilter = "all" | AdminMediaUsage;
type FeedbackState = {
  message: string;
  tone: "success" | "danger" | "info";
};

const mediaFilterOptions: Array<{ value: MediaFilter; label: string }> = [
  { value: "all", label: "Todo" },
  ...adminMediaUsageValues.map((usage) => ({
    value: usage,
    label: getAdminMediaUsageLabel(usage),
  })),
];

function inputClassName(className?: string) {
  return cn(
    "min-h-11 rounded-[14px] border border-white/10 bg-[rgba(255,255,255,0.04)] px-3 text-[0.94rem] text-white outline-none transition focus:border-[rgba(243,203,69,0.48)]",
    className,
  );
}

function labelClassName() {
  return "rr-kicker text-[0.68rem] text-[color:var(--rr-muted)]";
}

function getMediaIcon(usage: AdminMediaUsage) {
  if (usage === "PLAYER_PHOTO" || usage === "PLAYER_CARD") {
    return UserRound;
  }

  if (usage === "TEAM_LOGO" || usage === "OPPONENT_LOGO") {
    return Shield;
  }

  return FileImage;
}

async function getImageDimensions(file: File) {
  if (!file.type.startsWith("image/")) {
    return {};
  }

  return new Promise<{ width?: number; height?: number }>((resolve) => {
    const image = new Image();
    const objectUrl = URL.createObjectURL(file);

    image.onload = () => {
      resolve({
        width: image.naturalWidth,
        height: image.naturalHeight,
      });
      URL.revokeObjectURL(objectUrl);
    };

    image.onerror = () => {
      resolve({});
      URL.revokeObjectURL(objectUrl);
    };

    image.src = objectUrl;
  });
}

export function AdminMediaWorkspace({ initialItems }: AdminMediaWorkspaceProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [items, setItems] = useState(initialItems);
  const [selectedId, setSelectedId] = useState(initialItems[0]?.id ?? "");
  const [search, setSearch] = useState("");
  const [usageFilter, setUsageFilter] = useState<MediaFilter>("all");
  const [feedback, setFeedback] = useState<FeedbackState | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [uploadUsage, setUploadUsage] = useState<AdminMediaUsage>("PLAYER_PHOTO");
  const [uploadAltText, setUploadAltText] = useState("");
  const [draftAltText, setDraftAltText] = useState(initialItems[0]?.altText ?? "");
  const [draftUsage, setDraftUsage] = useState<AdminMediaUsage>(
    initialItems[0]?.usage ?? "PLAYER_PHOTO",
  );

  const filteredItems = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return items.filter((item) => {
      const matchesUsage = usageFilter === "all" || item.usage === usageFilter;

      if (!matchesUsage) {
        return false;
      }

      if (!normalizedSearch) {
        return true;
      }

      return [item.label, item.altText, item.usageLabel, item.uploadedByName]
        .join(" ")
        .toLowerCase()
        .includes(normalizedSearch);
    });
  }, [items, search, usageFilter]);

  const selectedItem =
    items.find((item) => item.id === selectedId) ??
    items[0] ??
    null;

  useEffect(() => {
    if (!feedback) {
      return;
    }

    const timer = window.setTimeout(() => setFeedback(null), 2600);
    return () => window.clearTimeout(timer);
  }, [feedback]);

  function pushFeedback(message: string, tone: FeedbackState["tone"]) {
    setFeedback({ message, tone });
  }

  function syncDraftFromItem(item: AdminMediaItem | null) {
    if (!item) {
      setDraftAltText("");
      setDraftUsage("PLAYER_PHOTO");
      return;
    }

    setDraftAltText(item.altText);
    setDraftUsage(item.usage);
  }

  function selectItem(item: AdminMediaItem | null) {
    setSelectedId(item?.id ?? "");
    syncDraftFromItem(item);
  }

  function handleOpenUpload() {
    fileInputRef.current?.click();
  }

  async function handleFileSelection(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setIsUploading(true);

    try {
      const dimensions = await getImageDimensions(file);
      const formData = new FormData();
      formData.set("file", file);
      formData.set("usage", uploadUsage);
      formData.set("altText", uploadAltText);

      if (dimensions.width) {
        formData.set("width", String(dimensions.width));
      }

      if (dimensions.height) {
        formData.set("height", String(dimensions.height));
      }

      const response = await fetch("/api/admin/media", {
        method: "POST",
        body: formData,
      });
      const result = (await response.json()) as
        | { ok: true; item: AdminMediaItem; message: string }
        | { ok: false; message: string };

      if (!result.ok) {
        pushFeedback(result.message, "danger");
        return;
      }

      setItems((currentItems) => [result.item, ...currentItems]);
      selectItem(result.item);
      setUploadAltText("");
      pushFeedback(result.message, "success");
    } catch {
      pushFeedback("No hemos podido completar la subida.", "danger");
    } finally {
      setIsUploading(false);
      event.target.value = "";
    }
  }

  async function handleSaveMetadata() {
    if (!selectedItem) {
      return;
    }

    setIsSaving(true);
    const result = await updateMediaAssetAction({
      mediaId: selectedItem.id,
      usage: draftUsage,
      altText: draftAltText,
    });
    setIsSaving(false);

    if (!result.ok || !result.item) {
      pushFeedback(result.message, "danger");
      return;
    }

    setItems((currentItems) =>
      currentItems.map((item) => (item.id === result.item?.id ? result.item : item)),
    );
    selectItem(result.item);
    pushFeedback(result.message, "success");
  }

  async function handleDelete() {
    if (!selectedItem) {
      return;
    }

    setIsDeleting(true);
    const result = await deleteMediaAssetAction({ mediaId: selectedItem.id });
    setIsDeleting(false);

    if (!result.ok || !result.deletedId) {
      pushFeedback(result.message, "danger");
      return;
    }

    let nextSelectedId = "";

    setItems((currentItems) => {
      const remainingItems = currentItems.filter((item) => item.id !== result.deletedId);
      nextSelectedId = remainingItems[0]?.id ?? "";
      return remainingItems;
    });
    if (selectedItem.id === result.deletedId) {
      const nextItem = items.find((item) => item.id === nextSelectedId) ?? null;
      selectItem(nextItem);
    }
    pushFeedback(result.message, "success");
  }

  const hasMetadataChanges =
    selectedItem !== null &&
    (draftAltText.trim() !== selectedItem.altText || draftUsage !== selectedItem.usage);

  return (
    <div className="space-y-6 lg:space-y-8">
      <AdminPageHeader
        eyebrow="Media real"
        title="Biblioteca visual"
        description="Aqui ya trabajas sobre media_assets reales. Las imagenes se guardan en disco y su metadata queda registrada en la base de datos."
        actions={
          <button
            type="button"
            onClick={handleOpenUpload}
            disabled={isUploading}
            className="rr-button rr-button-primary text-[0.84rem]"
          >
            <Upload className="h-4 w-4" />
            {isUploading ? "Subiendo..." : "Subir imagen"}
          </button>
        }
      />

      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/avif,image/svg+xml"
        onChange={handleFileSelection}
        className="hidden"
      />

      {feedback ? <AdminFeedbackBanner message={feedback.message} tone={feedback.tone} /> : null}

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_24rem]">
        <AdminPanel className="p-4 sm:p-5">
          <div className="space-y-4">
            <div className="grid gap-3 rounded-[12px] border border-white/10 bg-white/4 p-4 lg:grid-cols-[minmax(0,1fr)_12rem_14rem]">
              <label className="grid gap-2">
                <span className={labelClassName()}>Buscar</span>
                <div className="relative">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[color:var(--rr-muted)]" />
                  <input
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Nombre, alt o uso"
                    className={inputClassName("w-full pl-9")}
                  />
                </div>
              </label>

              <label className="grid gap-2">
                <span className={labelClassName()}>Filtro</span>
                <select
                  value={usageFilter}
                  onChange={(event) => setUsageFilter(event.target.value as MediaFilter)}
                  className={inputClassName()}
                >
                  {mediaFilterOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>

              <div className="grid gap-2">
                <span className={labelClassName()}>Subida nueva</span>
                <div className="rounded-[14px] border border-white/10 bg-[rgba(255,255,255,0.04)] px-3 py-2.5">
                  <select
                    value={uploadUsage}
                    onChange={(event) => setUploadUsage(event.target.value as AdminMediaUsage)}
                    className="w-full bg-transparent text-[0.94rem] text-white outline-none"
                  >
                    {adminMediaUsageValues.map((usage) => (
                      <option key={usage} value={usage}>
                        {getAdminMediaUsageLabel(usage)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <label className="grid gap-2">
              <span className={labelClassName()}>Alt inicial para la subida</span>
              <input
                value={uploadAltText}
                onChange={(event) => setUploadAltText(event.target.value)}
                placeholder="Texto alternativo recomendado"
                className={inputClassName()}
              />
            </label>

            <div>
              <p className="rr-kicker text-[color:var(--rr-gold)]">Biblioteca</p>
              <h2 className="mt-1 text-[1.2rem] font-semibold text-white">
                {filteredItems.length} recursos
              </h2>
            </div>

            <div className="grid gap-3 md:grid-cols-2 2xl:grid-cols-3">
              {filteredItems.map((item) => {
                const Icon = getMediaIcon(item.usage);
                const active = item.id === selectedItem?.id;

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => selectItem(item)}
                    className={cn(
                      "overflow-hidden rounded-[12px] border text-left transition",
                      active
                        ? "border-[rgba(243,203,69,0.34)] bg-[rgba(243,203,69,0.08)]"
                        : "border-white/10 bg-[rgba(255,255,255,0.04)] hover:border-white/20",
                    )}
                  >
                    <div className="aspect-[1.4/1] bg-[rgba(255,255,255,0.03)]">
                      <img
                        src={item.publicUrl}
                        alt={item.altText}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="space-y-3 px-4 py-4">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-semibold text-white">{item.label}</p>
                          <p className="mt-1 text-[0.82rem] text-[color:var(--rr-muted)]">
                            {item.createdAtLabel}
                          </p>
                        </div>
                        <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-[16px] border border-white/10 bg-white/5">
                          <Icon className="h-4.5 w-4.5 text-[color:var(--rr-gold)]" />
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        <AdminStatusBadge label={item.usageLabel} tone="gold" />
                        <AdminStatusBadge
                          label={item.source === "local" ? "Local" : "Externo"}
                          tone={item.source === "local" ? "success" : "slate"}
                        />
                      </div>

                      <p className="text-[0.82rem] leading-5 text-[color:var(--rr-muted)]">
                        {item.referenceCount > 0
                          ? item.referenceSummary.join(" · ")
                          : "Sin uso activo"}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </AdminPanel>

        <div className="space-y-4 xl:sticky xl:top-[7.5rem] xl:self-start">
          <AdminPanel className="p-5">
            {selectedItem ? (
              <div className="space-y-5">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="rr-kicker text-[color:var(--rr-gold)]">Detalle</p>
                    <h2 className="mt-1 text-[1.16rem] font-semibold text-white">
                      {selectedItem.label}
                    </h2>
                  </div>
                  <ImagePlus className="h-5 w-5 text-[color:var(--rr-gold)]" />
                </div>

                <div className="overflow-hidden rounded-[14px] border border-white/10 bg-[radial-gradient(circle_at_top,rgba(243,203,69,0.12),transparent_40%),rgba(255,255,255,0.04)]">
                  <img
                    src={selectedItem.publicUrl}
                    alt={selectedItem.altText}
                    className="max-h-72 w-full object-cover"
                  />
                </div>

                <div className="grid gap-3">
                  <label className="grid gap-2">
                    <span className={labelClassName()}>Uso</span>
                    <select
                      value={draftUsage}
                      onChange={(event) => setDraftUsage(event.target.value as AdminMediaUsage)}
                      disabled={selectedItem.referenceCount > 0 || isSaving}
                      className={inputClassName()}
                    >
                      {adminMediaUsageValues.map((usage) => (
                        <option key={usage} value={usage}>
                          {getAdminMediaUsageLabel(usage)}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="grid gap-2">
                    <span className={labelClassName()}>Alt text</span>
                    <input
                      value={draftAltText}
                      onChange={(event) => setDraftAltText(event.target.value)}
                      disabled={isSaving}
                      className={inputClassName()}
                    />
                  </label>
                </div>

                <div className="grid gap-3">
                  <div className="rounded-[16px] border border-white/10 bg-white/4 px-4 py-3">
                    <p className={labelClassName()}>Nota de uso</p>
                    <p className="mt-2 text-[0.92rem] text-white">
                      {getAdminMediaUsageNote(draftUsage)}
                    </p>
                  </div>
                  <div className="rounded-[16px] border border-white/10 bg-white/4 px-4 py-3">
                    <p className={labelClassName()}>Guardado fisico</p>
                    <p className="mt-2 break-all text-[0.92rem] text-white">
                      {selectedItem.storagePath ?? "Recurso externo"}
                    </p>
                  </div>
                  <div className="rounded-[16px] border border-white/10 bg-white/4 px-4 py-3">
                    <p className={labelClassName()}>URL publica</p>
                    <p className="mt-2 break-all text-[0.92rem] text-white">
                      {selectedItem.publicUrl}
                    </p>
                  </div>
                  <div className="rounded-[16px] border border-white/10 bg-white/4 px-4 py-3">
                    <p className={labelClassName()}>Subido por</p>
                    <p className="mt-2 text-[0.92rem] text-white">
                      {selectedItem.uploadedByName}
                    </p>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="rounded-[16px] border border-white/10 bg-white/4 px-4 py-3">
                      <p className={labelClassName()}>Peso</p>
                      <p className="mt-2 text-[0.92rem] text-white">
                        {formatMediaBytes(selectedItem.sizeBytes)}
                      </p>
                    </div>
                    <div className="rounded-[16px] border border-white/10 bg-white/4 px-4 py-3">
                      <p className={labelClassName()}>Dimensiones</p>
                      <p className="mt-2 text-[0.92rem] text-white">
                        {selectedItem.width && selectedItem.height
                          ? `${selectedItem.width} x ${selectedItem.height}`
                          : "Sin dato"}
                      </p>
                    </div>
                  </div>
                  <div className="rounded-[16px] border border-white/10 bg-white/4 px-4 py-3">
                    <p className={labelClassName()}>Uso activo</p>
                    <p className="mt-2 text-[0.92rem] text-white">
                      {selectedItem.referenceCount > 0
                        ? selectedItem.referenceSummary.join(" · ")
                        : "Sin enlaces activos"}
                    </p>
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <button
                    type="button"
                    onClick={handleSaveMetadata}
                    disabled={!hasMetadataChanges || isSaving}
                    className="rr-button rr-button-primary text-[0.82rem] disabled:cursor-not-allowed disabled:opacity-45"
                  >
                    {isSaving ? "Guardando..." : "Guardar metadata"}
                  </button>
                  <button
                    type="button"
                    onClick={handleDelete}
                    disabled={!selectedItem.canDelete || isDeleting}
                    className="rr-button rr-button-secondary text-[0.82rem] disabled:cursor-not-allowed disabled:opacity-45"
                  >
                    <Trash2 className="h-4 w-4" />
                    {isDeleting ? "Eliminando..." : "Eliminar"}
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-3 rounded-[12px] border border-white/10 bg-white/4 px-4 py-5 text-center">
                <ImagePlus className="mx-auto h-5 w-5 text-[color:var(--rr-gold)]" />
                <p className="font-semibold text-white">Todavia no hay media real</p>
                <p className="text-[0.9rem] leading-6 text-[color:var(--rr-muted)]">
                  Sube la primera imagen y quedara guardada en disco y registrada en la base de datos.
                </p>
              </div>
            )}
          </AdminPanel>
        </div>
      </div>
    </div>
  );
}

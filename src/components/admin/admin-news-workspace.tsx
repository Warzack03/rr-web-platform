"use client";

import Link from "next/link";
import { useDeferredValue, useEffect, useMemo, useState } from "react";
import {
  Check,
  Eye,
  EyeOff,
  FileText,
  ImagePlus,
  Plus,
  Search,
  Star,
  Trash2,
  Video,
} from "lucide-react";
import {
  deleteNewsPostAction,
  saveNewsPostAction,
} from "@/app/admin/(panel)/noticias/actions";
import { AdminEmptyState } from "@/components/admin/admin-empty-state";
import { AdminFeedbackBanner } from "@/components/admin/admin-feedback-banner";
import { MediaPickerDialog } from "@/components/admin/media-picker-dialog";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminPanel } from "@/components/admin/admin-panel";
import { AdminStatusBadge } from "@/components/admin/admin-status-badge";
import type { AdminMediaPickerItem } from "@/lib/admin/media-management";
import type {
  AdminManagedNewsPost,
  AdminNewsStatus,
  AdminNewsTeamOption,
} from "@/lib/admin/news-management";
import {
  ADMIN_NEWS_GENERAL_TEAM_LABEL,
  adminNewsStatusValues,
  getAdminNewsStatusLabel,
  slugifyNewsTitle,
} from "@/lib/admin/news-management";
import type { AdminNewsScreenData } from "@/server/services/admin-news";
import { cn } from "@/lib/utils";

type AdminNewsWorkspaceProps = {
  initialData: AdminNewsScreenData;
  coverMediaOptions: AdminMediaPickerItem[];
};

type StatusFilter = "all" | AdminNewsStatus;
type FeedbackState = {
  message: string;
  tone: "success" | "danger" | "info";
};

type NewsEditorState = {
  newsPostId?: string;
  title: string;
  slug: string;
  excerpt: string;
  bodyMarkdown: string;
  externalVideoUrl: string;
  coverMediaId?: string;
  coverUrl?: string;
  coverAltText?: string;
  status: AdminNewsStatus;
  featured: boolean;
  publishedAt: string;
  relatedTeamIds: string[];
};

const NEW_POST_KEY = "__new__";

function inputClassName(className?: string) {
  return cn(
    "min-h-11 rounded-[14px] border border-white/10 bg-[rgba(255,255,255,0.04)] px-3 text-[0.94rem] text-white outline-none transition focus:border-[rgba(243,203,69,0.48)]",
    className,
  );
}

function labelClassName() {
  return "rr-kicker text-[0.68rem] text-[color:var(--rr-muted)]";
}

function getStatusTone(status: AdminNewsStatus) {
  switch (status) {
    case "PUBLISHED":
      return "success" as const;
    case "ARCHIVED":
      return "slate" as const;
    case "DRAFT":
    default:
      return "gold" as const;
  }
}

function createBlankNews(): NewsEditorState {
  return {
    title: "",
    slug: "",
    excerpt: "",
    bodyMarkdown: "",
    externalVideoUrl: "",
    coverMediaId: undefined,
    coverUrl: undefined,
    coverAltText: undefined,
    status: "DRAFT",
    featured: false,
    publishedAt: "",
    relatedTeamIds: [],
  };
}

function mapPostToEditor(post: AdminManagedNewsPost): NewsEditorState {
  return {
    newsPostId: post.id,
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt,
    bodyMarkdown: post.bodyMarkdown,
    externalVideoUrl: post.externalVideoUrl ?? "",
    coverMediaId: post.coverMediaId,
    coverUrl: post.coverUrl,
    coverAltText: post.coverAltText,
    status: post.status,
    featured: post.featured,
    publishedAt: post.publishedAt ?? "",
    relatedTeamIds: post.relatedTeamIds,
  };
}

function buildEditorBaseline(
  selectedKey: string,
  posts: AdminManagedNewsPost[],
): NewsEditorState {
  if (selectedKey === NEW_POST_KEY) {
    return createBlankNews();
  }

  const post = posts.find((item) => item.id === selectedKey);
  return post ? mapPostToEditor(post) : createBlankNews();
}

function formatTeamOptionLabel(team: AdminNewsTeamOption) {
  return `${team.name} - ${team.season}`;
}

function getRelatedTeamLabels(labels: string[]) {
  return labels.length > 0 ? labels : [ADMIN_NEWS_GENERAL_TEAM_LABEL];
}

export function AdminNewsWorkspace({
  initialData,
  coverMediaOptions,
}: AdminNewsWorkspaceProps) {
  const [screenData, setScreenData] = useState(initialData);
  const [selectedKey, setSelectedKey] = useState(
    initialData.posts[0]?.id ?? NEW_POST_KEY,
  );
  const [editorState, setEditorState] = useState<NewsEditorState>(() =>
    buildEditorBaseline(initialData.posts[0]?.id ?? NEW_POST_KEY, initialData.posts),
  );
  const [baselineState, setBaselineState] = useState<NewsEditorState>(() =>
    buildEditorBaseline(initialData.posts[0]?.id ?? NEW_POST_KEY, initialData.posts),
  );
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [feedback, setFeedback] = useState<FeedbackState | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [coverPickerOpen, setCoverPickerOpen] = useState(false);
  const deferredSearch = useDeferredValue(search.trim().toLowerCase());

  const filteredPosts = useMemo(() => {
    return screenData.posts.filter((post) => {
      if (statusFilter !== "all" && post.status !== statusFilter) {
        return false;
      }

      if (!deferredSearch) {
        return true;
      }

      return [
        post.title,
        post.slug,
        post.excerpt,
        getRelatedTeamLabels(post.relatedTeamLabels).join(" "),
      ]
        .join(" ")
        .toLowerCase()
        .includes(deferredSearch);
    });
  }, [deferredSearch, screenData.posts, statusFilter]);

  const selectedPost =
    screenData.posts.find((post) => post.id === selectedKey) ?? null;

  const hasUnsavedChanges =
    JSON.stringify(editorState) !== JSON.stringify(baselineState);

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

  function selectEditor(nextKey: string) {
    const nextBaseline = buildEditorBaseline(nextKey, screenData.posts);
    setSelectedKey(nextKey);
    setBaselineState(nextBaseline);
    setEditorState(nextBaseline);
  }

  function updateEditor<Key extends keyof NewsEditorState>(
    key: Key,
    value: NewsEditorState[Key],
  ) {
    setEditorState((currentValue) => {
      if (key === "title") {
        const nextTitle = value as string;

        return {
          ...currentValue,
          title: nextTitle,
          slug: slugifyNewsTitle(nextTitle),
        };
      }

      if (key === "status") {
        const nextStatus = value as AdminNewsStatus;
        if (nextStatus === "PUBLISHED" && !currentValue.publishedAt) {
          const now = new Date();
          const offsetMs = now.getTimezoneOffset() * 60_000;

          return {
            ...currentValue,
            status: nextStatus,
            publishedAt: new Date(now.getTime() - offsetMs).toISOString().slice(0, 16),
          };
        }
      }

      return {
        ...currentValue,
        [key]: value,
      };
    });
  }

  function toggleRelatedTeam(teamId: string) {
    setEditorState((currentValue) => ({
      ...currentValue,
      relatedTeamIds: currentValue.relatedTeamIds.includes(teamId)
        ? currentValue.relatedTeamIds.filter((value) => value !== teamId)
        : [...currentValue.relatedTeamIds, teamId],
    }));
  }

  function openNewPost() {
    selectEditor(NEW_POST_KEY);
  }

  async function handleSave() {
    setIsSaving(true);
    const result = await saveNewsPostAction({
      newsPostId: editorState.newsPostId,
      title: editorState.title,
      slug: editorState.slug,
      excerpt: editorState.excerpt,
      bodyMarkdown: editorState.bodyMarkdown,
      externalVideoUrl: editorState.externalVideoUrl,
      coverMediaId: editorState.coverMediaId ?? "",
      coverUrl: editorState.coverUrl ?? "",
      status: editorState.status,
      featured: editorState.featured,
      publishedAt: editorState.publishedAt,
      relatedTeamIds: editorState.relatedTeamIds,
    });
    setIsSaving(false);

    if (!result.ok) {
      pushFeedback(result.message, "danger");
      return;
    }

    setScreenData(result.data);
    const nextBaseline = buildEditorBaseline(result.selectedNewsPostId, result.data.posts);
    setSelectedKey(result.selectedNewsPostId);
    setBaselineState(nextBaseline);
    setEditorState(nextBaseline);
    pushFeedback(result.message, "success");
  }

  async function handleDelete() {
    if (!selectedPost?.id) {
      return;
    }

    const confirmed = window.confirm(
      `Se eliminara la noticia "${selectedPost.title}" del admin y de las rutas publicas. Esta accion no se puede deshacer desde aqui.`,
    );

    if (!confirmed) {
      return;
    }

    setIsDeleting(true);
    const result = await deleteNewsPostAction({ newsPostId: selectedPost.id });
    setIsDeleting(false);

    if (!result.ok) {
      pushFeedback(result.message, "danger");
      return;
    }

    const nextSelectedKey = result.selectedNewsPostId || NEW_POST_KEY;
    const nextBaseline = buildEditorBaseline(nextSelectedKey, result.data.posts);
    setScreenData(result.data);
    setSelectedKey(nextSelectedKey);
    setBaselineState(nextBaseline);
    setEditorState(nextBaseline);
    pushFeedback(result.message, "success");
  }

  return (
    <div className="space-y-6 lg:space-y-8">
      <AdminPageHeader
        eyebrow="Editorial"
        title="Noticias"
        description="Editor simple sobre datos reales para portada, actualidad de equipos y piezas publicables sin depender de WordPress."
        actions={
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={openNewPost}
              disabled={isSaving || isDeleting}
              className="rr-button rr-button-secondary text-[0.84rem] disabled:cursor-not-allowed disabled:opacity-45"
            >
              <Plus className="h-4 w-4" />
              Nueva noticia
            </button>
            {selectedPost ? (
              <button
                type="button"
                onClick={handleDelete}
                disabled={isSaving || isDeleting}
                className="rr-button rr-button-secondary text-[0.84rem] disabled:cursor-not-allowed disabled:opacity-45"
              >
                <Trash2 className="h-4 w-4" />
                {isDeleting ? "Eliminando..." : "Eliminar"}
              </button>
            ) : null}
            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving || isDeleting || !hasUnsavedChanges}
              className="rr-button rr-button-primary text-[0.84rem] disabled:cursor-not-allowed disabled:opacity-45"
            >
              {isSaving ? "Guardando..." : "Guardar cambios"}
            </button>
          </div>
        }
      />

      {feedback ? (
        <AdminFeedbackBanner message={feedback.message} tone={feedback.tone} />
      ) : null}

      <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-5">
        <AdminPanel className="p-4">
          <p className={labelClassName()}>Temporada activa</p>
          <p className="mt-2 text-[1.1rem] font-semibold text-white">
            {screenData.activeSeasonName ?? "Sin temporada"}
          </p>
        </AdminPanel>
        <AdminPanel className="p-4">
          <p className={labelClassName()}>Publicadas</p>
          <p className="mt-2 text-[1.1rem] font-semibold text-white">
            {screenData.posts.filter((post) => post.status === "PUBLISHED").length}
          </p>
        </AdminPanel>
        <AdminPanel className="p-4">
          <p className={labelClassName()}>Borradores</p>
          <p className="mt-2 text-[1.1rem] font-semibold text-white">
            {screenData.posts.filter((post) => post.status === "DRAFT").length}
          </p>
        </AdminPanel>
        <AdminPanel className="p-4">
          <p className={labelClassName()}>Archivadas</p>
          <p className="mt-2 text-[1.1rem] font-semibold text-white">
            {screenData.posts.filter((post) => post.status === "ARCHIVED").length}
          </p>
        </AdminPanel>
        <AdminPanel className="p-4">
          <p className={labelClassName()}>Destacada</p>
          <p className="mt-2 text-[1.1rem] font-semibold text-white">
            {screenData.posts.find((post) => post.featured && post.status === "PUBLISHED")
              ?.title ?? "Sin portada"}
          </p>
        </AdminPanel>
      </div>

      <div className="grid gap-4 xl:grid-cols-[25rem_minmax(0,1fr)]">
        <AdminPanel className="p-4 sm:p-5">
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="rr-kicker text-[color:var(--rr-gold)]">Biblioteca editorial</p>
                <h2 className="mt-1 text-[1.18rem] font-semibold text-white">
                  {filteredPosts.length} noticias
                </h2>
              </div>
              <FileText className="h-5 w-5 text-[color:var(--rr-gold)]" />
            </div>

            <label className="relative block">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[color:var(--rr-muted)]" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Buscar noticia"
                className={inputClassName("w-full pl-9")}
              />
            </label>

            <div className="grid grid-cols-2 gap-2 rounded-[12px] border border-white/10 bg-white/4 p-1">
              {(["all", ...adminNewsStatusValues] as const).map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setStatusFilter(value)}
                  className={cn(
                    "min-h-9 rounded-[9px] px-2 text-[0.76rem] font-medium transition",
                    statusFilter === value
                      ? "bg-[rgba(243,203,69,0.14)] text-[color:var(--rr-gold)]"
                      : "text-[color:var(--rr-muted)]",
                  )}
                >
                  {value === "all" ? "Todas" : getAdminNewsStatusLabel(value)}
                </button>
              ))}
            </div>

            {screenData.posts.length === 0 ? (
              <AdminEmptyState
                title="Sin noticias"
                description="Crea la primera noticia real para alimentar portada y seccion publica."
                action={
                  <button
                    type="button"
                    onClick={openNewPost}
                    className="rr-button rr-button-primary text-[0.82rem]"
                  >
                    Nueva noticia
                  </button>
                }
              />
            ) : filteredPosts.length === 0 ? (
              <AdminEmptyState
                title="Sin resultados"
                description="Ajusta la busqueda o el filtro para volver a ver noticias."
              />
            ) : (
              <div className="grid max-h-[50rem] gap-2 overflow-y-auto pr-1">
                {filteredPosts.map((post) => {
                  const active = post.id === selectedKey;

                  return (
                    <button
                      key={post.id}
                      type="button"
                      onClick={() => selectEditor(post.id)}
                      className={cn(
                        "rounded-[16px] border px-3 py-3 text-left transition",
                        active
                          ? "border-[rgba(243,203,69,0.34)] bg-[rgba(243,203,69,0.1)]"
                          : "border-white/10 bg-[rgba(255,255,255,0.04)] hover:border-white/20",
                      )}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-semibold text-white">{post.title}</p>
                          <p className="mt-1 text-[0.82rem] text-[color:var(--rr-muted)]">
                            {post.updatedAtLabel}
                          </p>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <AdminStatusBadge
                            label={getAdminNewsStatusLabel(post.status)}
                            tone={getStatusTone(post.status)}
                          />
                          {post.featured ? (
                            <AdminStatusBadge label="Destacada" tone="blue" />
                          ) : null}
                        </div>
                      </div>
                      <p className="mt-3 text-[0.88rem] leading-5 text-[color:var(--rr-muted)]">
                        {post.excerpt}
                      </p>
                      <p className="mt-3 text-[0.78rem] font-semibold text-[color:var(--rr-muted)]">
                        {getRelatedTeamLabels(post.relatedTeamLabels).join(" - ")}
                      </p>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </AdminPanel>

        <div className="space-y-4">
          <AdminPanel className="p-5 sm:p-6">
            <div className="space-y-6">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="rr-kicker text-[color:var(--rr-gold)]">
                    {selectedKey === NEW_POST_KEY ? "Nueva noticia" : "Editor"}
                  </p>
                  <h2 className="mt-2 text-[1.35rem] font-semibold text-white">
                    {editorState.title || "Pieza sin titulo"}
                  </h2>
                  <p className="mt-1 text-[0.92rem] text-[color:var(--rr-muted)]">
                    {selectedPost?.authorName ?? "Aun sin guardar"}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  <AdminStatusBadge
                    label={getAdminNewsStatusLabel(editorState.status)}
                    tone={getStatusTone(editorState.status)}
                  />
                  {editorState.featured ? (
                    <AdminStatusBadge label="Destacada" tone="blue" />
                  ) : null}
                  {selectedPost?.status === "PUBLISHED" ? (
                    <Link
                      href={`/noticias/${selectedPost.slug}`}
                      className="rr-button rr-button-secondary text-[0.76rem]"
                    >
                      Ver publica
                    </Link>
                  ) : null}
                </div>
              </div>

              <div className="grid gap-4 lg:grid-cols-2">
                <label className="grid gap-2">
                  <span className={labelClassName()}>Titulo</span>
                  <input
                    value={editorState.title}
                    onChange={(event) => updateEditor("title", event.target.value)}
                    className={inputClassName()}
                  />
                </label>

                <label className="grid gap-2">
                  <span className={labelClassName()}>Slug</span>
                  <input
                    value={editorState.slug}
                    readOnly
                    className={inputClassName("cursor-default opacity-80")}
                  />
                </label>

                <label className="grid gap-2 lg:col-span-2">
                  <span className={labelClassName()}>Extracto</span>
                  <textarea
                    value={editorState.excerpt}
                    onChange={(event) => updateEditor("excerpt", event.target.value)}
                    rows={3}
                    className={inputClassName("py-3")}
                  />
                </label>

                <label className="grid gap-2">
                  <span className={labelClassName()}>Estado</span>
                  <select
                    value={editorState.status}
                    onChange={(event) =>
                      updateEditor("status", event.target.value as AdminNewsStatus)
                    }
                    className={inputClassName()}
                  >
                    {adminNewsStatusValues.map((status) => (
                      <option key={status} value={status}>
                        {getAdminNewsStatusLabel(status)}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="grid gap-2">
                  <span className={labelClassName()}>Publicacion</span>
                  <input
                    type="datetime-local"
                    value={editorState.publishedAt}
                    onChange={(event) => updateEditor("publishedAt", event.target.value)}
                    className={inputClassName()}
                  />
                </label>

                <label className="grid gap-2 lg:col-span-2">
                  <span className={labelClassName()}>Video externo</span>
                  <div className="relative">
                    <Video className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[color:var(--rr-muted)]" />
                    <input
                      value={editorState.externalVideoUrl}
                      onChange={(event) =>
                        updateEditor("externalVideoUrl", event.target.value)
                      }
                      placeholder="https://youtube.com/..."
                      className={inputClassName("w-full pl-9")}
                    />
                  </div>
                </label>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={() => updateEditor("featured", !editorState.featured)}
                  className="flex min-h-12 items-center justify-between rounded-[16px] border border-white/10 bg-white/5 px-4 text-left text-[0.92rem] text-white transition hover:border-[rgba(243,203,69,0.26)]"
                >
                  <span>Destacar en portada</span>
                  <Star
                    className={cn(
                      "h-4 w-4",
                      editorState.featured
                        ? "fill-[color:var(--rr-gold)] text-[color:var(--rr-gold)]"
                        : "text-[color:var(--rr-muted)]",
                    )}
                  />
                </button>

                <button
                  type="button"
                  onClick={() =>
                    updateEditor(
                      "status",
                      editorState.status === "PUBLISHED" ? "DRAFT" : "PUBLISHED",
                    )
                  }
                  className="flex min-h-12 items-center justify-between rounded-[16px] border border-white/10 bg-white/5 px-4 text-left text-[0.92rem] text-white transition hover:border-[rgba(243,203,69,0.26)]"
                >
                  <span>
                    {editorState.status === "PUBLISHED"
                      ? "Pasar a borrador"
                      : "Marcar como publicada"}
                  </span>
                  {editorState.status === "PUBLISHED" ? (
                    <Eye className="h-4 w-4 text-[color:var(--rr-gold)]" />
                  ) : (
                    <EyeOff className="h-4 w-4 text-[color:var(--rr-muted)]" />
                  )}
                </button>
              </div>

              <div className="grid gap-4 xl:grid-cols-[24rem_minmax(0,1fr)]">
                <div className="space-y-3">
                  <span className={labelClassName()}>Portada</span>
                  <div className="overflow-hidden rounded-[12px] border border-white/10 bg-[rgba(255,255,255,0.04)]">
                    {editorState.coverUrl ? (
                      <img
                        src={editorState.coverUrl}
                        alt={editorState.coverAltText ?? editorState.title}
                        className="h-48 w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-48 items-center justify-center text-[color:var(--rr-muted)]">
                        <ImagePlus className="h-6 w-6" />
                      </div>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={() => setCoverPickerOpen(true)}
                      className="rr-button rr-button-secondary text-[0.8rem]"
                    >
                      Elegir portada
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setEditorState((currentValue) => ({
                          ...currentValue,
                          coverMediaId: undefined,
                          coverUrl: undefined,
                          coverAltText: undefined,
                        }))
                      }
                      disabled={!editorState.coverUrl}
                      className="rr-button rr-button-secondary text-[0.8rem] disabled:cursor-not-allowed disabled:opacity-45"
                    >
                      Quitar portada
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  <span className={labelClassName()}>Equipos relacionados</span>
                  <div className="grid gap-2 sm:grid-cols-2">
                    <button
                      type="button"
                      onClick={() => updateEditor("relatedTeamIds", [])}
                      className={cn(
                        "flex min-h-12 items-center justify-between rounded-[16px] border px-3 text-left transition",
                        editorState.relatedTeamIds.length === 0
                          ? "border-[rgba(243,203,69,0.34)] bg-[rgba(243,203,69,0.1)] text-white"
                          : "border-white/10 bg-white/4 text-[color:var(--rr-muted)]",
                      )}
                    >
                      <span className="text-[0.86rem]">{ADMIN_NEWS_GENERAL_TEAM_LABEL}</span>
                      {editorState.relatedTeamIds.length === 0 ? (
                        <Check className="h-4 w-4 text-[color:var(--rr-gold)]" />
                      ) : null}
                    </button>
                    {screenData.teamOptions.map((team) => {
                      const active = editorState.relatedTeamIds.includes(team.id);

                      return (
                        <button
                          key={team.id}
                          type="button"
                          onClick={() => toggleRelatedTeam(team.id)}
                          className={cn(
                            "flex min-h-12 items-center justify-between rounded-[16px] border px-3 text-left transition",
                            active
                              ? "border-[rgba(243,203,69,0.34)] bg-[rgba(243,203,69,0.1)] text-white"
                              : "border-white/10 bg-white/4 text-[color:var(--rr-muted)]",
                          )}
                        >
                          <span className="text-[0.86rem]">{formatTeamOptionLabel(team)}</span>
                          {active ? <Check className="h-4 w-4 text-[color:var(--rr-gold)]" /> : null}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              <label className="grid gap-2">
                <span className={labelClassName()}>Contenido</span>
                <textarea
                  value={editorState.bodyMarkdown}
                  onChange={(event) => updateEditor("bodyMarkdown", event.target.value)}
                  rows={16}
                  className={inputClassName("py-3 font-mono text-[0.88rem] leading-6")}
                  placeholder={"Parrafos separados por linea en blanco\n## Titulo interno\n> Cita destacada\n[Referencia](https://...)"}
                />
                <span className="text-[0.78rem] leading-5 text-[color:var(--rr-muted)]">
                  Formato seguro: parrafos, titulos, citas y enlaces http/https. Sin HTML.
                </span>
              </label>
            </div>
          </AdminPanel>
        </div>
      </div>

      <MediaPickerDialog
        open={coverPickerOpen}
        title="Elegir portada de noticia"
        description="Selecciona una imagen ya subida en la biblioteca real de media."
        items={coverMediaOptions}
        allowedUsages={["NEWS_COVER"]}
        selectedMediaId={editorState.coverMediaId}
        onClose={() => setCoverPickerOpen(false)}
        onSelect={(item) => {
          setEditorState((currentValue) => ({
            ...currentValue,
            coverMediaId: item.id,
            coverUrl: item.publicUrl,
            coverAltText: item.altText,
          }));
          setCoverPickerOpen(false);
        }}
      />
    </div>
  );
}

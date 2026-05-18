"use client";

type LoadMoreNewsButtonProps = {
  disabled?: boolean;
  onClick: () => void;
};

export function LoadMoreNewsButton({ disabled = false, onClick }: LoadMoreNewsButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="rr-button rr-button-secondary min-w-[220px] justify-center disabled:cursor-default disabled:opacity-45"
    >
      Cargar mas noticias
    </button>
  );
}

import { AdminStatusBadge } from "@/src/components/admin/admin-status-badge";

type AdminDataTableColumn = {
  key: string;
  label: string;
};

type AdminDataTableRow = {
  id: string;
  [key: string]: string | boolean | number;
};

type AdminDataTableProps = {
  columns: AdminDataTableColumn[];
  rows: AdminDataTableRow[];
};

export function AdminDataTable({ columns, rows }: AdminDataTableProps) {
  function formatValue(value: string | boolean | number) {
    if (typeof value === "boolean") {
      return value ? "Si" : "No";
    }

    return `${value}`;
  }

  function shouldUseBadge(columnKey: string, value: string) {
    return (
      ["status", "estado", "visible", "active", "access", "featured"].includes(columnKey) ||
      ["si", "no", "activo", "publicada", "borrador", "pendiente", "aplicado", "validado"].includes(
        value.toLowerCase(),
      )
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-3 md:hidden">
        {rows.map((row) => (
          <article
            key={row.id}
            className="rounded-[20px] border border-[var(--rr-border)] bg-[rgba(16,35,61,0.86)] p-4"
          >
            <div className="space-y-3">
              {columns.map((column, index) => {
                const rawValue = row[column.key];
                const value = formatValue(rawValue);

                return (
                  <div
                    key={column.key}
                    className={index === 0 ? "border-b border-[var(--rr-border)] pb-3" : "flex items-start justify-between gap-4"}
                  >
                    {index === 0 ? (
                      <>
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--rr-text-soft)]">
                          {column.label}
                        </p>
                        <p className="mt-2 font-display text-3xl uppercase text-white">{value}</p>
                      </>
                    ) : (
                      <>
                        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--rr-text-soft)]">
                          {column.label}
                        </p>
                        <div className="shrink-0 text-right text-sm text-[var(--rr-text-muted)]">
                          {shouldUseBadge(column.key, value) ? <AdminStatusBadge value={value} /> : value}
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </article>
        ))}
      </div>

      <div className="hidden overflow-x-auto md:block">
        <table className="min-w-full border-separate border-spacing-y-3">
          <thead>
            <tr className="text-left text-xs font-semibold uppercase tracking-[0.18em] text-[var(--rr-text-soft)]">
              {columns.map((column) => (
                <th key={column.key} className="px-3 py-2">
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr
                key={row.id}
                className="rounded-[18px] bg-[rgba(38,58,89,0.9)] text-sm text-[var(--rr-text-muted)]"
              >
                {columns.map((column, index) => {
                  const value = formatValue(row[column.key]);
                  const isFirst = index === 0;
                  const isLast = index === columns.length - 1;

                  return (
                    <td
                      key={column.key}
                      className={`px-3 py-4 ${isFirst ? "rounded-l-[18px]" : ""} ${isLast ? "rounded-r-[18px]" : ""}`}
                    >
                      {shouldUseBadge(column.key, value) ? <AdminStatusBadge value={value} /> : value}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

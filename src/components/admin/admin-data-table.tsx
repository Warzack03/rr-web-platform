type AdminDataTableColumn = {
  key: string;
  label: string;
};

type AdminDataTableRow = {
  id: string;
  [key: string]: string | boolean;
};

type AdminDataTableProps = {
  columns: AdminDataTableColumn[];
  rows: AdminDataTableRow[];
};

export function AdminDataTable({ columns, rows }: AdminDataTableProps) {
  return (
    <div className="overflow-x-auto">
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
            <tr key={row.id} className="rounded-[18px] bg-[rgba(38,58,89,0.9)] text-sm text-[var(--rr-text-muted)]">
              {columns.map((column, index) => {
                const value = row[column.key];
                const isFirst = index === 0;
                const isLast = index === columns.length - 1;

                return (
                  <td
                    key={column.key}
                    className={`px-3 py-4 ${isFirst ? "rounded-l-[18px]" : ""} ${isLast ? "rounded-r-[18px]" : ""}`}
                  >
                    {typeof value === "boolean" ? (value ? "Si" : "No") : value}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

import type { ReactNode } from "react";
import { AdminPanel } from "@/components/admin/admin-panel";
import { cn } from "@/lib/utils";

type AdminTableColumn = {
  key: string;
  label: string;
  className?: string;
};

type AdminTableProps = {
  columns: AdminTableColumn[];
  rows: Array<Record<string, ReactNode>>;
  className?: string;
};

export function AdminTable({ columns, rows, className }: AdminTableProps) {
  return (
    <AdminPanel className={cn("hidden overflow-hidden lg:block", className)}>
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse">
          <thead>
            <tr className="border-b border-[color:var(--rr-border)] bg-[rgba(255,255,255,0.03)]">
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={cn(
                    "px-4 py-3 text-left font-[var(--rr-font-body)] text-[0.82rem] font-bold uppercase tracking-[0.18em] text-[color:var(--rr-muted)]",
                    column.className,
                  )}
                >
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rowIndex) => (
              <tr
                key={`row-${rowIndex}`}
                className="border-b border-[rgba(255,255,255,0.06)] last:border-b-0 hover:bg-[rgba(255,255,255,0.03)]"
              >
                {columns.map((column) => (
                  <td
                    key={column.key}
                    className={cn("px-4 py-4 align-top text-[0.98rem] text-[color:var(--rr-text)]", column.className)}
                  >
                    {row[column.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminPanel>
  );
}

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
  caption?: string;
  className?: string;
};

export function AdminTable({ columns, rows, caption = "Listado de administracion", className }: AdminTableProps) {
  return (
    <AdminPanel className={cn("hidden overflow-hidden lg:block", className)}>
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse">
          <caption className="sr-only">{caption}</caption>
          <thead>
            <tr className="border-b border-[color:var(--rr-border)] bg-[rgba(255,255,255,0.045)]">
              {columns.map((column) => (
                <th
                  key={column.key}
                  scope="col"
                  className={cn(
                    "px-5 py-3.5 text-left font-[var(--rr-font-body)] text-[0.8rem] font-bold text-[color:var(--rr-muted)]",
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
                className="border-b border-[rgba(255,255,255,0.07)] transition last:border-b-0 hover:bg-[rgba(255,255,255,0.04)]"
              >
                {columns.map((column) => (
                  <td
                    key={column.key}
                    className={cn("px-5 py-4.5 align-top text-[0.95rem] leading-6 text-[color:var(--rr-text)]", column.className)}
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

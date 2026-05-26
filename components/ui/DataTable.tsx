"use client";

import { useState, useMemo } from "react";
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export interface DataTableColumn<T> {
  id: string;
  header: string;
  accessor?: keyof T;
  cell?: (row: T) => React.ReactNode;
  sortable?: boolean;
  className?: string;
  headerClassName?: string;
}

interface DataTableProps<T extends Record<string, unknown>> {
  columns: DataTableColumn<T>[];
  data: T[];
  onRowClick?: (row: T) => void;
  isLoading?: boolean;
  skeletonRows?: number;
  emptyMessage?: string;
  getRowId?: (row: T) => string;
}

type SortDir = "asc" | "desc";

export function DataTable<T extends Record<string, unknown>>({
  columns,
  data,
  onRowClick,
  isLoading = false,
  skeletonRows = 5,
  emptyMessage = "No data found",
  getRowId,
}: DataTableProps<T>) {
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<SortDir>("asc");

  const sortedData = useMemo(() => {
    if (!sortKey) return data;
    const col = columns.find((c) => c.id === sortKey);
    if (!col?.accessor) return data;

    const key = col.accessor;
    return [...data].sort((a, b) => {
      const av = a[key];
      const bv = b[key];
      if (av == null && bv == null) return 0;
      if (av == null) return 1;
      if (bv == null) return -1;
      if (typeof av === "number" && typeof bv === "number") {
        return sortDir === "asc" ? av - bv : bv - av;
      }
      const as = String(av).toLowerCase();
      const bs = String(bv).toLowerCase();
      if (as < bs) return sortDir === "asc" ? -1 : 1;
      if (as > bs) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
  }, [columns, data, sortDir, sortKey]);

  const toggleSort = (col: DataTableColumn<T>) => {
    if (!col.sortable) return;
    if (sortKey === col.id) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(col.id);
      setSortDir("asc");
    }
  };

  const SortIcon = ({ col }: { col: DataTableColumn<T> }) => {
    if (!col.sortable) return null;
    if (sortKey !== col.id) {
      return <ArrowUpDown className="ml-1 inline h-3.5 w-3.5 text-slate-400" />;
    }
    return sortDir === "asc" ? (
      <ArrowUp className="ml-1 inline h-3.5 w-3.5 text-brand" />
    ) : (
      <ArrowDown className="ml-1 inline h-3.5 w-3.5 text-brand" />
    );
  };

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((col) => (
              <TableHead
                key={col.id}
                className={cn(
                  col.sortable && "cursor-pointer select-none",
                  col.headerClassName
                )}
                onClick={() => toggleSort(col)}
              >
                {col.header}
                <SortIcon col={col} />
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading &&
            Array.from({ length: skeletonRows }).map((_, i) => (
              <TableRow key={`sk-${i}`} className="pointer-events-none">
                {columns.map((col, colIndex) => (
                  <TableCell key={col.id}>
                    <Skeleton
                      className={cn(
                        "h-5",
                        colIndex === 0
                          ? "w-[85%]"
                          : colIndex === columns.length - 1
                            ? "ml-auto w-16"
                            : colIndex % 2 === 0
                              ? "w-3/4"
                              : "w-1/2"
                      )}
                    />
                  </TableCell>
                ))}
              </TableRow>
            ))}

          {!isLoading && sortedData.length === 0 && (
            <TableRow>
              <TableCell
                colSpan={columns.length}
                className="py-12 text-center text-slate-500"
              >
                {emptyMessage}
              </TableCell>
            </TableRow>
          )}

          {!isLoading &&
            sortedData.map((row, index) => {
              const id = getRowId?.(row) ?? String(index);
              return (
                <TableRow
                  key={id}
                  onClick={() => onRowClick?.(row)}
                  className={cn(onRowClick && "cursor-pointer hover:bg-slate-50")}
                >
                  {columns.map((col) => (
                    <TableCell key={col.id} className={col.className}>
                      {col.cell
                        ? col.cell(row)
                        : col.accessor
                          ? String(row[col.accessor] ?? "—")
                          : "—"}
                    </TableCell>
                  ))}
                </TableRow>
              );
            })}
        </TableBody>
      </Table>
    </div>
  );
}

import React from "react";
import { Button } from "@components/ui/button";
import { CardContent } from "@components/ui/card";
import { Skeleton } from "@components/ui/skeleton";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@components/ui/table";
import { Trash2 } from "lucide-react";
import { useTranslation } from "@lib/translation/useTranslation";

const BondList = ({
  bonds,
  bondLoading,
  handleDeleteBond,
  page,
  pageSize,
  total,
  onPageChange,
  onPageSizeChange,
  sortBy,
  order,
  onSortChange,
}) => {
  const { t } = useTranslation();
  // Small up/down icon for sorting
  const SortIcon = ({ order }) => (
    <span className="inline-block ml-1 align-middle text-xs">
      {order === "asc" ? "▲" : "▼"}
    </span>
  );

  // Pagination logic (pretty)
  const totalPages = Math.ceil(total / pageSize);
  let pageNumbers = [];
  if (totalPages <= 10) {
    pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);
  } else {
    if (page <= 4) {
      pageNumbers = [1, 2, 3, 4, 5, '...', totalPages - 2, totalPages - 1, totalPages];
    } else if (page >= totalPages - 3) {
      pageNumbers = [1, 2, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    } else {
      pageNumbers = [1, '...', page - 1, page, page + 1, '...', totalPages];
    }
  }

  return (
    <CardContent>
      {/* Top controls */}
      <div className="flex justify-between items-center mb-2">
        <div className="font-semibold text-gray-700">
          {t("total_bond")}: {total}
        </div>
        <div className="flex gap-2 items-center">
          <label className="font-medium">{t("show")}:</label>
          <select
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            className="border rounded px-2 py-1"
          >
            {[10, 50, 100, 250, 500, total].map((size) => (
              <option key={size} value={size}>
                {size === total ? t("show_all") : t(size)}
              </option>
            ))}
          </select>
        </div>
      </div>
      {/* Table */}
      <div className="overflow-auto max-h-[500px]">
        <Table className="min-w-full bg-white rounded-lg shadow border">
          <TableHeader className="bg-gray-100">
            <TableRow>
              <TableHead className="px-4 py-2 text-left">{t("serial_no")}</TableHead>
              <TableHead className="px-4 py-2 text-left">{t("bond_number")}</TableHead>
              <TableHead
                className="px-2 py-1 text-left cursor-pointer select-none hover:text-blue-900"
                onClick={() => onSortChange("created_at", order === "asc" ? "desc" : "asc")}
              >
                {t("date")}
                <SortIcon order={sortBy === "created_at" ? order : "desc"} />
              </TableHead>
              <TableHead className="px-4 py-2 text-center">{t("option")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bondLoading ? (
              // Show skeleton rows for loading
              Array.from({ length: pageSize }).map((_, idx) => (
                <TableRow key={`skeleton-${idx}`}>
                  <TableCell className="px-4 py-2"><Skeleton className="h-4 w-10" /></TableCell>
                  <TableCell className="px-4 py-2"><Skeleton className="h-4 w-24" /></TableCell>
                  <TableCell className="px-4 py-2"><Skeleton className="h-4 w-20" /></TableCell>
                  <TableCell className="px-4 py-2 text-center"><Skeleton className="h-8 w-8 mx-auto" /></TableCell>
                </TableRow>
              ))
            ) : !bonds.length ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-gray-500 py-6">
                  {t("no_bonds")}
                </TableCell>
              </TableRow>
            ) : (
              bonds.map((bond, idx) => (
                <TableRow key={bond.id} className="hover:bg-gray-50 transition">
                  <TableCell className="px-4 py-2 font-semibold">
                    {(page - 1) * pageSize + idx + 1}
                  </TableCell>
                  <TableCell className="px-4 py-2">{bond.bond_number}</TableCell>
                  <TableCell className="px-4 py-2">
                    {new Date(bond.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="px-4 py-2 text-center">
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteBond(bond.id)}
                      className="cursor-pointer"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="w-full flex justify-center items-center mt-6">
          <div className="flex w-full max-w-xl mx-auto justify-between items-center gap-2 px-2 py-2 bg-gray-50 rounded-lg border flex-wrap sm:flex-nowrap">
            <button
              className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300"
              disabled={page === 1}
              onClick={() => onPageChange(page - 1)}
            >{t("prev")}</button>
            <div className="flex gap-1 flex-wrap justify-center items-center w-full sm:w-auto">
              {pageNumbers.map((num, idx) =>
                num === '...'
                  ? <span key={`ellipsis-${idx}`} className="px-2 text-gray-400">...</span>
                  : <button
                      key={`page-${num}`}
                      className={`px-3 py-0.5 rounded font-bold ${num === page ? 'bg-blue-800 text-white' : 'bg-gray-100 hover:bg-blue-100'}`}
                      onClick={() => onPageChange(num)}
                    >{num}</button>
              )}
            </div>
            <button
              className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300"
              disabled={page === totalPages}
              onClick={() => onPageChange(page + 1)}
            >{t("next")}</button>
          </div>
        </div>
      )}
    </CardContent>
  );
};

export default BondList;

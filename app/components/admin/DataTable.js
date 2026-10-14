import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function DataTable({
  columns,
  data,
  loading,
  pagination,
  onPageChange,
  selection = {
    selectedItems: [],
    onSelectAll: () => {},
    onSelectItem: () => {},
  },
  onRowClick,
}) {
  const { selectedItems, onSelectAll, onSelectItem } = selection;
  const isAllSelected = data.length > 0 && selectedItems.length === data.length;

  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50/50">
            <tr>
              <th
                scope="col"
                className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-10"
              >
                <input
                  type="checkbox"
                  checked={isAllSelected}
                  onChange={onSelectAll}
                  className="rounded border-gray-300 text-brand-primary focus:ring-brand-primary h-4 w-4 cursor-pointer"
                />
              </th>
              {columns.map((col, index) => (
                <th
                  key={index}
                  scope="col"
                  className={`px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider ${col.className || ""}`}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td
                  colSpan={columns.length + 1}
                  className="px-6 py-12 text-center text-gray-500"
                >
                  <div className="flex justify-center items-center gap-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-75"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150"></div>
                  </div>
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + 1}
                  className="px-6 py-12 text-center text-gray-500"
                >
                  No records found.
                </td>
              </tr>
            ) : (
              data.map((row) => (
                <tr
                  key={row._id}
                  onClick={() => onRowClick && onRowClick(row)}
                  className={`hover:bg-gray-50/80 transition-colors ${
                    selectedItems.includes(row._id) ? "bg-brand-primary/5" : ""
                  }`}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(row._id)}
                      onChange={(e) => {
                        e.stopPropagation();
                        onSelectItem(row._id);
                      }}
                      className="rounded border-gray-300 text-brand-primary focus:ring-brand-primary h-4 w-4 cursor-pointer"
                    />
                  </td>
                  {columns.map((col, index) => (
                    <td
                      key={index}
                      className={`px-6 py-4 ${col.className || ""}`}
                    >
                      {col.render ? col.render(row) : row[col.accessor]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination && (
        <div className="flex items-center justify-between border-t border-gray-200 bg-gray-50 px-4 py-3 sm:px-6">
          <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing{" "}
                <span className="font-medium">
                  {(pagination.page - 1) * pagination.limit + 1}
                </span>{" "}
                to{" "}
                <span className="font-medium">
                  {Math.min(
                    pagination.page * pagination.limit,
                    pagination.total,
                  )}
                </span>{" "}
                of <span className="font-medium">{pagination.total}</span>{" "}
                results
              </p>
            </div>
            <div>
              <nav
                className="isolate inline-flex -space-x-px rounded-md shadow-sm"
                aria-label="Pagination"
              >
                <button
                  onClick={() => onPageChange(Math.max(1, pagination.page - 1))}
                  disabled={pagination.page === 1}
                  className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed bg-white"
                >
                  <span className="sr-only">Previous</span>
                  <ChevronLeft className="h-5 w-5" aria-hidden="true" />
                </button>
                <span className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 focus:outline-offset-0 bg-white">
                  {pagination.page}
                </span>
                <button
                  onClick={() =>
                    onPageChange(
                      Math.min(pagination.totalPages, pagination.page + 1),
                    )
                  }
                  disabled={pagination.page >= pagination.totalPages}
                  className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed bg-white"
                >
                  <span className="sr-only">Next</span>
                  <ChevronRight className="h-5 w-5" aria-hidden="true" />
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

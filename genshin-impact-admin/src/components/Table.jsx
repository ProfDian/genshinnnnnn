import React from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

const Table = ({ columns, data, pagination, onPageChange, isLoading }) => {
  // Handle empty data state
  if (!isLoading && (!data || data.length === 0)) {
    return (
      <div className="bg-white rounded-md p-8 text-center text-gray-500">
        No data available
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-200">
            {columns.map((column) => (
              <th
                key={column.key}
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                style={{ width: column.width }}
              >
                {column.title}
                {column.sortable && (
                  <span className="ml-1 cursor-pointer">↕</span>
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {isLoading
            ? // Loading state rows
              Array(5)
                .fill(0)
                .map((_, index) => (
                  <tr
                    key={`loader-${index}`}
                    className="border-b border-gray-200"
                  >
                    {columns.map((column) => (
                      <td
                        key={`loader-cell-${column.key}-${index}`}
                        className="px-4 py-3"
                      >
                        <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                      </td>
                    ))}
                  </tr>
                ))
            : // Data rows
              data.map((item, index) => (
                <tr
                  key={item.id || index}
                  className={`border-b border-gray-200 hover:bg-gray-50 ${
                    index % 2 === 0 ? "bg-white" : "bg-gray-50"
                  }`}
                >
                  {columns.map((column) => (
                    <td key={`${item.id}-${column.key}`} className="px-4 py-3">
                      {column.render
                        ? column.render(item)
                        : item[column.key] || "-"}
                    </td>
                  ))}
                </tr>
              ))}
        </tbody>
      </table>

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex justify-between items-center px-4 py-3 bg-white border-t border-gray-200 sm:px-6">
          <div className="hidden sm:block">
            <p className="text-sm text-gray-700">
              Showing{" "}
              <span className="font-medium">
                {(pagination.currentPage - 1) * 10 + 1}
              </span>{" "}
              to{" "}
              <span className="font-medium">
                {Math.min(pagination.currentPage * 10, pagination.totalItems)}
              </span>{" "}
              of <span className="font-medium">{pagination.totalItems}</span>{" "}
              results
            </p>
          </div>
          <div className="flex justify-between sm:justify-end items-center">
            <button
              onClick={() => onPageChange(pagination.currentPage - 1)}
              disabled={pagination.currentPage === 1}
              className={`relative inline-flex items-center px-3 py-2 rounded-md text-sm font-medium mr-2 ${
                pagination.currentPage === 1
                  ? "text-gray-300 cursor-not-allowed"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              <FiChevronLeft className="w-4 h-4 mr-1" />
              Previous
            </button>
            <button
              onClick={() => onPageChange(pagination.currentPage + 1)}
              disabled={pagination.currentPage === pagination.totalPages}
              className={`relative inline-flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                pagination.currentPage === pagination.totalPages
                  ? "text-gray-300 cursor-not-allowed"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              Next
              <FiChevronRight className="w-4 h-4 ml-1" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Table;

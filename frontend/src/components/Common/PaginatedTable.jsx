import {
  ArrowUp,
  ArrowDown,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react';
import { useState } from 'react';

const PaginatedTable = ({
  data = [],
  columns = [],
  renderRow,
  // itemsPerPage = 10,
  sortConfig = {},
  onSortChange = () => {},
  noDataMessage = null,
}) => {
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(data.length / itemsPerPage);
  const startIdx = (currentPage - 1) * itemsPerPage;
  const currentData = data.slice(startIdx, startIdx + itemsPerPage);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  const handleSort = (key) => {
    setCurrentPage(1);
    if (!key) return;
    if (sortConfig.key === key) {
      onSortChange({ key, asc: !sortConfig.asc });
    } else {
      onSortChange({ key, asc: true });
    }
  };

  const renderSortIcon = (key) => {
    if (sortConfig.key !== key) return <ArrowUpDown className="w-4 h-4 text-base-content/40" />;
    return sortConfig.asc ? (
      <ArrowUp className="w-4 h-4 text-primary" />
    ) : (
      <ArrowDown className="w-4 h-4 text-primary" />
    );
  };

  // Generate page numbers with ellipsis for large page counts
  const generatePageNumbers = () => {
    const maxVisiblePages = 5;
    const pages = [];

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      }
    }

    return pages;
  };

  const pageNumbers = generatePageNumbers();

  return (
    <div className="w-full">
      {/* Table Info */}
      {data.length > 0 && (
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-4">
          <div className="text-sm text-base-content/70">
            Showing <span className="font-medium">{startIdx + 1}</span> to{' '}
            <span className="font-medium">{Math.min(startIdx + itemsPerPage, data.length)}</span> of{' '}
            <span className="font-medium">{data.length}</span> results
          </div>
          {totalPages > 1 && (
            <div className="text-sm text-base-content/70">
              Page <span className="font-medium">{currentPage}</span> of{' '}
              <span className="font-medium">{totalPages}</span>
            </div>
          )}
        </div>
      )}

      {/* Table Container */}
      <div className="bg-base-100 rounded-lg border border-base-300 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead className="bg-base-200">
              <tr>
                {columns.map((col, idx) => (
                  <th
                    key={idx}
                    onClick={() => col.sortKey && handleSort(col.sortKey)}
                    className={`
                      py-4 px-6 text-left font-semibold text-base-content/90 border-b border-base-300
                      ${
                        col.sortKey
                          ? 'cursor-pointer select-none hover:bg-base-300/50 transition-colors'
                          : ''
                      }
                    `}
                  >
                    <div className="flex items-center gap-2 justify-center">
                      <span>{col.label}</span>
                      {col.sortKey && (
                        <div className="transition-transform hover:scale-110">
                          {renderSortIcon(col.sortKey)}
                        </div>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {currentData.length > 0
                ? currentData.map((item, index) => renderRow(item, startIdx + index))
                : noDataMessage || (
                    <tr>
                      <td colSpan={columns.length} className="text-center py-12">
                        <div className="space-y-2">
                          <div className="text-4xl text-base-content/20">📄</div>
                          <p className="text-lg text-base-content/70">No data available</p>
                          <p className="text-sm text-base-content/50">
                            There are no items to display at the moment.
                          </p>
                        </div>
                      </td>
                    </tr>
                  )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Enhanced Pagination */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
          {/* Items per page selector */}
          <div className="flex items-center gap-2 text-sm text-base-content/70">
            <span className="text-nowrap">Items per page:</span>
            <select
              className="select select-sm select-bordered"
              value={itemsPerPage}
              onChange={(e) => {
                // This would need to be handled by parent component
                // console.log('Items per page changed:', e.target.value);
                setItemsPerPage(parseInt(e.target.value));
                setCurrentPage(1);
              }}
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
          </div>

          {/* Pagination Controls */}
          <div className="flex items-center gap-1">
            {/* First Page */}
            <button
              className="btn btn-sm btn-ghost"
              onClick={() => handlePageChange(1)}
              disabled={currentPage === 1}
              title="First page"
            >
              <ChevronsLeft className="w-4 h-4" />
            </button>

            {/* Previous Page */}
            <button
              className="btn btn-sm btn-ghost"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              title="Previous page"
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Previous</span>
            </button>

            {/* Page Numbers */}
            <div className="flex items-center gap-1 mx-2">
              {pageNumbers.map((page, idx) => (
                <button
                  key={idx}
                  className={`
                    btn btn-sm
                    ${
                      page === currentPage
                        ? 'btn-primary'
                        : page === '...'
                        ? 'btn-ghost cursor-default'
                        : 'btn-ghost hover:btn-primary hover:btn-outline'
                    }
                  `}
                  onClick={() => typeof page === 'number' && handlePageChange(page)}
                  disabled={page === '...'}
                >
                  {page}
                </button>
              ))}
            </div>

            {/* Next Page */}
            <button
              className="btn btn-sm btn-ghost"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              title="Next page"
            >
              <span className="hidden sm:inline">Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>

            {/* Last Page */}
            <button
              className="btn btn-sm btn-ghost"
              onClick={() => handlePageChange(totalPages)}
              disabled={currentPage === totalPages}
              title="Last page"
            >
              <ChevronsRight className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Jump */}
          <div className="flex items-center gap-2 text-sm">
            <span className="text-base-content/70">Go to:</span>
            <input
              type="number"
              min="1"
              max={totalPages}
              className="input input-sm input-bordered w-16 text-center"
              placeholder={currentPage.toString()}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  const page = parseInt(e.target.value);
                  if (page && page >= 1 && page <= totalPages) {
                    handlePageChange(page);
                    e.target.value = '';
                  }
                }
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default PaginatedTable;

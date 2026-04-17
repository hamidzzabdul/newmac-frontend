interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) => {
  const safeCurrentPage = Number.isFinite(currentPage) ? currentPage : 1;
  const safeTotalPages = Number.isFinite(totalPages) ? totalPages : 1;

  const getPageNumbers = (): (number | string)[] => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (safeTotalPages <= maxVisible) {
      for (let i = 1; i <= safeTotalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      if (safeCurrentPage > 3) {
        pages.push("...");
      }

      const start = Math.max(2, safeCurrentPage - 1);
      const end = Math.min(safeTotalPages - 1, safeCurrentPage + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (safeCurrentPage < safeTotalPages - 2) {
        pages.push("...");
      }

      pages.push(safeTotalPages);
    }

    return pages;
  };

  if (safeTotalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-2 mt-12 mb-8">
      <button
        type="button"
        onClick={() => onPageChange(Math.max(1, safeCurrentPage - 1))}
        disabled={safeCurrentPage === 1}
        className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        aria-label="Previous page"
      >
        Prev
      </button>

      <div className="flex items-center gap-2">
        {getPageNumbers().map((page, index) => {
          if (page === "...") {
            return (
              <span
                key={`ellipsis-${index}`}
                className="px-3 py-2 text-gray-500"
              >
                ...
              </span>
            );
          }

          return (
            <button
              type="button"
              key={`page-${page}-${index}`}
              onClick={() => onPageChange(Number(page))}
              className={`min-w-10 px-4 py-2 rounded-lg font-medium transition-colors ${
                safeCurrentPage === page
                  ? "bg-black text-white"
                  : "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              {page}
            </button>
          );
        })}
      </div>

      <button
        type="button"
        onClick={() =>
          onPageChange(Math.min(safeTotalPages, safeCurrentPage + 1))
        }
        disabled={safeCurrentPage === safeTotalPages}
        className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        aria-label="Next page"
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;

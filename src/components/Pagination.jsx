import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import Button from './Button';

function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      onPageChange(page);
    }
  };

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 pt-4">
      <p className="text-sm text-gray-600">
        Page <span className="font-semibold text-primary">{currentPage}</span> of{' '}
        <span className="font-semibold text-primary">{totalPages}</span>
      </p>

      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          size="sm"
          onClick={() => goToPage(currentPage - 1)}
          disabled={currentPage === 1}
          icon={FiChevronLeft}
        >
          Prev
        </Button>

        {pages.map((page) => (
          <button
            key={page}
            type="button"
            onClick={() => goToPage(page)}
            className={`min-w-9 rounded-lg px-3 py-1.5 text-sm font-medium transition ${
              page === currentPage
                ? 'bg-primary text-white'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            {page}
          </button>
        ))}

        <Button
          variant="outline"
          size="sm"
          onClick={() => goToPage(currentPage + 1)}
          disabled={currentPage === totalPages}
          icon={FiChevronRight}
        >
          Next
        </Button>
      </div>
    </div>
  );
}

export default Pagination;

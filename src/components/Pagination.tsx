import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  baseUrl: string;
  searchParams?: string;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  baseUrl,
  searchParams = '',
}) => {
  // Don't show pagination if there's only one page
  if (totalPages <= 1) return null;

  const getPageUrl = (page: number) => {
    const queryChar = baseUrl.includes('?') ? '&' : '?';
    const pageParam = `page=${page}`;
    const fullUrl = `${baseUrl}${queryChar}${pageParam}${searchParams ? `&${searchParams}` : ''}`;
    return fullUrl;
  };

  // Calculate which page numbers to show
  const getPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 5;
    
    // Always include first page
    pages.push(1);
    
    // Calculate start and end of page range around current page
    let rangeStart = Math.max(2, currentPage - Math.floor(maxPagesToShow / 2));
    let rangeEnd = Math.min(totalPages - 1, rangeStart + maxPagesToShow - 2);
    
    // Adjust range if we're near the end
    if (rangeEnd - rangeStart < maxPagesToShow - 2) {
      rangeStart = Math.max(2, rangeEnd - (maxPagesToShow - 2));
    }
    
    // Add ellipsis after first page if needed
    if (rangeStart > 2) {
      pages.push(-1); // -1 represents ellipsis
    }
    
    // Add pages in range
    for (let i = rangeStart; i <= rangeEnd; i++) {
      pages.push(i);
    }
    
    // Add ellipsis before last page if needed
    if (rangeEnd < totalPages - 1) {
      pages.push(-2); // -2 represents ellipsis (using different value for React key)
    }
    
    // Always include last page if there are more than one page
    if (totalPages > 1) {
      pages.push(totalPages);
    }
    
    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <nav className="flex items-center justify-center mt-8" aria-label="Pagination">
      <ul className="flex items-center space-x-1">
        {/* Previous Page */}
        <li>
          {currentPage > 1 ? (
            <Link
              to={getPageUrl(currentPage - 1)}
              className="flex items-center px-3 py-2 text-sm font-medium text-gray-500 bg-white rounded-md hover:bg-gray-50"
              onClick={(e) => {
                e.preventDefault();
                onPageChange(currentPage - 1);
              }}
              aria-label="Previous page"
              rel="prev"
            >
              <ChevronLeft size={16} />
              <span className="hidden sm:inline-block ml-1">Previous</span>
            </Link>
          ) : (
            <span className="flex items-center px-3 py-2 text-sm font-medium text-gray-300 bg-white rounded-md cursor-not-allowed">
              <ChevronLeft size={16} />
              <span className="hidden sm:inline-block ml-1">Previous</span>
            </span>
          )}
        </li>

        {/* Page Numbers */}
        {pageNumbers.map((page) => {
          // Render ellipsis
          if (page < 0) {
            return (
              <li key={page}>
                <span className="px-3 py-2 text-sm text-gray-500">...</span>
              </li>
            );
          }

          // Render page number
          return (
            <li key={page}>
              {page === currentPage ? (
                <span className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md">
                  {page}
                </span>
              ) : (
                <Link
                  to={getPageUrl(page)}
                  className="px-4 py-2 text-sm font-medium text-gray-500 bg-white rounded-md hover:bg-gray-50"
                  onClick={(e) => {
                    e.preventDefault();
                    onPageChange(page);
                  }}
                  aria-label={`Page ${page}`}
                >
                  {page}
                </Link>
              )}
            </li>
          );
        })}

        {/* Next Page */}
        <li>
          {currentPage < totalPages ? (
            <Link
              to={getPageUrl(currentPage + 1)}
              className="flex items-center px-3 py-2 text-sm font-medium text-gray-500 bg-white rounded-md hover:bg-gray-50"
              onClick={(e) => {
                e.preventDefault();
                onPageChange(currentPage + 1);
              }}
              aria-label="Next page"
              rel="next"
            >
              <span className="hidden sm:inline-block mr-1">Next</span>
              <ChevronRight size={16} />
            </Link>
          ) : (
            <span className="flex items-center px-3 py-2 text-sm font-medium text-gray-300 bg-white rounded-md cursor-not-allowed">
              <span className="hidden sm:inline-block mr-1">Next</span>
              <ChevronRight size={16} />
            </span>
          )}
        </li>
      </ul>
    </nav>
  );
};

export default Pagination;
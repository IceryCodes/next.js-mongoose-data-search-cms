import { ReactElement, useMemo } from 'react';

import { Button } from './buttons/Button';

interface PaginationProps {
  totalPages: number;
  currentPage: number;
  maxButtons?: number;
  onPageChange: (page: number) => void;
}

const Pagination = ({ totalPages, currentPage, maxButtons = 5, onPageChange }: PaginationProps): ReactElement => {
  const pageButtons = useMemo((): (number | null)[] => {
    const pages: (number | null)[] = [];

    if (totalPages < 1) return pages;

    pages.push(1); // Always include the first page

    const halfMax = Math.floor(maxButtons / 2);
    let startPage = Math.max(2, currentPage - halfMax);
    let endPage = Math.min(totalPages - 1, currentPage + halfMax);

    // Adjust start and end pages to show the max number of buttons
    if (endPage - startPage < maxButtons - 2) {
      if (startPage === 2) {
        endPage = Math.min(startPage + (maxButtons - 2), totalPages - 1);
      } else if (endPage === totalPages - 1) {
        startPage = Math.max(2, endPage - (maxButtons - 2));
      }
    }

    if (startPage > 2) pages.push(null); // Add ellipsis if there are skipped pages
    for (let i = startPage; i <= endPage; i++) pages.push(i); // Add page numbers
    if (endPage < totalPages - 1) pages.push(null); // Add ellipsis at the end if necessary
    if (totalPages > 1) pages.push(totalPages); // Always include the last page

    return pages;
  }, [totalPages, currentPage, maxButtons]);

  return (
    <div className="flex items-center justify-center my-4 px-2 gap-x-2 whitespace-nowrap">
      <Button
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded hover:bg-blue-600 disabled:bg-gray-300"
        element={<>前一頁</>}
      />

      <div className="overflow-x-auto whitespace-nowrap">
        <div className="inline-flex gap-x-2">
          {pageButtons.map((page, index) =>
            typeof page === 'number' ? (
              <Button
                key={index}
                onClick={() => onPageChange(page)}
                className={`px-4 py-2 text-sm font-medium ${currentPage === page ? 'bg-blue-500 text-white' : 'bg-gray-200'} rounded`}
                element={<>{page}</>}
              />
            ) : (
              <span key={index} className="px-4 py-2">
                ...
              </span>
            )
          )}
        </div>
      </div>

      <Button
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded hover:bg-blue-600 disabled:bg-gray-300"
        element={<>下一頁</>}
      />
    </div>
  );
};

export default Pagination;

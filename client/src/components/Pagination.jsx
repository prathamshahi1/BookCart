import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Pagination = ({ page, pages, onPageChange }) => {
  if (pages <= 1) return null;

  const pageNumbers = [];
  const maxDisplayedPages = 5;

  let startPage = Math.max(1, page - Math.floor(maxDisplayedPages / 2));
  let endPage = Math.min(pages, startPage + maxDisplayedPages - 1);

  if (endPage - startPage + 1 < maxDisplayedPages) {
    startPage = Math.max(1, endPage - maxDisplayedPages + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="flex items-center justify-center space-x-2 my-8">
      {/* Previous Page Button */}
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
        className="p-2 rounded-xl border border-brand-200 bg-white text-slate-600 hover:bg-brand-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
        title="Previous Page"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      {startPage > 1 && (
        <>
          <button
            onClick={() => onPageChange(1)}
            className="w-9 h-9 rounded-xl border border-brand-200 bg-white text-xs font-semibold text-slate-700 hover:bg-brand-50 transition-all"
          >
            1
          </button>
          {startPage > 2 && <span className="text-slate-400 px-1">...</span>}
        </>
      )}

      {pageNumbers.map((num) => (
        <button
          key={num}
          onClick={() => onPageChange(num)}
          className={`w-9 h-9 rounded-xl text-xs font-bold transition-all ${
            page === num
              ? 'bg-brand-700 text-white shadow-md shadow-brand-700/20'
              : 'border border-brand-200 bg-white text-slate-700 hover:bg-brand-50'
          }`}
        >
          {num}
        </button>
      ))}

      {endPage < pages && (
        <>
          {endPage < pages - 1 && <span className="text-slate-400 px-1">...</span>}
          <button
            onClick={() => onPageChange(pages)}
            className="w-9 h-9 rounded-xl border border-brand-200 bg-white text-xs font-semibold text-slate-700 hover:bg-brand-50 transition-all"
          >
            {pages}
          </button>
        </>
      )}

      {/* Next Page Button */}
      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page === pages}
        className="p-2 rounded-xl border border-brand-200 bg-white text-slate-600 hover:bg-brand-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
        title="Next Page"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
};

export default Pagination;

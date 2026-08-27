import React from 'react';
import { BookOpen } from 'lucide-react';

export const Loader = ({ message = 'Loading...', fullScreen = false }) => {
  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 bg-[#fcfaf7]/80 backdrop-blur-sm flex flex-col items-center justify-center">
        <div className="relative">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-brand-700 to-brand-500 flex items-center justify-center text-white shadow-xl shadow-brand-700/30 animate-bounce">
            <BookOpen className="w-8 h-8" />
          </div>
          <div className="w-12 h-2 bg-brand-900/10 rounded-full mx-auto mt-2 blur-xs"></div>
        </div>
        <p className="mt-4 text-sm font-semibold text-slate-700 tracking-wide animate-pulse">
          {message}
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="w-10 h-10 border-3 border-brand-200 border-t-brand-700 rounded-full animate-spin"></div>
      <p className="mt-3 text-xs font-medium text-slate-500">{message}</p>
    </div>
  );
};

export const BookGridSkeleton = ({ count = 8 }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="bg-white rounded-2xl border border-brand-100 overflow-hidden shadow-xs flex flex-col"
        >
          <div className="aspect-[3/4] skeleton-shimmer w-full"></div>
          <div className="p-4 space-y-2">
            <div className="h-3 bg-slate-200 rounded-full w-1/3"></div>
            <div className="h-4 bg-slate-200 rounded-full w-full"></div>
            <div className="h-3 bg-slate-200 rounded-full w-1/2"></div>
            <div className="h-4 bg-slate-200 rounded-full w-1/4 pt-2"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Loader;

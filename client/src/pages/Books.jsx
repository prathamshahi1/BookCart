import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  SlidersHorizontal,
  Search,
  X,
  Filter,
  ArrowUpDown,
  RotateCcw,
  Check
} from 'lucide-react';
import BookCard from '../components/BookCard';
import { BookGridSkeleton } from '../components/Loader';
import EmptyState from '../components/EmptyState';
import Pagination from '../components/Pagination';
import Rating from '../components/Rating';
import { fetchBooks, fetchFilterOptions } from '../redux/slices/bookSlice';

const Books = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const dispatch = useDispatch();

  const { books, page, pages, totalBooks, loading, filterOptions } = useSelector(
    (state) => state.books
  );

  // Filter States
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'all');
  const [selectedAuthor, setSelectedAuthor] = useState(searchParams.get('author') || 'all');
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');
  const [minRating, setMinRating] = useState(searchParams.get('rating') || '');
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'newest');
  const [inStockOnly, setInStockOnly] = useState(searchParams.get('inStock') === 'true');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchFilterOptions());
  }, [dispatch]);

  useEffect(() => {
    const currentParams = {
      search: searchParams.get('search') || '',
      category: searchParams.get('category') || 'all',
      author: searchParams.get('author') || 'all',
      minPrice: searchParams.get('minPrice') || '',
      maxPrice: searchParams.get('maxPrice') || '',
      rating: searchParams.get('rating') || '',
      sort: searchParams.get('sort') || 'newest',
      inStock: searchParams.get('inStock') || '',
      page: searchParams.get('page') || 1,
      limit: 12
    };

    setSearchTerm(currentParams.search);
    setSelectedCategory(currentParams.category);
    setSelectedAuthor(currentParams.author);
    setMinPrice(currentParams.minPrice);
    setMaxPrice(currentParams.maxPrice);
    setMinRating(currentParams.rating);
    setSortBy(currentParams.sort);
    setInStockOnly(currentParams.inStock === 'true');

    dispatch(fetchBooks(currentParams));
  }, [searchParams, dispatch]);

  const applyFilters = (customParams = {}) => {
    const params = new URLSearchParams();

    const searchVal = customParams.search !== undefined ? customParams.search : searchTerm;
    const catVal = customParams.category !== undefined ? customParams.category : selectedCategory;
    const authVal = customParams.author !== undefined ? customParams.author : selectedAuthor;
    const minPVal = customParams.minPrice !== undefined ? customParams.minPrice : minPrice;
    const maxPVal = customParams.maxPrice !== undefined ? customParams.maxPrice : maxPrice;
    const ratingVal = customParams.rating !== undefined ? customParams.rating : minRating;
    const sortVal = customParams.sort !== undefined ? customParams.sort : sortBy;
    const stockVal = customParams.inStock !== undefined ? customParams.inStock : inStockOnly;
    const pageVal = customParams.page !== undefined ? customParams.page : 1;

    if (searchVal.trim()) params.set('search', searchVal.trim());
    if (catVal && catVal !== 'all') params.set('category', catVal);
    if (authVal && authVal !== 'all') params.set('author', authVal);
    if (minPVal) params.set('minPrice', minPVal);
    if (maxPVal) params.set('maxPrice', maxPVal);
    if (ratingVal) params.set('rating', ratingVal);
    if (sortVal) params.set('sort', sortVal);
    if (stockVal) params.set('inStock', 'true');
    if (pageVal > 1) params.set('page', pageVal);

    setSearchParams(params);
    setIsMobileFilterOpen(false);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    applyFilters({ search: searchTerm, page: 1 });
  };

  const resetAllFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    setSelectedAuthor('all');
    setMinPrice('');
    setMaxPrice('');
    setMinRating('');
    setSortBy('newest');
    setInStockOnly(false);
    setSearchParams({});
  };

  const handlePageChange = (newPage) => {
    applyFilters({ page: newPage });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-brand-200/60 dark:border-slate-800">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
            Browse All Books
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Showing {totalBooks} titles priced between ₹59 and ₹199
          </p>
        </div>

        {/* Sort & Mobile Filter Toggle */}
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setIsMobileFilterOpen(true)}
            className="lg:hidden flex items-center space-x-2 px-4 py-2 rounded-xl bg-white dark:bg-slate-800 border border-brand-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 shadow-xs"
          >
            <Filter className="w-4 h-4 text-brand-500" />
            <span>Filters</span>
          </button>

          <div className="flex items-center space-x-2 bg-white dark:bg-slate-800 border border-brand-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs shadow-xs">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-500 dark:text-slate-400 font-medium hidden sm:inline">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value);
                applyFilters({ sort: e.target.value, page: 1 });
              }}
              className="bg-transparent font-semibold text-slate-800 dark:text-slate-100 focus:outline-none cursor-pointer"
            >
              <option value="newest" className="dark:bg-slate-900">Newest Releases</option>
              <option value="popular" className="dark:bg-slate-900">Most Popular</option>
              <option value="rating-desc" className="dark:bg-slate-900">Highest Rated</option>
              <option value="price-asc" className="dark:bg-slate-900">Price: Low to High (₹59+)</option>
              <option value="price-desc" className="dark:bg-slate-900">Price: High to Low</option>
              <option value="title-asc" className="dark:bg-slate-900">Title: A to Z</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 pt-8">
        {/* Desktop Sidebar Filters */}
        <aside className="hidden lg:block space-y-6">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-brand-200/60 dark:border-slate-800 shadow-xs space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <span className="font-bold text-sm text-slate-800 dark:text-white flex items-center space-x-2">
                <SlidersHorizontal className="w-4 h-4 text-brand-500" />
                <span>Filter Options</span>
              </span>
              <button
                onClick={resetAllFilters}
                className="text-xs text-brand-600 dark:text-brand-400 hover:text-brand-800 font-semibold flex items-center space-x-1"
                title="Reset All"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            </div>

            {/* Keyword Search */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                Search Keyword
              </label>
              <form onSubmit={handleSearchSubmit} className="relative">
                <input
                  type="text"
                  placeholder="Keywords..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-brand-50/50 dark:bg-slate-800 border border-brand-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-white focus:outline-none focus:border-brand-500"
                />
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </form>
            </div>

            {/* Category Filter */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                Categories
              </label>
              <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                <button
                  onClick={() => {
                    setSelectedCategory('all');
                    applyFilters({ category: 'all', page: 1 });
                  }}
                  className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center justify-between ${
                    selectedCategory === 'all'
                      ? 'bg-brand-100 dark:bg-brand-500/20 text-brand-900 dark:text-brand-300 font-bold'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-brand-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <span>All Categories</span>
                  {selectedCategory === 'all' && <Check className="w-3 h-3 text-brand-500" />}
                </button>

                {filterOptions.categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => {
                      setSelectedCategory(cat);
                      applyFilters({ category: cat, page: 1 });
                    }}
                    className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center justify-between ${
                      selectedCategory.toLowerCase() === cat.toLowerCase()
                        ? 'bg-brand-100 dark:bg-brand-500/20 text-brand-900 dark:text-brand-300 font-bold'
                        : 'text-slate-600 dark:text-slate-300 hover:bg-brand-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    <span>{cat}</span>
                    {selectedCategory.toLowerCase() === cat.toLowerCase() && (
                      <Check className="w-3 h-3 text-brand-500" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Range (₹59 to ₹199) */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                Price Range (₹59 - ₹199)
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  placeholder="59"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  className="w-1/2 px-3 py-1.5 bg-brand-50/50 dark:bg-slate-800 border border-brand-200 dark:border-slate-700 rounded-lg text-xs text-slate-800 dark:text-white"
                />
                <span className="text-slate-400 text-xs">-</span>
                <input
                  type="number"
                  placeholder="199"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="w-1/2 px-3 py-1.5 bg-brand-50/50 dark:bg-slate-800 border border-brand-200 dark:border-slate-700 rounded-lg text-xs text-slate-800 dark:text-white"
                />
              </div>
              <button
                onClick={() => applyFilters({ page: 1 })}
                className="mt-2 w-full py-1.5 rounded-lg bg-brand-500 hover:bg-brand-600 text-white text-xs font-bold shadow-xs transition-all"
              >
                Apply Price
              </button>
            </div>

            {/* Rating Filter */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                Minimum Rating
              </label>
              <div className="space-y-1.5">
                {[4, 3, 2].map((r) => (
                  <button
                    key={r}
                    onClick={() => {
                      const newR = minRating === String(r) ? '' : String(r);
                      setMinRating(newR);
                      applyFilters({ rating: newR, page: 1 });
                    }}
                    className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-xs ${
                      minRating === String(r)
                        ? 'bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/30 font-bold'
                        : 'hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    <Rating value={r} text={`${r} Stars & Above`} size="xs" />
                    {minRating === String(r) && <Check className="w-3 h-3 text-amber-500" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Stock Filter Checkbox */}
            <div className="pt-2">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => {
                    setInStockOnly(e.target.checked);
                    applyFilters({ inStock: e.target.checked, page: 1 });
                  }}
                  className="rounded text-brand-500 focus:ring-brand-400 w-4 h-4 cursor-pointer"
                />
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">In Stock Only</span>
              </label>
            </div>
          </div>
        </aside>

        {/* Main Books Grid Section */}
        <main className="lg:col-span-3">
          {loading ? (
            <BookGridSkeleton count={6} />
          ) : books.length > 0 ? (
            <div>
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {books.map((book) => (
                  <BookCard key={book._id} book={book} />
                ))}
              </div>

              {/* Pagination */}
              <Pagination
                page={page}
                pages={pages}
                onPageChange={handlePageChange}
              />
            </div>
          ) : (
            <EmptyState
              type="search"
              title="No books match your filters"
              description="Try adjusting your keywords, widening the price range (e.g. ₹59-₹199), or clearing filters."
              actionText="Reset Filters"
              onActionClick={resetAllFilters}
            />
          )}
        </main>
      </div>
    </div>
  );
};

export default Books;

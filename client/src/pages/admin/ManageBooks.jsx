import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  BookOpen,
  Plus,
  Search,
  Edit2,
  Trash2,
  ExternalLink,
  Eye,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import { fetchBooks, fetchFilterOptions } from '../../redux/slices/bookSlice';
import { deleteBook } from '../../redux/slices/adminSlice';
import Pagination from '../../components/Pagination';
import { Loader } from '../../components/Loader';
import toast from 'react-hot-toast';

const ManageBooks = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [page, setPage] = useState(1);

  const { books, pages, totalBooks, loading, filterOptions } = useSelector(
    (state) => state.books
  );

  useEffect(() => {
    dispatch(fetchFilterOptions());
  }, [dispatch]);

  useEffect(() => {
    dispatch(
      fetchBooks({
        search: searchTerm,
        category: selectedCategory,
        page,
        limit: 10
      })
    );
  }, [searchTerm, selectedCategory, page, dispatch]);

  const handleDeleteBook = (bookId, title) => {
    if (window.confirm(`Are you sure you want to delete "${title}"? This will also remove all its reviews.`)) {
      dispatch(deleteBook(bookId))
        .unwrap()
        .then(() => {
          toast.success('Book deleted successfully');
          dispatch(fetchBooks({ search: searchTerm, category: selectedCategory, page, limit: 10 }));
        })
        .catch((err) => {
          toast.error(err || 'Failed to delete book');
        });
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white">
            Manage Books ({totalBooks})
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Add, update inventory, edit pricing, or remove titles from the store
          </p>
        </div>

        <Link
          to="/admin/books/add"
          className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold shadow-md shadow-amber-500/20 transition-all hover:scale-105"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Book</span>
        </Link>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <input
            type="text"
            placeholder="Search by title, author, or ISBN..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(1);
            }}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:border-amber-500"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        </div>

        <select
          value={selectedCategory}
          onChange={(e) => {
            setSelectedCategory(e.target.value);
            setPage(1);
          }}
          className="w-full sm:w-auto px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
        >
          <option value="all">All Categories</option>
          {filterOptions.categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {/* Books Table */}
      <div className="bg-slate-800/80 rounded-3xl border border-slate-700 overflow-hidden shadow-xs">
        {loading ? (
          <div className="py-12">
            <Loader message="Loading books..." />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900/60 text-slate-400 uppercase tracking-wider border-b border-slate-700 text-[11px] font-semibold">
                <tr>
                  <th className="py-3.5 px-4">Book</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Price</th>
                  <th className="py-3.5 px-4">Stock</th>
                  <th className="py-3.5 px-4">Rating</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/60 text-slate-300">
                {books.map((book) => (
                  <tr key={book._id} className="hover:bg-slate-700/40 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-3">
                        <img
                          src={book.image}
                          alt={book.title}
                          className="w-10 h-14 object-cover rounded shadow-xs flex-shrink-0"
                        />
                        <div className="min-w-0 max-w-xs">
                          <p className="font-bold text-white truncate">{book.title}</p>
                          <p className="text-[11px] text-slate-400 truncate">by {book.author}</p>
                          <span className="text-[10px] text-slate-500">ISBN: {book.isbn}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-slate-700 text-amber-300">
                        {book.category}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-bold text-white">
                        ₹{book.discountPrice > 0 ? book.discountPrice : book.price}
                      </span>
                      {book.discountPrice > 0 && (
                        <span className="text-[10px] text-slate-400 line-through block">
                          ₹{book.price}
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-0.5 rounded-md font-bold text-[11px] ${
                          book.stock <= 5
                            ? 'bg-rose-500/20 text-rose-300'
                            : 'bg-emerald-500/20 text-emerald-300'
                        }`}
                      >
                        {book.stock} units
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-bold text-amber-400">★ {book.rating || 0}</span>
                      <span className="text-[10px] text-slate-400 block">({book.numReviews} rev)</span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <Link
                          to={`/books/${book._id}`}
                          target="_blank"
                          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700"
                          title="View Live in Store"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <Link
                          to={`/admin/books/edit/${book._id}`}
                          className="p-1.5 rounded-lg text-amber-400 hover:text-amber-300 hover:bg-amber-500/10"
                          title="Edit Book"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDeleteBook(book._id, book.title)}
                          className="p-1.5 rounded-lg text-rose-400 hover:text-rose-300 hover:bg-rose-500/10"
                          title="Delete Book"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      <Pagination page={page} pages={pages} onPageChange={(p) => setPage(p)} />
    </div>
  );
};

export default ManageBooks;

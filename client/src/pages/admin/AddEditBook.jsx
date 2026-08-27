import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  ArrowLeft,
  Save,
  Image as ImageIcon,
  BookOpen,
  Sparkles,
  Upload,
  CheckCircle2
} from 'lucide-react';
import api from '../../services/api';
import { createBook, updateBook, fetchCategories } from '../../redux/slices/adminSlice';
import { fetchBookDetails } from '../../redux/slices/bookSlice';
import { Loader } from '../../components/Loader';
import toast from 'react-hot-toast';

const AddEditBook = () => {
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { categories, actionLoading } = useSelector((state) => state.admin);
  const { currentBook, detailsLoading } = useSelector((state) => state.books);

  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Programming');
  const [price, setPrice] = useState('');
  const [discountPrice, setDiscountPrice] = useState('');
  const [stock, setStock] = useState('10');
  const [isbn, setIsbn] = useState('');
  const [publisher, setPublisher] = useState('BookCart Press');
  const [language, setLanguage] = useState('English');
  const [pages, setPages] = useState('320');
  const [image, setImage] = useState('');
  const [featured, setFeatured] = useState(false);
  const [bestSeller, setBestSeller] = useState(false);
  const [tags, setTags] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    dispatch(fetchCategories());
    if (isEditMode) {
      dispatch(fetchBookDetails(id));
    }
  }, [id, isEditMode, dispatch]);

  useEffect(() => {
    if (isEditMode && currentBook && currentBook._id === id) {
      setTitle(currentBook.title || '');
      setAuthor(currentBook.author || '');
      setDescription(currentBook.description || '');
      setCategory(currentBook.category || 'Programming');
      setPrice(currentBook.price || '');
      setDiscountPrice(currentBook.discountPrice || '');
      setStock(currentBook.stock || '0');
      setIsbn(currentBook.isbn || '');
      setPublisher(currentBook.publisher || '');
      setLanguage(currentBook.language || 'English');
      setPages(currentBook.pages || '300');
      setImage(currentBook.image || '');
      setFeatured(Boolean(currentBook.featured));
      setBestSeller(Boolean(currentBook.bestSeller));
      setTags(Array.isArray(currentBook.tags) ? currentBook.tags.join(', ') : '');
    }
  }, [isEditMode, currentBook, id]);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);
    setIsUploading(true);

    try {
      const { data } = await api.post('/admin/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setImage(data.data.url);
      toast.success('Image uploaded successfully');
    } catch (err) {
      toast.error(err.message || 'Image upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!title || !author || !description || !category || !price) {
      toast.error('Please fill in all required fields (Title, Author, Description, Category, Price)');
      return;
    }

    const bookPayload = {
      title,
      author,
      description,
      category,
      price: Number(price),
      discountPrice: discountPrice ? Number(discountPrice) : 0,
      stock: Number(stock),
      isbn,
      publisher,
      language,
      pages: Number(pages),
      image: image || 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=800',
      featured,
      bestSeller,
      tags: tags.split(',').map((t) => t.trim()).filter((t) => t)
    };

    if (isEditMode) {
      dispatch(updateBook({ bookId: id, bookData: bookPayload }))
        .unwrap()
        .then(() => {
          toast.success('Book updated successfully!');
          navigate('/admin/books');
        })
        .catch((err) => {
          toast.error(err || 'Failed to update book');
        });
    } else {
      dispatch(createBook(bookPayload))
        .unwrap()
        .then(() => {
          toast.success('New book added to bookstore catalog!');
          navigate('/admin/books');
        })
        .catch((err) => {
          toast.error(err || 'Failed to create book');
        });
    }
  };

  if (isEditMode && detailsLoading) {
    return <Loader message="Loading book details..." fullScreen />;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-6 border-b border-slate-800">
        <div className="flex items-center space-x-3">
          <Link
            to="/admin/books"
            className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="font-serif text-2xl font-bold text-white">
              {isEditMode ? 'Edit Book Details' : 'Add New Book to Store'}
            </h1>
            <p className="text-xs text-slate-400">
              {isEditMode ? `Update fields for ${title || 'this book'}` : 'Publish a new title across genres'}
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Main Book Details */}
          <div className="md:col-span-8 bg-slate-800/80 p-6 rounded-3xl border border-slate-700 space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                Book Title *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Clean Architecture"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                  Author Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Robert C. Martin"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                  Category *
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
                >
                  {(categories.length > 0
                    ? categories.map((c) => c.name)
                    : ['Programming', 'Computer Science', 'Fiction', 'Business', 'Self Help', 'Biography']
                  ).map((catName) => (
                    <option key={catName} value={catName}>
                      {catName}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                Description & Overview *
              </label>
              <textarea
                rows={5}
                required
                placeholder="Comprehensive summary of book concepts, target audience, and key topics..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-3.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 leading-relaxed"
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                  Regular Price (₹) *
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  placeholder="599"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                  Discount Price (₹)
                </label>
                <input
                  type="number"
                  min="0"
                  placeholder="449"
                  value={discountPrice}
                  onChange={(e) => setDiscountPrice(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                  Inventory Stock *
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  placeholder="25"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">ISBN-13</label>
                <input
                  type="text"
                  placeholder="978-0..."
                  value={isbn}
                  onChange={(e) => setIsbn(e.target.value)}
                  className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">Publisher</label>
                <input
                  type="text"
                  placeholder="Publisher"
                  value={publisher}
                  onChange={(e) => setPublisher(e.target.value)}
                  className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">Language</label>
                <input
                  type="text"
                  placeholder="English"
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">Pages</label>
                <input
                  type="number"
                  placeholder="350"
                  value={pages}
                  onChange={(e) => setPages(e.target.value)}
                  className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                Search Tags (comma-separated)
              </label>
              <input
                type="text"
                placeholder="react, javascript, web dev, coding"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white"
              />
            </div>
          </div>

          {/* Right Image & Promotion Sidebar */}
          <div className="md:col-span-4 space-y-6">
            {/* Book Image Preview */}
            <div className="bg-slate-800/80 p-6 rounded-3xl border border-slate-700 space-y-4 text-center">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                Cover Image Preview
              </span>

              <div className="w-full aspect-[3/4] bg-slate-900 rounded-2xl border border-slate-700 p-2 flex items-center justify-center overflow-hidden">
                {image ? (
                  <img
                    src={image}
                    alt="Cover preview"
                    className="h-full object-cover rounded-lg shadow-md"
                  />
                ) : (
                  <ImageIcon className="w-12 h-12 text-slate-600" />
                )}
              </div>

              <div>
                <label className="block text-[11px] text-slate-400 text-left mb-1">
                  Image URL
                </label>
                <input
                  type="text"
                  placeholder="https://images.unsplash.com/..."
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white"
                />
              </div>

              <div className="relative pt-2">
                <label className="w-full py-2 px-3 rounded-xl bg-slate-700 hover:bg-slate-600 text-white text-xs font-semibold flex items-center justify-center space-x-2 cursor-pointer transition-all">
                  <Upload className="w-3.5 h-3.5" />
                  <span>{isUploading ? 'Uploading...' : 'Upload File to Server'}</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {/* Badges & Flags */}
            <div className="bg-slate-800/80 p-6 rounded-3xl border border-slate-700 space-y-3">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                Visibility Flags
              </span>

              <label className="flex items-center space-x-3 p-3 bg-slate-900 rounded-xl border border-slate-700/60 cursor-pointer">
                <input
                  type="checkbox"
                  checked={featured}
                  onChange={(e) => setFeatured(e.target.checked)}
                  className="rounded text-amber-500 focus:ring-amber-400 w-4 h-4"
                />
                <span className="text-xs font-semibold text-white">Feature on Homepage</span>
              </label>

              <label className="flex items-center space-x-3 p-3 bg-slate-900 rounded-xl border border-slate-700/60 cursor-pointer">
                <input
                  type="checkbox"
                  checked={bestSeller}
                  onChange={(e) => setBestSeller(e.target.checked)}
                  className="rounded text-amber-500 focus:ring-amber-400 w-4 h-4"
                />
                <span className="text-xs font-semibold text-white">Mark as Bestseller</span>
              </label>
            </div>

            {/* Save Button */}
            <button
              type="submit"
              disabled={actionLoading}
              className="w-full py-3.5 rounded-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs shadow-lg shadow-amber-500/20 flex items-center justify-center space-x-2 transition-all hover:scale-105"
            >
              <Save className="w-4 h-4" />
              <span>{isEditMode ? 'Save Book Changes' : 'Publish Book to Catalog'}</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddEditBook;

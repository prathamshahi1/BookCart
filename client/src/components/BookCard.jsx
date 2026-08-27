import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ShoppingBag, Heart, Sparkles, BookOpen } from 'lucide-react';
import Rating from './Rating';
import { addToCart } from '../redux/slices/cartSlice';
import { toggleWishlist } from '../redux/slices/wishlistSlice';
import toast from 'react-hot-toast';

const FALLBACK_COVER = 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=600';

const BookCard = ({ book }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [imgSrc, setImgSrc] = useState(book?.image || FALLBACK_COVER);

  const { userInfo } = useSelector((state) => state.auth);
  const { items: wishlistItems } = useSelector((state) => state.wishlist);

  const isWishlisted = wishlistItems?.some((item) => (item._id || item) === book._id);

  const discountPercent =
    book.discountPrice > 0 && book.price > book.discountPrice
      ? Math.round(((book.price - book.discountPrice) / book.price) * 100)
      : 0;

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!userInfo) {
      toast.error('Please sign in to add books to your cart');
      navigate('/login');
      return;
    }

    if (book.stock <= 0) {
      toast.error('Sorry, this book is currently out of stock');
      return;
    }

    dispatch(addToCart({ bookId: book._id, quantity: 1 }))
      .unwrap()
      .then((data) => {
        const count = data?.totalItemsCount || 1;
        toast.success(`🛒 "${book.title}" added to cart! (${count} ${count === 1 ? 'item' : 'items'} in cart)`);
      })
      .catch((err) => {
        toast.error(err || 'Failed to add book to cart');
      });
  };

  const handleToggleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!userInfo) {
      toast.error('Please sign in to save books to your wishlist');
      navigate('/login');
      return;
    }

    dispatch(toggleWishlist(book._id))
      .unwrap()
      .then((res) => {
        if (res.action === 'added') {
          toast.success('Added to wishlist');
        } else {
          toast.success('Removed from wishlist');
        }
      })
      .catch((err) => {
        toast.error(err || 'Wishlist update failed');
      });
  };

  return (
    <div className="book-card-container group relative flex flex-col bg-white dark:bg-slate-800/90 rounded-2xl border border-brand-200/70 dark:border-slate-700 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300">
      {/* Top Badges */}
      <div className="absolute top-3 left-3 z-10 flex flex-col space-y-1">
        {discountPercent > 0 && (
          <span className="px-2.5 py-0.8 bg-brand-500 text-white text-[10px] font-extrabold rounded-lg shadow-md shadow-brand-500/30 uppercase tracking-wide">
            {discountPercent}% OFF
          </span>
        )}
        {book.bestSeller && (
          <span className="px-2 py-0.5 bg-amber-500 text-white text-[10px] font-bold rounded-md shadow-sm uppercase tracking-wide flex items-center space-x-1">
            <Sparkles className="w-3 h-3 inline" />
            <span>Bestseller</span>
          </span>
        )}
      </div>

      {/* Wishlist Button */}
      <button
        onClick={handleToggleWishlist}
        className={`absolute top-3 right-3 z-10 w-8 h-8 rounded-full flex items-center justify-center transition-all ${
          isWishlisted
            ? 'bg-rose-500 text-white shadow-md shadow-rose-500/30'
            : 'bg-white/90 dark:bg-slate-700/90 text-slate-400 hover:text-rose-500 hover:bg-white shadow-sm'
        }`}
        title={isWishlisted ? 'Remove from wishlist' : 'Save to wishlist'}
      >
        <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-white' : ''}`} />
      </button>

      {/* Book Cover Image */}
      <Link
        to={`/books/${book._id}`}
        className="block relative bg-gradient-to-b from-brand-50/50 to-brand-100/30 dark:from-slate-800 dark:to-slate-900 p-5 flex items-center justify-center overflow-hidden aspect-[3/4]"
      >
        <img
          src={imgSrc}
          alt={book.title}
          onError={() => setImgSrc(FALLBACK_COVER)}
          className="book-cover h-full max-h-56 object-cover rounded-md shadow-book transition-transform duration-300"
          loading="lazy"
        />
        {book.stock <= 0 && (
          <div className="absolute inset-0 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center">
            <span className="bg-slate-950 text-white text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider">
              Out of Stock
            </span>
          </div>
        )}
      </Link>

      {/* Book Meta & Content */}
      <div className="flex-1 p-4 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between text-xs text-brand-600 dark:text-brand-400 font-semibold mb-1">
            <span>{book.category}</span>
            {book.stock > 0 && book.stock <= 5 && (
              <span className="text-amber-600 dark:text-amber-400 font-bold text-[11px]">Only {book.stock} left!</span>
            )}
          </div>

          <Link
            to={`/books/${book._id}`}
            className="block font-serif font-bold text-sm text-slate-800 dark:text-white hover:text-brand-600 dark:hover:text-brand-400 transition-colors line-clamp-2 min-h-[40px]"
            title={book.title}
          >
            {book.title}
          </Link>

          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium truncate">
            by {book.author}
          </p>

          <div className="mt-2.5">
            <Rating value={book.rating || 0} numReviews={book.numReviews || 0} size="xs" />
          </div>
        </div>

        {/* Pricing & Add to Cart */}
        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between">
          <div>
            <div className="flex items-baseline space-x-1.5">
              <span className="text-base font-extrabold text-slate-900 dark:text-white">
                ₹{book.discountPrice > 0 ? book.discountPrice : book.price}
              </span>
              {book.discountPrice > 0 && (
                <span className="text-xs text-slate-400 dark:text-slate-500 line-through">
                  ₹{book.price}
                </span>
              )}
            </div>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={book.stock <= 0}
            className={`p-2 rounded-xl flex items-center justify-center transition-all ${
              book.stock <= 0
                ? 'bg-slate-100 dark:bg-slate-700 text-slate-400 cursor-not-allowed'
                : 'bg-brand-50 dark:bg-brand-500/10 text-brand-600 dark:text-brand-400 hover:bg-brand-500 hover:text-white dark:hover:bg-brand-500 dark:hover:text-white shadow-xs hover:shadow-md hover:shadow-brand-500/20 active:scale-95'
            }`}
            title="Add to Cart"
          >
            <ShoppingBag className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookCard;

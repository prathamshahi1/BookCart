import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Heart, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';
import EmptyState from '../components/EmptyState';
import { Loader } from '../components/Loader';
import { fetchWishlist, removeFromWishlist } from '../redux/slices/wishlistSlice';
import { addToCart } from '../redux/slices/cartSlice';
import toast from 'react-hot-toast';

const Wishlist = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { userInfo } = useSelector((state) => state.auth);
  const { items, loading } = useSelector((state) => state.wishlist);

  useEffect(() => {
    if (userInfo) {
      dispatch(fetchWishlist());
    }
  }, [userInfo, dispatch]);

  if (!userInfo) {
    return (
      <EmptyState
        type="wishlist"
        title="Sign in to View Wishlist"
        description="Your saved reading wishlist is waiting for you. Log in to keep track of books you want to read next."
        actionText="Sign In"
        actionLink="/login"
      />
    );
  }

  if (loading && items.length === 0) {
    return <Loader message="Loading your reading wishlist..." fullScreen />;
  }

  if (items.length === 0) {
    return (
      <EmptyState
        type="wishlist"
        title="Your Wishlist is Empty"
        description="Found something you want to read later? Click the heart icon on any book to save it to your personal wishlist."
        actionText="Explore Popular Books"
        actionLink="/books"
      />
    );
  }

  const handleMoveToCart = (book) => {
    if (book.stock <= 0) {
      toast.error('Sorry, this book is currently out of stock');
      return;
    }

    dispatch(addToCart({ bookId: book._id, quantity: 1 }))
      .unwrap()
      .then(() => {
        dispatch(removeFromWishlist(book._id));
        toast.success(`Moved "${book.title}" to shopping cart!`);
      })
      .catch((err) => {
        toast.error(err || 'Failed to move to cart');
      });
  };

  const handleRemove = (bookId, title) => {
    dispatch(removeFromWishlist(bookId))
      .unwrap()
      .then(() => {
        toast.success(`Removed "${title}" from wishlist`);
      });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="flex items-center justify-between pb-6 border-b border-brand-200/60">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900">
            My Reading Wishlist ({items.length})
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Saved books to read, buy, or gift
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {items.map((book) => {
          if (!book) return null;
          const price = book.discountPrice > 0 ? book.discountPrice : book.price;

          return (
            <div
              key={book._id}
              className="bg-white rounded-3xl border border-brand-200/60 shadow-xs hover:shadow-lg transition-all p-4 flex flex-col justify-between"
            >
              <div className="relative">
                <Link
                  to={`/books/${book._id}`}
                  className="block bg-brand-50/50 rounded-2xl p-4 flex items-center justify-center aspect-[3/4] overflow-hidden mb-3"
                >
                  <img
                    src={book.image}
                    alt={book.title}
                    className="h-full object-cover rounded shadow-book hover:scale-105 transition-transform"
                  />
                </Link>
                <button
                  onClick={() => handleRemove(book._id, book.title)}
                  className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/90 shadow-sm text-slate-400 hover:text-rose-600 flex items-center justify-center transition-colors"
                  title="Remove"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-2">
                <span className="text-[10px] font-bold text-brand-700 uppercase bg-brand-50 px-2 py-0.5 rounded-md">
                  {book.category}
                </span>
                <Link
                  to={`/books/${book._id}`}
                  className="font-serif font-bold text-xs text-slate-900 hover:text-brand-700 line-clamp-2 block"
                >
                  {book.title}
                </Link>
                <p className="text-[11px] text-slate-400">by {book.author}</p>

                <div className="flex items-baseline space-x-2 pt-1">
                  <span className="text-sm font-extrabold text-slate-900">₹{price}</span>
                  {book.discountPrice > 0 && (
                    <span className="text-xs text-slate-400 line-through">₹{book.price}</span>
                  )}
                </div>

                <button
                  onClick={() => handleMoveToCart(book)}
                  disabled={book.stock <= 0}
                  className={`w-full mt-2 py-2 rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5 transition-all ${
                    book.stock <= 0
                      ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                      : 'bg-brand-700 hover:bg-brand-800 text-white shadow-md shadow-brand-700/20 active:scale-95'
                  }`}
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>{book.stock <= 0 ? 'Out of Stock' : 'Move to Cart'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Wishlist;

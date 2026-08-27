import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  ShoppingBag,
  Heart,
  Truck,
  ShieldCheck,
  RotateCcw,
  CheckCircle2,
  Plus,
  Minus,
  MessageSquarePlus,
  ArrowRight
} from 'lucide-react';
import Rating from '../components/Rating';
import BookCard from '../components/BookCard';
import { Loader } from '../components/Loader';
import {
  fetchBookDetails,
  submitBookReview,
  clearCurrentBook
} from '../redux/slices/bookSlice';
import { addToCart } from '../redux/slices/cartSlice';
import { toggleWishlist } from '../redux/slices/wishlistSlice';
import toast from 'react-hot-toast';

const FALLBACK_COVER = 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=800';

const BookDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [quantity, setQuantity] = useState(1);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [coverImg, setCoverImg] = useState('');

  const { userInfo } = useSelector((state) => state.auth);
  const { currentBook, relatedBooks, reviews, detailsLoading, reviewLoading } = useSelector(
    (state) => state.books
  );
  const { items: wishlistItems } = useSelector((state) => state.wishlist);

  const isWishlisted = wishlistItems?.some(
    (item) => (item._id || item) === currentBook?._id
  );

  useEffect(() => {
    if (id) {
      dispatch(fetchBookDetails(id));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    return () => {
      dispatch(clearCurrentBook());
    };
  }, [id, dispatch]);

  useEffect(() => {
    if (currentBook?.image) {
      setCoverImg(currentBook.image);
    }
  }, [currentBook]);

  if (detailsLoading || !currentBook) {
    return <Loader message="Fetching book details..." fullScreen />;
  }

  const effectivePrice =
    currentBook.discountPrice > 0 ? currentBook.discountPrice : currentBook.price;
  const discountPercent =
    currentBook.discountPrice > 0
      ? Math.round(((currentBook.price - currentBook.discountPrice) / currentBook.price) * 100)
      : 0;

  const handleAddToCart = () => {
    if (!userInfo) {
      toast.error('Please sign in to add items to cart');
      navigate(`/login?redirect=${encodeURIComponent(window.location.pathname)}`);
      return;
    }
    if (currentBook.stock <= 0) {
      toast.error('Sorry, this book is out of stock');
      return;
    }

    dispatch(addToCart({ bookId: currentBook._id, quantity }))
      .unwrap()
      .then((data) => {
        const count = data?.totalItemsCount || quantity;
        toast.success(`🛒 Added ${quantity} × "${currentBook.title}" to cart! (${count} ${count === 1 ? 'item' : 'items'} in cart)`);
      })
      .catch((err) => {
        toast.error(err || 'Failed to add to cart');
      });
  };

  const handleBuyNow = () => {
    if (!userInfo) {
      toast.error('Please sign in to proceed to checkout');
      navigate(`/login?redirect=${encodeURIComponent('/checkout')}`);
      return;
    }
    if (currentBook.stock <= 0) {
      toast.error('Sorry, this book is out of stock');
      return;
    }

    dispatch(addToCart({ bookId: currentBook._id, quantity }))
      .unwrap()
      .then(() => {
        navigate('/checkout');
      })
      .catch((err) => {
        toast.error(err || 'Failed to process order');
      });
  };

  const handleToggleWishlist = () => {
    if (!userInfo) {
      toast.error('Please sign in to save items to wishlist');
      navigate('/login');
      return;
    }

    dispatch(toggleWishlist(currentBook._id))
      .unwrap()
      .then((res) => {
        toast.success(
          res.action === 'added' ? 'Added to wishlist!' : 'Removed from wishlist'
        );
      });
  };

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (!userInfo) {
      toast.error('Please log in to submit a customer review');
      navigate('/login');
      return;
    }

    if (!reviewComment.trim()) {
      toast.error('Please write a review comment');
      return;
    }

    dispatch(
      submitBookReview({
        bookId: currentBook._id,
        rating: reviewRating,
        comment: reviewComment
      })
    )
      .unwrap()
      .then(() => {
        toast.success('Review submitted successfully! Thank you for your feedback.');
        setReviewComment('');
        dispatch(fetchBookDetails(currentBook._id));
      })
      .catch((err) => {
        toast.error(err || 'Failed to submit review');
      });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
      {/* Breadcrumbs */}
      <nav className="flex items-center space-x-2 text-xs font-medium text-slate-500 dark:text-slate-400">
        <Link to="/" className="hover:text-brand-500">Home</Link>
        <span>/</span>
        <Link to="/books" className="hover:text-brand-500">Books</Link>
        <span>/</span>
        <Link to={`/books?category=${encodeURIComponent(currentBook.category)}`} className="hover:text-brand-500">
          {currentBook.category}
        </Link>
        <span>/</span>
        <span className="text-slate-800 dark:text-slate-200 font-bold truncate max-w-xs">{currentBook.title}</span>
      </nav>

      {/* Main Product Showcase Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left Book Cover Gallery */}
        <div className="lg:col-span-5 flex flex-col items-center">
          <div className="relative w-full max-w-md bg-white dark:bg-slate-900 p-8 rounded-3xl border border-brand-200/60 dark:border-slate-800 shadow-xl flex items-center justify-center">
            {discountPercent > 0 && (
              <span className="absolute top-4 left-4 bg-brand-500 text-white text-xs font-extrabold px-3 py-1 rounded-xl shadow-md uppercase tracking-wider">
                {discountPercent}% OFF
              </span>
            )}
            <button
              onClick={handleToggleWishlist}
              className={`absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center shadow-md transition-all ${
                isWishlisted
                  ? 'bg-rose-500 text-white'
                  : 'bg-white dark:bg-slate-800 text-slate-400 hover:text-rose-500'
              }`}
              title="Save to Wishlist"
            >
              <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-white' : ''}`} />
            </button>

            <img
              src={coverImg || FALLBACK_COVER}
              alt={currentBook.title}
              onError={() => setCoverImg(FALLBACK_COVER)}
              className="h-96 max-h-[420px] object-cover rounded-xl shadow-2xl transition-transform duration-300 hover:scale-105"
            />
          </div>

          {/* Delivery Benefits */}
          <div className="grid grid-cols-3 gap-3 w-full max-w-md mt-6 text-center">
            <div className="p-3 bg-brand-50/70 dark:bg-slate-800/80 rounded-2xl border border-brand-200/50 dark:border-slate-700">
              <Truck className="w-5 h-5 text-brand-500 mx-auto mb-1" />
              <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block">Fast Dispatch</span>
              <span className="text-[10px] text-slate-400">Within 24 Hours</span>
            </div>
            <div className="p-3 bg-brand-50/70 dark:bg-slate-800/80 rounded-2xl border border-brand-200/50 dark:border-slate-700">
              <ShieldCheck className="w-5 h-5 text-brand-500 mx-auto mb-1" />
              <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block">100% Genuine</span>
              <span className="text-[10px] text-slate-400">Publisher Direct</span>
            </div>
            <div className="p-3 bg-brand-50/70 dark:bg-slate-800/80 rounded-2xl border border-brand-200/50 dark:border-slate-700">
              <RotateCcw className="w-5 h-5 text-brand-500 mx-auto mb-1" />
              <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block">Easy Return</span>
              <span className="text-[10px] text-slate-400">7 Days Guarantee</span>
            </div>
          </div>
        </div>

        {/* Right Details Info */}
        <div className="lg:col-span-7 space-y-6">
          <div>
            <span className="inline-block px-3 py-1 rounded-full bg-brand-100 dark:bg-brand-500/20 text-brand-800 dark:text-brand-300 text-xs font-bold uppercase tracking-wider mb-2">
              {currentBook.category}
            </span>
            <h1 className="font-serif text-2xl sm:text-4xl font-bold text-slate-900 dark:text-white leading-tight">
              {currentBook.title}
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-400 font-medium mt-1">
              By <strong className="text-slate-800 dark:text-slate-200 font-semibold">{currentBook.author}</strong> (Author)
            </p>
          </div>

          {/* Rating Summary */}
          <div className="flex items-center space-x-3 pb-4 border-b border-slate-200 dark:border-slate-800">
            <Rating
              value={currentBook.rating || 0}
              text={`${currentBook.rating || 0} / 5`}
              numReviews={currentBook.numReviews || 0}
              size="md"
            />
            <span className="text-slate-300 dark:text-slate-700">|</span>
            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center space-x-1">
              <CheckCircle2 className="w-4 h-4" />
              <span>Verified Genuine Edition</span>
            </span>
          </div>

          {/* Pricing Box */}
          <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-brand-200/80 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-baseline space-x-3">
                <span className="text-3xl font-extrabold font-serif text-slate-900 dark:text-white">
                  ₹{effectivePrice}
                </span>
                {currentBook.discountPrice > 0 && (
                  <span className="text-base text-slate-400 line-through">
                    ₹{currentBook.price}
                  </span>
                )}
                {discountPercent > 0 && (
                  <span className="text-xs font-bold text-brand-600 bg-brand-50 dark:bg-brand-500/10 px-2 py-0.5 rounded-md">
                    Save ₹{currentBook.price - currentBook.discountPrice} ({discountPercent}%)
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                Inclusive of all taxes. Free shipping on orders over ₹500.
              </p>
            </div>

            {/* Stock Status Badge */}
            <div>
              {currentBook.stock > 0 ? (
                <div className="flex items-center space-x-1.5 text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-3 py-1.5 rounded-full text-xs font-bold border border-emerald-200 dark:border-emerald-500/20">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                  <span>In Stock ({currentBook.stock} units left)</span>
                </div>
              ) : (
                <div className="text-rose-700 bg-rose-50 px-3 py-1.5 rounded-full text-xs font-bold border border-rose-200">
                  Currently Out of Stock
                </div>
              )}
            </div>
          </div>

          {/* Book Synopsis */}
          <div>
            <h3 className="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-wider mb-2">
              Book Synopsis
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">
              {currentBook.description}
            </p>
          </div>

          {/* Quantity & Action Buttons */}
          {currentBook.stock > 0 && (
            <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
              <div className="flex items-center space-x-4">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  Quantity:
                </span>
                <div className="flex items-center border border-brand-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 shadow-xs overflow-hidden">
                  <button
                    onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                    className="p-2 text-slate-600 dark:text-slate-300 hover:bg-brand-50 dark:hover:bg-slate-700 transition-colors"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-10 text-center text-xs font-bold text-slate-800 dark:text-white">
                    {quantity}
                  </span>
                  <button
                    onClick={() =>
                      setQuantity((prev) => Math.min(currentBook.stock, prev + 1))
                    }
                    className="p-2 text-slate-600 dark:text-slate-300 hover:bg-brand-50 dark:hover:bg-slate-700 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  onClick={handleAddToCart}
                  className="py-3.5 px-6 rounded-full bg-brand-50 dark:bg-slate-800 hover:bg-brand-100 dark:hover:bg-slate-700 border border-brand-300 dark:border-slate-700 text-brand-900 dark:text-brand-300 font-bold text-xs flex items-center justify-center space-x-2 transition-all active:scale-95 shadow-xs"
                >
                  <ShoppingBag className="w-4 h-4 text-brand-600 dark:text-brand-400" />
                  <span>Add to Shopping Cart</span>
                </button>
                <button
                  onClick={handleBuyNow}
                  className="py-3.5 px-6 rounded-full bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs flex items-center justify-center space-x-2 shadow-lg shadow-brand-500/25 transition-all hover:scale-105 active:scale-95"
                >
                  <span>Buy Now</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Book Metadata Attributes Table */}
          <div className="pt-6 border-t border-slate-200 dark:border-slate-800">
            <h3 className="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-wider mb-3">
              Product Specifications
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
              <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-brand-100 dark:border-slate-800">
                <span className="text-slate-400 block mb-1">ISBN-13</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{currentBook.isbn || 'N/A'}</span>
              </div>
              <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-brand-100 dark:border-slate-800">
                <span className="text-slate-400 block mb-1">Publisher</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{currentBook.publisher}</span>
              </div>
              <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-brand-100 dark:border-slate-800">
                <span className="text-slate-400 block mb-1">Language</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{currentBook.language}</span>
              </div>
              <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-brand-100 dark:border-slate-800">
                <span className="text-slate-400 block mb-1">Pages</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{currentBook.pages} pages</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Customer Reviews Section */}
      <section className="pt-12 border-t border-brand-200/80 dark:border-slate-800 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
              Customer Reviews & Ratings
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Verified feedback from readers who bought this edition
            </p>
          </div>
          <div className="flex items-center space-x-3 bg-white dark:bg-slate-900 px-4 py-2 rounded-2xl border border-brand-200 dark:border-slate-800 shadow-xs">
            <span className="text-2xl font-serif font-bold text-slate-900 dark:text-white">{currentBook.rating || 0}</span>
            <div>
              <Rating value={currentBook.rating || 0} size="sm" />
              <span className="text-[10px] text-slate-400">{reviews.length} total reviews</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Write a review form */}
          <div className="lg:col-span-5 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-brand-200/80 dark:border-slate-800 shadow-xs h-fit space-y-4">
            <div className="flex items-center space-x-2 pb-3 border-b border-slate-100 dark:border-slate-800">
              <MessageSquarePlus className="w-4 h-4 text-brand-500" />
              <h3 className="font-bold text-sm text-slate-800 dark:text-white">Write a Review</h3>
            </div>

            {userInfo ? (
              <form onSubmit={handleReviewSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                    Your Rating
                  </label>
                  <Rating
                    value={reviewRating}
                    interactive
                    onRatingChange={(r) => setReviewRating(r)}
                    size="md"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                    Review Thoughts
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Share your thoughts about this book's concepts, writing quality, and insights..."
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    className="w-full p-3 bg-brand-50/50 dark:bg-slate-800 border border-brand-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-white focus:outline-none focus:border-brand-500 leading-relaxed"
                  />
                </div>

                <button
                  type="submit"
                  disabled={reviewLoading}
                  className="w-full py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs shadow-md shadow-brand-500/20 disabled:opacity-50 transition-all"
                >
                  {reviewLoading ? 'Submitting Review...' : 'Post Customer Review'}
                </button>
              </form>
            ) : (
              <div className="text-center py-6">
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
                  Please sign in with your account to submit a review for this book.
                </p>
                <Link
                  to="/login"
                  className="inline-block px-4 py-2 rounded-full bg-brand-500 text-white text-xs font-bold"
                >
                  Sign In to Review
                </Link>
              </div>
            )}
          </div>

          {/* Reviews List */}
          <div className="lg:col-span-7 space-y-4">
            {reviews.length > 0 ? (
              reviews.map((rev) => (
                <div
                  key={rev._id}
                  className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-brand-100 dark:border-slate-800 shadow-xs space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <img
                        src={rev.user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150'}
                        alt={rev.user?.name || 'Customer'}
                        className="w-8 h-8 rounded-full object-cover ring-1 ring-brand-200"
                      />
                      <div>
                        <h4 className="text-xs font-bold text-slate-800 dark:text-white">
                          {rev.user?.name || 'Verified Reader'}
                        </h4>
                        <div className="flex items-center space-x-2">
                          <Rating value={rev.rating} size="xs" />
                          {rev.isVerifiedPurchase && (
                            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-500/10 px-1.5 py-0.2 rounded-sm">
                              Verified Purchase
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <span className="text-[10px] text-slate-400">
                      {new Date(rev.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {rev.comment}
                  </p>
                </div>
              ))
            ) : (
              <div className="p-8 bg-white dark:bg-slate-900 rounded-2xl border border-brand-100 dark:border-slate-800 text-center">
                <p className="text-xs text-slate-400">No reviews yet for this title. Be the first reader to write one!</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Related Books */}
      {relatedBooks.length > 0 && (
        <section className="pt-12 border-t border-brand-200/80 dark:border-slate-800 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-brand-500 uppercase tracking-wider">More in {currentBook.category}</span>
              <h2 className="font-serif text-2xl font-bold text-slate-900 dark:text-white mt-1">
                You May Also Like
              </h2>
            </div>
            <Link
              to={`/books?category=${encodeURIComponent(currentBook.category)}`}
              className="text-xs font-bold text-brand-600 dark:text-brand-400 hover:text-brand-800 flex items-center space-x-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {relatedBooks.map((b) => (
              <BookCard key={b._id} book={b} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default BookDetails;

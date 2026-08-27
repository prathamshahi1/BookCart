import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShieldCheck,
  ShoppingBag,
  Truck
} from 'lucide-react';
import EmptyState from '../components/EmptyState';
import { Loader } from '../components/Loader';
import {
  fetchCart,
  updateCartQuantity,
  removeFromCart,
  clearCart
} from '../redux/slices/cartSlice';
import toast from 'react-hot-toast';

const FALLBACK_COVER = 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=600';

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { userInfo } = useSelector((state) => state.auth);
  const {
    items = [],
    subtotal = 0,
    totalDiscount = 0,
    shipping = 0,
    finalTotal = 0,
    loading = false
  } = useSelector((state) => state.cart || {});

  const safeItems = Array.isArray(items) ? items.filter(Boolean) : [];

  useEffect(() => {
    if (userInfo) {
      dispatch(fetchCart());
    }
  }, [dispatch, userInfo]);

  if (!userInfo) {
    return (
      <EmptyState
        type="cart"
        title="Your Cart is Waiting"
        description="Please sign in to view your saved books, check delivery, and proceed to checkout."
        actionText="Sign In to Account"
        actionLink="/login"
      />
    );
  }

  if (loading && safeItems.length === 0) {
    return <Loader message="Updating cart items..." fullScreen />;
  }

  if (safeItems.length === 0) {
    return (
      <EmptyState
        type="cart"
        title="Your Cart is Empty"
        description="Explore our vast library of programming books, fiction masterpieces, and business guides priced between ₹59 and ₹199."
        actionText="Browse Bookstore"
        actionLink="/books"
      />
    );
  }

  const handleUpdateQty = (bookId, newQty) => {
    dispatch(updateCartQuantity({ bookId, quantity: newQty }))
      .unwrap()
      .catch((err) => {
        toast.error(err || 'Failed to update quantity');
      });
  };

  const handleRemove = (bookId, title) => {
    dispatch(removeFromCart(bookId))
      .unwrap()
      .then(() => {
        toast.success(`Removed "${title}" from cart`);
      });
  };

  const handleClearCart = () => {
    if (window.confirm('Are you sure you want to clear all items in your cart?')) {
      dispatch(clearCart())
        .unwrap()
        .then(() => {
          toast.success('Cart cleared');
        });
    }
  };

  const totalCount = safeItems.reduce((acc, i) => acc + (i?.quantity || 0), 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between pb-6 border-b border-brand-200/60 dark:border-slate-800">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
            Shopping Cart ({totalCount} {totalCount === 1 ? 'item' : 'items'})
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Review your selected books before proceeding to shipping & payment
          </p>
        </div>

        <button
          onClick={handleClearCart}
          className="text-xs font-semibold text-rose-600 dark:text-rose-400 hover:text-rose-800 flex items-center space-x-1"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Clear Cart</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Cart Items List */}
        <div className="lg:col-span-8 space-y-4">
          {safeItems.map((item) => {
            const book = item.book;
            const bookId = book?._id || item._id;
            const bookTitle = book?.title || 'Book';
            const bookAuthor = book?.author || 'Author';
            const bookCategory = book?.category || 'General';
            const bookImage = book?.image || FALLBACK_COVER;
            const itemQty = item?.quantity || 1;

            const effectivePrice =
              book && book.discountPrice > 0 ? book.discountPrice : (book?.price || item.price || 99);

            return (
              <div
                key={item._id || bookId}
                className="p-4 sm:p-6 bg-white dark:bg-slate-900 rounded-2xl border border-brand-200/60 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row items-center gap-4 sm:gap-6 justify-between"
              >
                {/* Book Image */}
                <Link
                  to={bookId ? `/books/${bookId}` : '/books'}
                  className="w-20 h-28 flex-shrink-0 bg-brand-50/50 dark:bg-slate-800 rounded-xl p-2 flex items-center justify-center overflow-hidden border border-brand-100 dark:border-slate-700"
                >
                  <img
                    src={bookImage}
                    alt={bookTitle}
                    onError={(e) => { e.target.onerror = null; e.target.src = FALLBACK_COVER; }}
                    className="h-full object-cover rounded shadow-xs"
                  />
                </Link>

                {/* Details */}
                <div className="flex-1 text-center sm:text-left space-y-1">
                  <span className="text-[10px] font-bold uppercase text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-500/10 px-2 py-0.5 rounded-md">
                    {bookCategory}
                  </span>
                  <Link
                    to={bookId ? `/books/${bookId}` : '/books'}
                    className="font-serif font-bold text-sm text-slate-800 dark:text-white hover:text-brand-600 dark:hover:text-brand-400 line-clamp-1 block"
                  >
                    {bookTitle}
                  </Link>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">by {bookAuthor}</p>
                  <div className="flex items-center justify-center sm:justify-start space-x-2 pt-1">
                    <span className="text-sm font-extrabold text-slate-900 dark:text-white">
                      ₹{effectivePrice}
                    </span>
                    {book && book.discountPrice > 0 && (
                      <span className="text-xs text-slate-400 line-through">
                        ₹{book.price}
                      </span>
                    )}
                  </div>
                </div>

                {/* Quantity Controls & Total */}
                <div className="flex items-center space-x-6">
                  {/* Stepper */}
                  <div className="flex items-center border border-brand-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 shadow-xs overflow-hidden">
                    <button
                      onClick={() => handleUpdateQty(bookId, itemQty - 1)}
                      className="p-1.5 text-slate-600 dark:text-slate-300 hover:bg-brand-50 dark:hover:bg-slate-700 transition-colors"
                      title="Decrease"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-8 text-center text-xs font-bold text-slate-800 dark:text-white">
                      {itemQty}
                    </span>
                    <button
                      onClick={() => handleUpdateQty(bookId, itemQty + 1)}
                      disabled={book?.stock && itemQty >= book.stock}
                      className="p-1.5 text-slate-600 dark:text-slate-300 hover:bg-brand-50 dark:hover:bg-slate-700 disabled:opacity-30 transition-colors"
                      title="Increase"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Subtotal for item */}
                  <div className="text-right min-w-[70px]">
                    <span className="text-sm font-extrabold text-slate-900 dark:text-white block">
                      ₹{effectivePrice * itemQty}
                    </span>
                    <span className="text-[10px] text-slate-400">Total</span>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => handleRemove(bookId, bookTitle)}
                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-slate-800 rounded-xl transition-all"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}

          <div className="p-4 bg-brand-50/70 dark:bg-slate-900 border border-brand-200 dark:border-slate-800 rounded-2xl flex items-center justify-between text-xs text-brand-900 dark:text-brand-300">
            <div className="flex items-center space-x-2">
              <Truck className="w-4 h-4 text-brand-500" />
              <span>{subtotal >= 500 ? '🎉 Free Delivery Unlocked!' : `Add ₹${Math.max(0, 500 - subtotal)} more for Free Delivery`}</span>
            </div>
            <Link to="/books" className="font-bold underline hover:text-brand-700 dark:hover:text-brand-400">
              Continue Shopping
            </Link>
          </div>
        </div>

        {/* Right Summary Card */}
        <div className="lg:col-span-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-brand-200/80 dark:border-slate-800 shadow-lg space-y-6">
          <h2 className="font-serif font-bold text-lg text-slate-900 dark:text-white pb-3 border-b border-slate-100 dark:border-slate-800">
            Order Summary
          </h2>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between text-slate-600 dark:text-slate-400">
              <span>Original Subtotal</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">₹{subtotal}</span>
            </div>

            {totalDiscount > 0 && (
              <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-semibold">
                <span>Total Book Discounts</span>
                <span>- ₹{totalDiscount}</span>
              </div>
            )}

            <div className="flex justify-between text-slate-600 dark:text-slate-400">
              <span>Delivery & Handling</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                {shipping === 0 ? <strong className="text-emerald-600 dark:text-emerald-400">FREE</strong> : `₹${shipping}`}
              </span>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-between items-baseline">
              <span className="font-bold text-sm text-slate-900 dark:text-white">Final Total</span>
              <span className="font-serif text-2xl font-extrabold text-brand-600 dark:text-brand-400">
                ₹{finalTotal}
              </span>
            </div>
          </div>

          <button
            onClick={() => navigate('/checkout')}
            className="w-full py-3.5 rounded-full bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs shadow-xl shadow-brand-500/25 flex items-center justify-center space-x-2 transition-all hover:scale-[1.02] active:scale-95"
          >
            <span>Proceed to Checkout</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <div className="flex items-center justify-center space-x-2 text-[11px] text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
            <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>256-bit Secure Razorpay Payment Gateway</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;

import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  ShoppingBag,
  Heart,
  User,
  Search,
  Menu,
  X,
  Sun,
  Moon,
  LogOut,
  Package,
  ShieldCheck,
  ChevronDown,
  BookOpen,
  Sparkles
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { logout } from '../redux/slices/authSlice';
import toast from 'react-hot-toast';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const { darkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const { userInfo } = useSelector((state) => state.auth || {});
  const { items: cartItems } = useSelector((state) => state.cart || {});
  const { items: wishlistItems } = useSelector((state) => state.wishlist || {});

  const cartCount = Array.isArray(cartItems)
    ? cartItems.reduce((acc, item) => acc + (item?.quantity || 0), 0)
    : 0;
  const wishlistCount = Array.isArray(wishlistItems) ? wishlistItems.length : 0;

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/books?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setIsMobileMenuOpen(false);
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    setIsProfileDropdownOpen(false);
    toast.success('Logged out successfully');
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-brand-200/60 dark:border-slate-800 transition-colors duration-300">
      {/* Top Promotional Announcement Banner */}
      <div className="bg-gradient-to-r from-brand-600 via-brand-500 to-amber-500 text-white text-[11px] font-semibold py-1.5 px-4 text-center tracking-wide shadow-xs flex items-center justify-center space-x-2">
        <Sparkles className="w-3.5 h-3.5 inline animate-pulse" />
        <span>Special Reader Deal: Books from ₹59 to ₹199 • Free delivery over ₹500! Code: <strong>READMORE</strong></span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-4">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center space-x-3 group flex-shrink-0">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-brand-600 to-amber-500 flex items-center justify-center text-white shadow-lg shadow-brand-500/30 group-hover:scale-105 transition-transform">
              <BookOpen className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <span className="font-serif text-xl font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-0.5">
                Book<span className="text-brand-500">Cart</span>
              </span>
              <span className="text-[9px] uppercase tracking-widest font-extrabold text-brand-600 dark:text-brand-400 block -mt-1">
                Online Bookstore
              </span>
            </div>
          </Link>

          {/* Search Bar (Desktop) */}
          <div className="hidden md:flex flex-1 max-w-md mx-4">
            <form
              onSubmit={handleSearch}
              className="relative w-full group focus-within:ring-2 focus-within:ring-brand-500 rounded-full transition-all"
            >
              <input
                type="text"
                placeholder="Search by title, author, category, or ISBN..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-2 bg-brand-50/60 dark:bg-slate-800/80 border border-brand-200/80 dark:border-slate-700 rounded-full text-xs sm:text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:bg-white dark:focus:bg-slate-800 transition-all shadow-xs"
              />
              <Search className="w-4 h-4 text-slate-400 group-focus-within:text-brand-500 absolute left-4 top-1/2 -translate-y-1/2 transition-colors" />
            </form>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-6">
            <Link
              to="/"
              className={`text-sm font-medium transition-colors ${
                location.pathname === '/'
                  ? 'text-brand-600 dark:text-brand-400 font-bold'
                  : 'text-slate-600 dark:text-slate-300 hover:text-brand-600 dark:hover:text-brand-400'
              }`}
            >
              Home
            </Link>
            <Link
              to="/books"
              className={`text-sm font-medium transition-colors ${
                location.pathname === '/books'
                  ? 'text-brand-600 dark:text-brand-400 font-bold'
                  : 'text-slate-600 dark:text-slate-300 hover:text-brand-600 dark:hover:text-brand-400'
              }`}
            >
              Browse Books
            </Link>
            <Link
              to="/about"
              className={`text-sm font-medium transition-colors ${
                location.pathname === '/about'
                  ? 'text-brand-600 dark:text-brand-400 font-bold'
                  : 'text-slate-600 dark:text-slate-300 hover:text-brand-600 dark:hover:text-brand-400'
              }`}
            >
              About
            </Link>
          </nav>

          {/* Right Action Icons */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Dark / Light Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full text-slate-600 dark:text-amber-400 hover:bg-brand-50 dark:hover:bg-slate-800 transition-all"
              title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {darkMode ? <Sun className="w-5 h-5 animate-spin-slow" /> : <Moon className="w-5 h-5" />}
            </button>

            {/* Wishlist */}
            <Link
              to="/wishlist"
              className="relative p-2 rounded-full text-slate-700 dark:text-slate-200 hover:text-rose-600 hover:bg-rose-50/80 dark:hover:bg-slate-800 transition-all"
              title="Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1.5 text-[11px] font-black leading-tight bg-rose-500 text-white rounded-full flex items-center justify-center shadow-md shadow-rose-500/40 ring-2 ring-white dark:ring-slate-900 animate-in zoom-in-50 duration-200">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Shopping Cart with High-Visibility Badge */}
            <Link
              to="/cart"
              className="relative p-2 rounded-full text-slate-700 dark:text-slate-200 hover:text-brand-600 hover:bg-brand-50/80 dark:hover:bg-slate-800 transition-all"
              title="Shopping Cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1.5 text-[11px] font-black leading-tight bg-brand-500 text-white rounded-full flex items-center justify-center shadow-md shadow-brand-500/40 ring-2 ring-white dark:ring-slate-900 animate-in zoom-in-50 duration-200">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* User Account / Auth Dropdown */}
            {userInfo ? (
              <div className="relative">
                <button
                  onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                  className="flex items-center space-x-2 p-1.5 pr-3 rounded-full hover:bg-brand-50 dark:hover:bg-slate-800 border border-brand-200/60 dark:border-slate-700 transition-all"
                >
                  <img
                    src={userInfo.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150'}
                    alt={userInfo.name}
                    className="w-7 h-7 rounded-full object-cover ring-1 ring-brand-400"
                  />
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-200 max-w-[80px] sm:max-w-[120px] truncate hidden sm:inline">
                    {userInfo.name.split(' ')[0]}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
                </button>

                {/* Dropdown Menu */}
                {isProfileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-brand-200/80 dark:border-slate-800 py-2 z-50 animate-in fade-in-50 duration-150">
                    <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800">
                      <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{userInfo.name}</p>
                      <p className="text-[11px] text-slate-400 truncate">{userInfo.email}</p>
                      <span className="inline-block mt-1 px-2 py-0.5 bg-brand-50 dark:bg-brand-500/10 text-brand-700 dark:text-brand-300 text-[10px] font-bold rounded uppercase">
                        {userInfo.role}
                      </span>
                    </div>

                    <Link
                      to="/profile"
                      onClick={() => setIsProfileDropdownOpen(false)}
                      className="flex items-center space-x-2 px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-brand-50 dark:hover:bg-slate-800"
                    >
                      <User className="w-4 h-4 text-slate-400" />
                      <span>My Profile</span>
                    </Link>

                    <Link
                      to="/orders"
                      onClick={() => setIsProfileDropdownOpen(false)}
                      className="flex items-center space-x-2 px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-brand-50 dark:hover:bg-slate-800"
                    >
                      <Package className="w-4 h-4 text-slate-400" />
                      <span>Order History</span>
                    </Link>

                    <Link
                      to="/wishlist"
                      onClick={() => setIsProfileDropdownOpen(false)}
                      className="flex items-center space-x-2 px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-brand-50 dark:hover:bg-slate-800"
                    >
                      <Heart className="w-4 h-4 text-slate-400" />
                      <span>My Wishlist ({wishlistCount})</span>
                    </Link>

                    {userInfo.role === 'admin' && (
                      <Link
                        to="/admin/dashboard"
                        onClick={() => setIsProfileDropdownOpen(false)}
                        className="flex items-center space-x-2 px-4 py-2 text-xs font-bold text-amber-700 dark:text-amber-400 bg-amber-50/50 dark:bg-amber-500/10 hover:bg-amber-50 dark:hover:bg-amber-500/20"
                      >
                        <ShieldCheck className="w-4 h-4 text-amber-600" />
                        <span>Admin Dashboard</span>
                      </Link>
                    )}

                    <div className="border-t border-slate-100 dark:border-slate-800 mt-1">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center space-x-2 px-4 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-slate-800"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-full text-xs font-bold text-slate-700 dark:text-slate-200 hover:text-brand-600 hover:bg-brand-50 dark:hover:bg-slate-800 transition-all"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 rounded-full bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs shadow-md shadow-brand-500/25 transition-all hover:scale-105"
                >
                  Register
                </Link>
              </div>
            )}

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-brand-50 dark:hover:bg-slate-800"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Search & Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-brand-200/60 dark:border-slate-800 animate-in slide-in-from-top-2 duration-200">
            <form onSubmit={handleSearch} className="mb-4">
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="Search books..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-brand-50 dark:bg-slate-800 border border-brand-200 dark:border-slate-700 rounded-lg text-sm text-slate-800 dark:text-slate-100"
                />
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </form>

            <div className="flex flex-col space-y-2">
              <Link
                to="/"
                onClick={() => setIsMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-brand-50 dark:hover:bg-slate-800"
              >
                Home
              </Link>
              <Link
                to="/books"
                onClick={() => setIsMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-brand-50 dark:hover:bg-slate-800"
              >
                Browse Books Catalog
              </Link>
              <Link
                to="/cart"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-brand-50 dark:hover:bg-slate-800"
              >
                <span>Shopping Cart</span>
                {cartCount > 0 && (
                  <span className="px-2 py-0.5 bg-brand-500 text-white text-xs font-bold rounded-full">
                    {cartCount}
                  </span>
                )}
              </Link>
              <Link
                to="/wishlist"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-brand-50 dark:hover:bg-slate-800"
              >
                <span>My Wishlist</span>
                {wishlistCount > 0 && (
                  <span className="px-2 py-0.5 bg-rose-500 text-white text-xs font-bold rounded-full">
                    {wishlistCount}
                  </span>
                )}
              </Link>
              <Link
                to="/about"
                onClick={() => setIsMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-brand-50 dark:hover:bg-slate-800"
              >
                About Us
              </Link>
              <Link
                to="/contact"
                onClick={() => setIsMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-brand-50 dark:hover:bg-slate-800"
              >
                Contact
              </Link>

              {userInfo?.role === 'admin' && (
                <Link
                  to="/admin/dashboard"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-lg text-sm font-bold text-amber-700 bg-amber-50 dark:bg-amber-500/20 dark:text-amber-300"
                >
                  Admin Dashboard
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;

import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Sparkles,
  ArrowRight,
  Code,
  Cpu,
  BookOpen,
  TrendingUp,
  Smile,
  User,
  Star,
  Award,
  Zap,
  CheckCircle2,
  Tag
} from 'lucide-react';
import BookCard from '../components/BookCard';
import { BookGridSkeleton } from '../components/Loader';
import {
  fetchFeaturedBooks,
  fetchBestSellers,
  fetchNewArrivals
} from '../redux/slices/bookSlice';
import { fetchCategories } from '../redux/slices/adminSlice';

const categoryIcons = {
  Programming: Code,
  'Computer Science': Cpu,
  Fiction: BookOpen,
  Business: TrendingUp,
  'Self Help': Smile,
  Biography: User
};

const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { featuredBooks, bestSellers, newArrivals, loading } = useSelector(
    (state) => state.books
  );
  const { categories } = useSelector((state) => state.admin);

  useEffect(() => {
    dispatch(fetchFeaturedBooks());
    dispatch(fetchBestSellers());
    dispatch(fetchNewArrivals());
    dispatch(fetchCategories());
  }, [dispatch]);

  return (
    <div className="space-y-16 sm:space-y-24 pb-16">
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden pt-8 pb-16 lg:py-20">
        {/* Background decorative blurs */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-brand-300/30 dark:bg-brand-500/10 rounded-full blur-3xl pointer-events-none -z-10" />
        <div className="absolute top-1/3 right-10 w-[300px] h-[300px] bg-amber-400/15 rounded-full blur-2xl pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-brand-100/90 dark:bg-brand-500/10 border border-brand-200 dark:border-brand-500/20 text-brand-800 dark:text-brand-300 text-xs font-bold tracking-wide">
                <Sparkles className="w-3.5 h-3.5 text-brand-500" />
                <span>Special Deals: Genuine Editions Starting at ₹59 to ₹199</span>
              </div>

              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-white leading-[1.15] tracking-tight">
                Discover Your Next <br className="hidden sm:inline" />
                <span className="bg-gradient-to-r from-brand-500 via-amber-500 to-orange-500 bg-clip-text text-transparent">
                  Great Read
                </span> Today.
              </h1>

              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                From bestselling programming bibles to gripping literary fiction and transformative personal growth manuals. Fuel your curiosity with authentic editions delivered to your doorstep.
              </p>

              {/* Call to Actions */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <Link
                  to="/books"
                  className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-brand-500 hover:bg-brand-600 text-white font-bold text-sm shadow-lg shadow-brand-500/25 transition-all hover:scale-105 flex items-center justify-center space-x-2"
                >
                  <span>Browse All Books (₹59 - ₹199)</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/books?category=programming"
                  className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-white dark:bg-slate-800 hover:bg-brand-50 dark:hover:bg-slate-700 border border-brand-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-sm shadow-xs transition-all flex items-center justify-center space-x-2"
                >
                  <Code className="w-4 h-4 text-brand-500" />
                  <span>Tech & Coding Picks</span>
                </Link>
              </div>

              {/* Trust Metric Badges */}
              <div className="pt-6 border-t border-brand-200/60 dark:border-slate-800 grid grid-cols-3 gap-4 max-w-lg mx-auto lg:mx-0 text-center">
                <div>
                  <p className="text-xl sm:text-2xl font-bold font-serif text-slate-900 dark:text-white">10k+</p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Original Books</p>
                </div>
                <div>
                  <p className="text-xl sm:text-2xl font-bold font-serif text-slate-900 dark:text-white">4.9/5</p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Customer Rating</p>
                </div>
                <div>
                  <p className="text-xl sm:text-2xl font-bold font-serif text-slate-900 dark:text-white">₹59 - ₹199</p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Affordable Pricing</p>
                </div>
              </div>
            </div>

            {/* Right Hero Visual Showcase */}
            <div className="lg:col-span-5 relative flex justify-center">
              <div className="relative w-full max-w-md">
                {/* Main Floating Book */}
                <div className="relative z-20 bg-white dark:bg-slate-800 p-4 rounded-3xl shadow-2xl border border-brand-100 dark:border-slate-700 transform -rotate-2 hover:rotate-0 transition-transform duration-500">
                  <img
                    src="https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=800"
                    alt="Featured Book"
                    className="w-full h-80 object-cover rounded-2xl shadow-book"
                  />
                  <div className="p-4 flex items-center justify-between">
                    <div>
                      <p className="text-xs text-brand-500 font-bold uppercase tracking-wider">Editor's Pick of the Week</p>
                      <h4 className="font-serif font-bold text-slate-900 dark:text-white text-sm mt-0.5">Atomic Habits</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400">James Clear</p>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-1 rounded-lg">
                        ₹99 <span className="line-through text-slate-400 font-normal">₹149</span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Floating Floating Pill Badges */}
                <div className="absolute -top-4 -left-6 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-4 py-2.5 rounded-2xl shadow-xl border border-brand-100 dark:border-slate-800 flex items-center space-x-2.5">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-500/20 flex items-center justify-center text-emerald-600">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 font-semibold uppercase">Bestseller</p>
                    <p className="text-xs font-bold text-slate-800 dark:text-white">Clean Code (₹149)</p>
                  </div>
                </div>

                <div className="absolute -bottom-6 -right-6 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-4 py-2.5 rounded-2xl shadow-xl border border-brand-100 dark:border-slate-800 flex items-center space-x-2.5">
                  <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-500/20 flex items-center justify-center text-amber-600">
                    <Zap className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 font-semibold uppercase">Budget Reads</p>
                    <p className="text-xs font-bold text-slate-800 dark:text-white">Under ₹99 Store</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Browse by Popular Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8">
          <div>
            <span className="text-xs font-bold text-brand-500 uppercase tracking-wider">Handpicked Genres</span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mt-1">
              Explore Popular Categories
            </h2>
          </div>
          <Link
            to="/books"
            className="text-xs font-bold text-brand-600 dark:text-brand-400 hover:text-brand-800 flex items-center space-x-1 mt-2 sm:mt-0 transition-colors"
          >
            <span>View All Categories</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {(categories.length > 0 ? categories : [
            { name: 'Programming', slug: 'programming', bookCount: 6 },
            { name: 'Computer Science', slug: 'computer-science', bookCount: 4 },
            { name: 'Fiction', slug: 'fiction', bookCount: 5 },
            { name: 'Business', slug: 'business', bookCount: 4 },
            { name: 'Self Help', slug: 'self-help', bookCount: 4 },
            { name: 'Biography', slug: 'biography', bookCount: 3 },
          ]).map((cat) => {
            const IconComponent = categoryIcons[cat.name] || BookOpen;
            return (
              <button
                key={cat.slug || cat.name}
                onClick={() => navigate(`/books?category=${encodeURIComponent(cat.slug || cat.name)}`)}
                className="group p-5 bg-white dark:bg-slate-800/90 rounded-2xl border border-brand-200/60 dark:border-slate-700 hover:border-brand-500 hover:shadow-lg transition-all duration-200 flex flex-col items-center text-center space-y-3"
              >
                <div className="w-12 h-12 rounded-2xl bg-brand-50 dark:bg-slate-700/60 group-hover:bg-brand-500 text-brand-600 group-hover:text-white flex items-center justify-center transition-colors duration-200">
                  <IconComponent className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-xs text-slate-800 dark:text-white group-hover:text-brand-500 transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-0.5 font-medium">
                    {cat.bookCount || 0} books
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* 3. Featured Books Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-md bg-amber-100 dark:bg-amber-500/10 text-amber-800 dark:text-amber-300 text-[11px] font-bold uppercase tracking-wider mb-1">
              <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
              <span>Editor's Showcase</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
              Featured Books
            </h2>
          </div>
          <Link
            to="/books?featured=true"
            className="text-xs font-bold text-brand-600 dark:text-brand-400 hover:text-brand-800 flex items-center space-x-1"
          >
            <span>See More</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <BookGridSkeleton count={4} />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {featuredBooks.slice(0, 4).map((book) => (
              <BookCard key={book._id} book={book} />
            ))}
          </div>
        )}
      </section>

      {/* 4. Special Promotional Deal Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-brand-950 to-brand-900 p-8 sm:p-12 text-white shadow-2xl">
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-80 h-80 bg-brand-500/20 rounded-full blur-3xl" />
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            <div className="md:col-span-8 space-y-4">
              <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-brand-500/20 border border-brand-500/30 text-brand-300 text-xs font-bold uppercase tracking-wider">
                <Tag className="w-3.5 h-3.5" />
                <span>Special Reader Festival (₹59 - ₹199)</span>
              </span>
              <h3 className="font-serif text-2xl sm:text-4xl font-bold leading-tight">
                Upgrade Your Personal Library for Less Than ₹200!
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
                Get massive discounts on Clean Code, System Design, Algorithms, and Fiction bestsellers. Verified prints with free bookmarks included.
              </p>
              <div className="pt-2">
                <Link
                  to="/books"
                  className="inline-flex items-center space-x-2 px-6 py-3 rounded-full bg-brand-500 hover:bg-brand-400 text-white font-extrabold text-xs shadow-lg transition-all hover:scale-105"
                >
                  <span>Explore All ₹59 - ₹199 Books</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            <div className="md:col-span-4 flex justify-center">
              <div className="relative w-48 h-64 bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 shadow-2xl flex flex-col items-center justify-center text-center">
                <Award className="w-12 h-12 text-amber-400 mb-2" />
                <span className="text-3xl font-extrabold font-serif text-white">₹59+</span>
                <span className="text-xs text-amber-200 mt-1 font-semibold">Unbeatable Pricing</span>
                <span className="text-[10px] text-slate-300 mt-2">Free shipping on orders above ₹500</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Best Sellers Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <span className="text-xs font-bold text-brand-500 uppercase tracking-wider">Trending Now</span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mt-1">
              Top Best Sellers
            </h2>
          </div>
          <Link
            to="/books?bestseller=true"
            className="text-xs font-bold text-brand-600 dark:text-brand-400 hover:text-brand-800 flex items-center space-x-1"
          >
            <span>Explore All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {bestSellers.slice(0, 4).map((book) => (
            <BookCard key={book._id} book={book} />
          ))}
        </div>
      </section>

      {/* 6. New Arrivals Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Just Added</span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mt-1">
              Fresh New Arrivals
            </h2>
          </div>
          <Link
            to="/books?sort=newest"
            className="text-xs font-bold text-brand-600 dark:text-brand-400 hover:text-brand-800 flex items-center space-x-1"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {newArrivals.slice(0, 4).map((book) => (
            <BookCard key={book._id} book={book} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;

import React from 'react';
import { BookOpen, ShieldCheck, Heart, Award, Sparkles, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

const About = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Hero Header */}
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-brand-100 dark:bg-brand-500/20 text-brand-800 dark:text-brand-300 text-xs font-bold uppercase tracking-wider border border-brand-200 dark:border-brand-500/30">
          <Sparkles className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />
          <span>Our Story & Mission</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-slate-900 dark:text-white leading-tight">
          Empowering Curious Minds Through Great Literature.
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          BookCart was founded with a singular conviction: access to quality books, programming references, and transformative ideas should be seamless, elegant, and inspiring.
        </p>
      </div>

      {/* Values Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-brand-200/80 dark:border-slate-800 shadow-xs space-y-3 text-center">
          <div className="w-12 h-12 rounded-2xl bg-brand-50 dark:bg-brand-500/10 text-brand-500 flex items-center justify-center mx-auto shadow-xs">
            <BookOpen className="w-6 h-6" />
          </div>
          <h3 className="font-serif font-bold text-base text-slate-900 dark:text-white">Curated Quality</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Every title in our catalog is hand-selected across software craftsmanship, technology, classic fiction, and self-mastery.
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-brand-200/80 dark:border-slate-800 shadow-xs space-y-3 text-center">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-xs">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="font-serif font-bold text-base text-slate-900 dark:text-white">100% Genuine Editions</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            We partner directly with leading international and national publishing houses to guarantee original prints.
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-brand-200/80 dark:border-slate-800 shadow-xs space-y-3 text-center">
          <div className="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto shadow-xs">
            <Heart className="w-6 h-6" />
          </div>
          <h3 className="font-serif font-bold text-base text-slate-900 dark:text-white">Reader-First Community</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            From verified reader reviews to lightning customer support, our mission is to build the ultimate haven for book lovers.
          </p>
        </div>
      </div>

      {/* CTA Box */}
      <div className="bg-gradient-to-tr from-brand-950 via-slate-900 to-brand-900 text-white p-8 sm:p-12 rounded-3xl text-center space-y-4 shadow-xl border border-brand-500/20">
        <h2 className="font-serif text-2xl sm:text-3xl font-bold">
          Ready to Discover Your Next Favorite Book?
        </h2>
        <p className="text-xs text-slate-300 max-w-md mx-auto">
          Explore our collection of titles priced between ₹59 and ₹199 with fast delivery across all genres.
        </p>
        <div className="pt-2">
          <Link
            to="/books"
            className="inline-block px-8 py-3 rounded-full bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs shadow-lg shadow-brand-500/30 transition-all hover:scale-105"
          >
            Start Browsing Books
          </Link>
        </div>
      </div>
    </div>
  );
};

export default About;

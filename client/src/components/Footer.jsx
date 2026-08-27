import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Heart, Mail, Phone, MapPin, ShieldCheck, Truck, RotateCcw, Award } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 transition-colors">
      {/* Value Proposition Highlights Bar */}
      <div className="border-b border-slate-800 bg-slate-950/60 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-brand-500/10 text-brand-400 flex items-center justify-center flex-shrink-0">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">Free Shipping</h4>
                <p className="text-[11px] text-slate-400">On all orders above ₹500</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-brand-500/10 text-brand-400 flex items-center justify-center flex-shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">100% Genuine</h4>
                <p className="text-[11px] text-slate-400">Direct from publishers</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-brand-500/10 text-brand-400 flex items-center justify-center flex-shrink-0">
                <RotateCcw className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">7-Day Returns</h4>
                <p className="text-[11px] text-slate-400">Hassle-free replacement</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-brand-500/10 text-brand-400 flex items-center justify-center flex-shrink-0">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">Best Prices</h4>
                <p className="text-[11px] text-slate-400">Priced between ₹59 - ₹199</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 to-amber-500 flex items-center justify-center text-white shadow-md">
                <BookOpen className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white font-serif">
                Book<span className="text-brand-500">Cart</span>
              </span>
            </Link>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              Your premier online destination for authentic technology, computer science, fiction, self-help, and business books priced accessibly between ₹59 and ₹199.
            </p>
            <div className="flex items-center space-x-4 text-xs text-slate-400 pt-2">
              <span className="flex items-center space-x-1">
                <MapPin className="w-3.5 h-3.5 text-brand-400" />
                <span>Bengaluru, India</span>
              </span>
              <span className="flex items-center space-x-1">
                <Mail className="w-3.5 h-3.5 text-brand-400" />
                <span>support@bookcart.com</span>
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              Explore Store
            </h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/books" className="hover:text-brand-400 transition-colors">Browse Catalog (₹59 - ₹199)</Link></li>
              <li><Link to="/books?bestseller=true" className="hover:text-brand-400 transition-colors">Bestsellers</Link></li>
              <li><Link to="/books?featured=true" className="hover:text-brand-400 transition-colors">Featured Editions</Link></li>
              <li><Link to="/about" className="hover:text-brand-400 transition-colors">About Us</Link></li>
            </ul>
          </div>

          {/* Top Genres */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              Top Categories
            </h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/books?category=programming" className="hover:text-brand-400 transition-colors">Programming</Link></li>
              <li><Link to="/books?category=computer-science" className="hover:text-brand-400 transition-colors">Computer Science</Link></li>
              <li><Link to="/books?category=fiction" className="hover:text-brand-400 transition-colors">Literary Fiction</Link></li>
              <li><Link to="/books?category=self-help" className="hover:text-brand-400 transition-colors">Self Help & Habits</Link></li>
            </ul>
          </div>

          {/* Customer Account */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              Account & Help
            </h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/profile" className="hover:text-brand-400 transition-colors">My Profile</Link></li>
              <li><Link to="/orders" className="hover:text-brand-400 transition-colors">Order Tracking</Link></li>
              <li><Link to="/wishlist" className="hover:text-brand-400 transition-colors">Reading Wishlist</Link></li>
              <li><Link to="/contact" className="hover:text-brand-400 transition-colors">Help & Contact</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="mt-12 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
          <p>© {new Date().getFullYear()} BookCart Online Bookstore. All rights reserved.</p>
          <p className="flex items-center space-x-1 mt-2 sm:mt-0">
            <span>Crafted with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            <span>using MERN Stack & Razorpay</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

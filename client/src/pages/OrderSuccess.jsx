import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle, Package, ArrowRight, BookOpen, ShieldCheck, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

const OrderSuccess = () => {
  const { orderId } = useParams();

  useEffect(() => {
    // Launch celebratory confetti
    try {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 }
      });
    } catch (e) {
      // ignore
    }
  }, []);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center space-y-8">
      {/* Celebration Icon */}
      <div className="relative inline-block">
        <div className="w-24 h-24 rounded-full bg-emerald-100 dark:bg-emerald-500/20 border-4 border-emerald-300 dark:border-emerald-500/40 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shadow-xl mx-auto animate-bounce">
          <CheckCircle className="w-12 h-12 stroke-[2.5]" />
        </div>
      </div>

      <div className="space-y-2">
        <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-500/10 px-3.5 py-1 rounded-full border border-emerald-200 dark:border-emerald-500/30">
          🎉 Payment Verified & Order Confirmed
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white">
          Thank You for Your Order!
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
          Your payment was processed successfully. We have sent your order to our warehouse to pack your books and prepare express dispatch.
        </p>
      </div>

      {/* Order Reference Box */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-brand-200/80 dark:border-slate-800 shadow-lg max-w-md mx-auto text-left space-y-3">
        <div className="flex justify-between items-center text-xs pb-3 border-b border-slate-100 dark:border-slate-800">
          <span className="text-slate-400">Order Reference:</span>
          <span className="font-mono font-bold text-brand-600 dark:text-brand-400">{orderId}</span>
        </div>
        <div className="flex justify-between items-center text-xs pb-3 border-b border-slate-100 dark:border-slate-800">
          <span className="text-slate-400">Payment Status:</span>
          <span className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center space-x-1">
            <ShieldCheck className="w-3.5 h-3.5 inline" />
            <span>Paid & Confirmed</span>
          </span>
        </div>
        <div className="flex justify-between items-center text-xs">
          <span className="text-slate-400">Estimated Delivery:</span>
          <span className="font-bold text-slate-800 dark:text-slate-200">2 - 3 Business Days</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
        {orderId && (
          <Link
            to={`/orders/${orderId}`}
            className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs shadow-lg shadow-brand-500/25 flex items-center justify-center space-x-2 transition-all hover:scale-105"
          >
            <Package className="w-4 h-4" />
            <span>Track Order Timeline</span>
          </Link>
        )}
        <Link
          to="/books"
          className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-white dark:bg-slate-900 hover:bg-brand-50 dark:hover:bg-slate-800 border border-brand-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 font-semibold text-xs shadow-xs flex items-center justify-center space-x-2 transition-all"
        >
          <BookOpen className="w-4 h-4 text-brand-500" />
          <span>Explore More Books</span>
        </Link>
      </div>
    </div>
  );
};

export default OrderSuccess;

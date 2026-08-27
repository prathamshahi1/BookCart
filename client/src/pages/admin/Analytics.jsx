import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { BarChart3, TrendingUp, DollarSign, Award, FolderTree, Star } from 'lucide-react';
import { fetchAnalytics } from '../../redux/slices/adminSlice';
import { Loader } from '../../components/Loader';

const COLORS = ['#f59e0b', '#10b981', '#6366f1', '#ec4899', '#8b5cf6', '#14b8a6'];

const Analytics = () => {
  const dispatch = useDispatch();
  const { analytics, loading } = useSelector((state) => state.admin);

  useEffect(() => {
    dispatch(fetchAnalytics());
  }, [dispatch]);

  if (loading || !analytics) {
    return <Loader message="Generating business intelligence charts..." fullScreen />;
  }

  const {
    salesChartData = [],
    orderStatusDistribution = [],
    categoryDistribution = [],
    topSellingBooks = []
  } = analytics;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="pb-6 border-b border-slate-800">
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white">
          Store Analytics & Intelligence
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          In-depth revenue trends, category performance, and bestseller rankings
        </p>
      </div>

      {/* 1. Monthly Revenue Area Chart */}
      <div className="bg-slate-800/80 p-6 sm:p-8 rounded-3xl border border-slate-700 space-y-4 shadow-sm">
        <div className="flex items-center justify-between pb-3 border-b border-slate-700">
          <div className="flex items-center space-x-2 text-amber-400">
            <TrendingUp className="w-5 h-5" />
            <h2 className="font-serif font-bold text-base text-white">Monthly Revenue Trends (₹)</h2>
          </div>
          <span className="text-xs text-slate-400">Past 6 Months Performance</span>
        </div>

        <div className="h-72 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={salesChartData}>
              <defs>
                <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} />
              <YAxis stroke="#94a3b8" fontSize={11} tickFormatter={(v) => `₹${v}`} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  borderColor: '#334155',
                  borderRadius: '12px',
                  color: '#fff',
                  fontSize: '12px'
                }}
                formatter={(val) => [`₹${val}`, 'Revenue']}
              />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#f59e0b"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorRev)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 2. Double Charts: Category Distribution & Top Selling Books */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Category Share */}
        <div className="lg:col-span-6 bg-slate-800/80 p-6 sm:p-8 rounded-3xl border border-slate-700 space-y-4">
          <div className="flex items-center space-x-2 text-emerald-400 pb-3 border-b border-slate-700">
            <FolderTree className="w-5 h-5" />
            <h2 className="font-serif font-bold text-base text-white">Books by Category</h2>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryDistribution}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} interval={0} angle={-15} textAnchor="end" />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '12px',
                    color: '#fff',
                    fontSize: '12px'
                  }}
                />
                <Bar dataKey="count" fill="#10b981" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top 5 Best-Selling Titles */}
        <div className="lg:col-span-6 bg-slate-800/80 p-6 sm:p-8 rounded-3xl border border-slate-700 space-y-4">
          <div className="flex items-center space-x-2 text-amber-400 pb-3 border-b border-slate-700">
            <Award className="w-5 h-5" />
            <h2 className="font-serif font-bold text-base text-white">Top 5 Best-Selling Books</h2>
          </div>

          <div className="space-y-3">
            {topSellingBooks.map((book, idx) => (
              <div
                key={book._id}
                className="p-3 bg-slate-900/70 rounded-2xl border border-slate-700/60 flex items-center justify-between"
              >
                <div className="flex items-center space-x-3 min-w-0">
                  <span className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-300 flex items-center justify-center font-bold text-xs flex-shrink-0">
                    {idx + 1}
                  </span>
                  <img
                    src={book.image}
                    alt={book.title}
                    className="w-8 h-12 object-cover rounded shadow-xs flex-shrink-0"
                  />
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-white truncate max-w-[200px]">{book.title}</p>
                    <p className="text-[10px] text-slate-400">{book.author}</p>
                  </div>
                </div>

                <div className="text-right flex-shrink-0">
                  <span className="text-xs font-bold text-amber-400 block">
                    ★ {book.rating || 0}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    {book.numReviews || 0} reviews
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;

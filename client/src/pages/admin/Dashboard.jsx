import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  DollarSign,
  ShoppingBag,
  BookOpen,
  Users,
  AlertTriangle,
  Clock,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  ExternalLink
} from 'lucide-react';
import { Loader } from '../../components/Loader';
import { fetchDashboardStats } from '../../redux/slices/adminSlice';

const Dashboard = () => {
  const dispatch = useDispatch();
  const { dashboardStats, loading } = useSelector((state) => state.admin);

  useEffect(() => {
    dispatch(fetchDashboardStats());
  }, [dispatch]);

  if (loading || !dashboardStats) {
    return <Loader message="Loading administrator dashboard..." fullScreen />;
  }

  const {
    totalRevenue = 0,
    totalOrders = 0,
    totalBooks = 0,
    totalUsers = 0,
    pendingOrders = 0,
    deliveredOrders = 0,
    lowStockCount = 0,
    recentOrders = [],
    recentUsers = [],
    lowStockBooks = []
  } = dashboardStats;

  return (
    <div className="space-y-8">
      {/* Dashboard Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white">
            Admin Store Overview
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time bookstore KPIs, revenue statistics, orders, and inventory status
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Link
            to="/admin/books/add"
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold shadow-md shadow-amber-500/20 transition-all hover:scale-105"
          >
            + Add New Book
          </Link>
          <Link
            to="/admin/analytics"
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold border border-slate-700 transition-all"
          >
            View Analytics
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total Revenue */}
        <div className="p-6 bg-slate-800/80 rounded-3xl border border-slate-700/80 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Revenue</span>
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <p className="font-serif text-2xl font-extrabold text-white">₹{totalRevenue}</p>
          <div className="flex items-center space-x-1 text-[11px] text-emerald-400 font-semibold">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Captured from verified purchases</span>
          </div>
        </div>

        {/* Total Orders */}
        <div className="p-6 bg-slate-800/80 rounded-3xl border border-slate-700/80 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Orders</span>
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
              <ShoppingBag className="w-5 h-5" />
            </div>
          </div>
          <p className="font-serif text-2xl font-extrabold text-white">{totalOrders}</p>
          <div className="flex items-center space-x-2 text-[11px] text-slate-400">
            <span className="text-amber-400 font-semibold">{pendingOrders} Pending</span>
            <span>•</span>
            <span className="text-emerald-400 font-semibold">{deliveredOrders} Delivered</span>
          </div>
        </div>

        {/* Total Books */}
        <div className="p-6 bg-slate-800/80 rounded-3xl border border-slate-700/80 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Books Catalog</span>
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </div>
          </div>
          <p className="font-serif text-2xl font-extrabold text-white">{totalBooks}</p>
          <p className="text-[11px] text-slate-400">Titles live across 6 categories</p>
        </div>

        {/* Total Users */}
        <div className="p-6 bg-slate-800/80 rounded-3xl border border-slate-700/80 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Registered Users</span>
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <p className="font-serif text-2xl font-extrabold text-white">{totalUsers}</p>
          <p className="text-[11px] text-slate-400">Active customer accounts</p>
        </div>
      </div>

      {/* Main Grid: Recent Orders & Inventory Warning */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Recent Orders Table */}
        <div className="lg:col-span-8 bg-slate-800/80 p-6 sm:p-8 rounded-3xl border border-slate-700 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-700">
            <h2 className="font-serif font-bold text-base text-white">Recent Customer Orders</h2>
            <Link
              to="/admin/orders"
              className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center space-x-1"
            >
              <span>Manage Orders</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-slate-400 uppercase tracking-wider border-b border-slate-700/60 font-semibold">
                <tr>
                  <th className="py-3 px-2">Order ID</th>
                  <th className="py-3 px-2">Customer</th>
                  <th className="py-3 px-2">Items</th>
                  <th className="py-3 px-2">Amount</th>
                  <th className="py-3 px-2">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/40 text-slate-300">
                {recentOrders.map((ord) => (
                  <tr key={ord._id} className="hover:bg-slate-700/30">
                    <td className="py-3 px-2 font-mono text-[11px] text-amber-400">
                      {ord._id.substring(0, 10)}...
                    </td>
                    <td className="py-3 px-2 font-medium text-white">
                      {ord.user?.name || ord.shippingAddress?.fullName || 'Customer'}
                    </td>
                    <td className="py-3 px-2">{ord.orderItems?.length || 0} books</td>
                    <td className="py-3 px-2 font-bold text-white">₹{ord.totalPrice}</td>
                    <td className="py-3 px-2">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        ord.orderStatus === 'Delivered'
                          ? 'bg-emerald-500/20 text-emerald-300'
                          : ord.orderStatus === 'Cancelled'
                          ? 'bg-rose-500/20 text-rose-300'
                          : 'bg-amber-500/20 text-amber-300'
                      }`}>
                        {ord.orderStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Low Stock Warning Box */}
        <div className="lg:col-span-4 bg-slate-800/80 p-6 sm:p-8 rounded-3xl border border-slate-700 space-y-4">
          <div className="flex items-center space-x-2 text-amber-400 pb-3 border-b border-slate-700">
            <AlertTriangle className="w-5 h-5 flex-shrink-0" />
            <h2 className="font-serif font-bold text-base text-white">
              Low Stock Alerts ({lowStockCount})
            </h2>
          </div>

          <div className="space-y-3">
            {lowStockBooks.length > 0 ? (
              lowStockBooks.map((b) => (
                <div
                  key={b._id}
                  className="p-3 bg-slate-900/60 rounded-2xl border border-slate-700/60 flex items-center justify-between"
                >
                  <div className="flex items-center space-x-3 min-w-0">
                    <img
                      src={b.image}
                      alt={b.title}
                      className="w-8 h-12 object-cover rounded shadow-xs flex-shrink-0"
                    />
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-white truncate">{b.title}</p>
                      <p className="text-[10px] text-slate-400">{b.category}</p>
                    </div>
                  </div>
                  <span className="px-2 py-1 rounded-lg bg-rose-500/20 text-rose-300 text-xs font-extrabold flex-shrink-0 ml-2">
                    {b.stock} left
                  </span>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-400 py-4 text-center">
                All inventory levels healthy. No books below 5 stock count.
              </p>
            )}
          </div>

          <Link
            to="/admin/books"
            className="block text-center w-full py-2.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-white text-xs font-bold transition-all"
          >
            Manage Inventory
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

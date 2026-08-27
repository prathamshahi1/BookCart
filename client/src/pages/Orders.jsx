import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Package, Clock, ArrowRight, CheckCircle2, XCircle, Truck, ShieldCheck, Sparkles, Banknote } from 'lucide-react';
import EmptyState from '../components/EmptyState';
import { Loader } from '../components/Loader';
import { getMyOrders } from '../redux/slices/orderSlice';

const deliveryStatusLabels = {
  Pending: { text: 'Order Placed', class: 'bg-amber-100 dark:bg-amber-500/20 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-500/30' },
  Processing: { text: 'Packing in Warehouse', class: 'bg-blue-100 dark:bg-blue-500/20 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-500/30' },
  Shipped: { text: 'Out for Delivery', class: 'bg-indigo-100 dark:bg-indigo-500/20 text-indigo-800 dark:text-indigo-300 border-indigo-200 dark:border-indigo-500/30' },
  Delivered: { text: 'Delivered', class: 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-500/30' },
  Cancelled: { text: 'Cancelled', class: 'bg-rose-100 dark:bg-rose-500/20 text-rose-800 dark:text-rose-300 border-rose-200 dark:border-rose-500/30' }
};

const FALLBACK_COVER = 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=600';

const Orders = () => {
  const dispatch = useDispatch();
  const { orders = [], loading = false } = useSelector((state) => state.order || state.orders || {});

  useEffect(() => {
    dispatch(getMyOrders());
  }, [dispatch]);

  const safeOrders = Array.isArray(orders) ? orders : [];

  if (loading && safeOrders.length === 0) {
    return <Loader message="Fetching your order history..." fullScreen />;
  }

  if (safeOrders.length === 0) {
    return (
      <EmptyState
        type="orders"
        title="No Orders Placed Yet"
        description="You haven't purchased any books yet. Once you complete checkout, your order and tracking details will appear here."
        actionText="Find Your First Book"
        actionLink="/books"
      />
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
          My Order History
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Track packages, view receipts, and submit verified book reviews
        </p>
      </div>

      <div className="space-y-5">
        {safeOrders.map((order) => {
          const deliveryInfo = deliveryStatusLabels[order.orderStatus] || {
            text: order.orderStatus || 'Processing',
            class: 'bg-slate-100 text-slate-800 border-slate-200'
          };

          const isPaid = Boolean(order.isPaid || (order.paymentResult && order.paymentResult.status === 'captured') || order.paymentMethod?.includes('Instant'));

          return (
            <div
              key={order._id}
              className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-brand-200/70 dark:border-slate-800 shadow-xs hover:shadow-md transition-all space-y-4"
            >
              {/* Order Meta Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800 text-xs">
                <div className="space-y-0.5">
                  <div className="flex items-center space-x-2">
                    <span className="text-slate-400">Order ID:</span>
                    <span className="font-mono font-bold text-brand-600 dark:text-brand-400">{order._id}</span>
                  </div>
                  <p className="text-slate-400 text-[11px]">
                    Placed on {new Date(order.createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2.5">
                  {/* Payment Status Badge */}
                  {isPaid ? (
                    <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/30">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>PAID ONLINE</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 dark:bg-amber-500/20 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-500/30">
                      <Banknote className="w-3.5 h-3.5" />
                      <span>COD PENDING</span>
                    </span>
                  )}

                  {/* Delivery Status Badge */}
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold border uppercase tracking-wider ${deliveryInfo.class}`}
                  >
                    {deliveryInfo.text}
                  </span>

                  <span className="font-serif font-extrabold text-base text-slate-900 dark:text-white pl-2">
                    ₹{order.totalPrice}
                  </span>
                </div>
              </div>

              {/* Items Preview */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {order.orderItems?.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center space-x-3 p-2.5 rounded-2xl bg-brand-50/40 dark:bg-slate-800/60 border border-brand-100 dark:border-slate-700"
                  >
                    <img
                      src={item.image || FALLBACK_COVER}
                      alt={item.title}
                      onError={(e) => { e.target.onerror = null; e.target.src = FALLBACK_COVER; }}
                      className="w-10 h-14 object-cover rounded-md flex-shrink-0 shadow-xs"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-slate-800 dark:text-white truncate">{item.title}</p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        Qty: {item.quantity} × ₹{item.price}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* View Details Action */}
              <div className="pt-2 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">
                  Payment Method: <strong className="text-slate-600 dark:text-slate-300">{order.paymentMethod || 'Online'}</strong>
                </span>
                <Link
                  to={`/orders/${order._id}`}
                  className="inline-flex items-center space-x-1.5 text-xs font-bold text-brand-600 dark:text-brand-400 hover:text-brand-800 bg-brand-50 dark:bg-slate-800 px-4 py-2 rounded-xl transition-all"
                >
                  <span>View Details & Tracking</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Orders;

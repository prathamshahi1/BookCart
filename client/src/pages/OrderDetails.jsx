import React, { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Package,
  MapPin,
  CreditCard,
  CheckCircle2,
  Clock,
  Truck,
  ArrowLeft,
  XCircle,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { Loader } from '../components/Loader';
import { getOrderDetails, cancelOrder } from '../redux/slices/orderSlice';
import toast from 'react-hot-toast';

const FALLBACK_COVER = 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=600';

const timelineSteps = [
  { key: 'Pending', label: 'Order Placed', icon: Clock },
  { key: 'Processing', label: 'Packed in Warehouse', icon: Package },
  { key: 'Shipped', label: 'Out for Delivery', icon: Truck },
  { key: 'Delivered', label: 'Delivered', icon: CheckCircle2 }
];

const OrderDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { currentOrder, loading } = useSelector((state) => state.order || state.orders || {});

  useEffect(() => {
    if (id) {
      dispatch(getOrderDetails(id));
    }
  }, [id, dispatch]);

  if (loading || !currentOrder) {
    return <Loader message="Loading order tracking timeline..." fullScreen />;
  }

  const getStepIndex = (status) => {
    switch (status) {
      case 'Pending': return 0;
      case 'Processing': return 1;
      case 'Shipped': return 2;
      case 'Delivered': return 3;
      default: return 1;
    }
  };

  const currentStepIndex = getStepIndex(currentOrder.orderStatus);
  const isPaid = Boolean(currentOrder.isPaid || currentOrder.paymentMethod?.includes('Instant') || (currentOrder.paymentResult && currentOrder.paymentResult.status === 'captured'));

  const handleCancelOrder = () => {
    if (window.confirm('Are you sure you want to cancel this order?')) {
      dispatch(cancelOrder(currentOrder._id))
        .unwrap()
        .then(() => {
          toast.success('Order has been cancelled');
        })
        .catch((err) => {
          toast.error(err || 'Failed to cancel order');
        });
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Top Navigation */}
      <div className="flex items-center justify-between pb-4 border-b border-brand-200/60 dark:border-slate-800">
        <Link
          to="/orders"
          className="inline-flex items-center space-x-2 text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Orders</span>
        </Link>

        {/* Cancellation Button */}
        {['Pending', 'Processing'].includes(currentOrder.orderStatus) && (
          <button
            onClick={handleCancelOrder}
            className="px-4 py-1.5 rounded-full border border-rose-200 dark:border-rose-800 bg-rose-50 dark:bg-rose-500/10 text-rose-700 dark:text-rose-300 text-xs font-bold hover:bg-rose-100 transition-all"
          >
            Cancel Order
          </button>
        )}
      </div>

      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-brand-200 dark:border-slate-800 shadow-xs">
        <div>
          <span className="text-[11px] font-bold text-brand-600 dark:text-brand-400 uppercase tracking-widest block">
            Order Reference
          </span>
          <h1 className="font-mono text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white mt-0.5">
            {currentOrder._id}
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Placed on {new Date(currentOrder.createdAt).toLocaleString()}
          </p>
        </div>

        <div className="text-right">
          <span className="text-xs text-slate-400 block">Total Amount</span>
          <span className="font-serif text-2xl font-extrabold text-brand-600 dark:text-brand-400">
            ₹{currentOrder.totalPrice}
          </span>
          <div className="mt-1">
            {isPaid ? (
              <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/30">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Payment Paid & Captured</span>
              </span>
            ) : (
              <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 dark:bg-amber-500/20 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-500/30">
                <span>Payment on Delivery (COD)</span>
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Live Status Tracking Timeline */}
      <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-brand-200/80 dark:border-slate-800 shadow-xs space-y-6">
        <h2 className="font-serif font-bold text-base text-slate-900 dark:text-white">
          Delivery Status Tracker
        </h2>

        {currentOrder.orderStatus === 'Cancelled' ? (
          <div className="p-4 bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-800 rounded-2xl flex items-center space-x-3 text-xs text-rose-800 dark:text-rose-300">
            <XCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />
            <span>This order was cancelled. Any processed refund will reflect in your account in 3-5 business days.</span>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 relative">
            {timelineSteps.map((step, idx) => {
              const Icon = step.icon;
              const isCompleted = idx <= currentStepIndex;
              const isCurrent = idx === currentStepIndex;

              return (
                <div key={step.key} className="flex flex-col items-center text-center space-y-2">
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${
                      isCompleted
                        ? 'bg-brand-500 text-white shadow-md shadow-brand-500/25'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                    } ${isCurrent ? 'ring-4 ring-brand-500/20 scale-105' : ''}`}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className={`text-xs font-bold ${
                    isCompleted ? 'text-slate-900 dark:text-white' : 'text-slate-400'
                  }`}>
                    {step.label}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Ordered Books */}
        <div className="lg:col-span-8 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-brand-200/80 dark:border-slate-800 shadow-xs space-y-4">
          <h2 className="font-serif font-bold text-base text-slate-900 dark:text-white pb-3 border-b border-slate-100 dark:border-slate-800">
            Purchased Books ({currentOrder.orderItems.length})
          </h2>

          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {currentOrder.orderItems.map((item, idx) => (
              <div
                key={idx}
                className="py-4 first:pt-0 last:pb-0 flex items-center justify-between gap-4"
              >
                <div className="flex items-center space-x-3">
                  <img
                    src={item.image || FALLBACK_COVER}
                    alt={item.title}
                    onError={(e) => { e.target.onerror = null; e.target.src = FALLBACK_COVER; }}
                    className="w-12 h-16 object-cover rounded-lg shadow-xs"
                  />
                  <div>
                    <Link
                      to={`/books/${item.book?._id || item.book}`}
                      className="text-xs font-bold text-slate-800 dark:text-white hover:text-brand-600 dark:hover:text-brand-400 line-clamp-1 block"
                    >
                      {item.title}
                    </Link>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      Quantity: {item.quantity} × ₹{item.price}
                    </p>
                  </div>
                </div>

                <div className="text-right flex items-center space-x-4">
                  <span className="text-sm font-extrabold text-slate-900 dark:text-white">
                    ₹{item.price * item.quantity}
                  </span>
                  {currentOrder.orderStatus === 'Delivered' && (
                    <Link
                      to={`/books/${item.book?._id || item.book}`}
                      className="text-[11px] font-bold text-brand-600 bg-brand-50 dark:bg-brand-500/10 hover:bg-brand-100 px-3 py-1 rounded-full"
                    >
                      Review Book
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Shipping & Payment Summary */}
        <div className="lg:col-span-4 space-y-6">
          {/* Shipping Address */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-brand-200/80 dark:border-slate-800 shadow-xs space-y-3">
            <div className="flex items-center space-x-2 text-xs font-bold text-brand-600 dark:text-brand-400 uppercase tracking-wider">
              <MapPin className="w-4 h-4" />
              <span>Shipping Address</span>
            </div>
            <p className="text-xs font-bold text-slate-800 dark:text-white">{currentOrder.shippingAddress?.fullName}</p>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              {currentOrder.shippingAddress?.addressLine}, {currentOrder.shippingAddress?.city},{' '}
              {currentOrder.shippingAddress?.state} - {currentOrder.shippingAddress?.postalCode}
            </p>
            <p className="text-xs text-slate-400">Phone: {currentOrder.shippingAddress?.phone}</p>
          </div>

          {/* Payment Breakdown */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-brand-200/80 dark:border-slate-800 shadow-xs space-y-3 text-xs">
            <div className="flex items-center space-x-2 font-bold text-brand-600 dark:text-brand-400 uppercase tracking-wider pb-2 border-b border-slate-100 dark:border-slate-800">
              <CreditCard className="w-4 h-4" />
              <span>Payment Details</span>
            </div>
            <div className="flex justify-between text-slate-600 dark:text-slate-400">
              <span>Subtotal:</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">₹{currentOrder.subtotal}</span>
            </div>
            {currentOrder.discount > 0 && (
              <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-semibold">
                <span>Discount:</span>
                <span>- ₹{currentOrder.discount}</span>
              </div>
            )}
            <div className="flex justify-between text-slate-600 dark:text-slate-400">
              <span>Shipping:</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                {currentOrder.shippingPrice === 0 ? <strong className="text-emerald-600 dark:text-emerald-400">FREE</strong> : `₹${currentOrder.shippingPrice}`}
              </span>
            </div>
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex justify-between font-serif text-base font-extrabold text-brand-600 dark:text-brand-400">
              <span>Total Paid:</span>
              <span>₹{currentOrder.totalPrice}</span>
            </div>
            <div className="pt-2 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
              <span>Method:</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">{currentOrder.paymentMethod || 'Online Payment'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;

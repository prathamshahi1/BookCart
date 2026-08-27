import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  ShoppingBag,
  Clock,
  Eye,
  CheckCircle,
  Truck,
  XCircle,
  X,
  MapPin,
  CreditCard
} from 'lucide-react';
import { fetchAdminOrders, updateOrderStatus } from '../../redux/slices/adminSlice';
import Pagination from '../../components/Pagination';
import { Loader } from '../../components/Loader';
import toast from 'react-hot-toast';

const ManageOrders = () => {
  const dispatch = useDispatch();
  const { orders, ordersPage, ordersTotalPages, loading } = useSelector(
    (state) => state.admin
  );

  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    dispatch(fetchAdminOrders({ status: statusFilter, page: 1, limit: 10 }));
  }, [statusFilter, dispatch]);

  const handleStatusChange = (orderId, newStatus) => {
    dispatch(updateOrderStatus({ orderId, status: newStatus }))
      .unwrap()
      .then(() => {
        toast.success(`Order status updated to ${newStatus}`);
        dispatch(fetchAdminOrders({ status: statusFilter, page: ordersPage, limit: 10 }));
      })
      .catch((err) => {
        toast.error(err || 'Failed to update order status');
      });
  };

  const handlePageChange = (newPage) => {
    dispatch(fetchAdminOrders({ status: statusFilter, page: newPage, limit: 10 }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white">
            Customer Orders Management
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Track order fulfillment pipeline and update delivery statuses
          </p>
        </div>

        {/* Status Filter */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
        >
          <option value="all">All Statuses</option>
          <option value="Pending">Pending</option>
          <option value="Processing">Processing</option>
          <option value="Shipped">Shipped</option>
          <option value="Delivered">Delivered</option>
          <option value="Cancelled">Cancelled</option>
        </select>
      </div>

      {/* Orders Table */}
      <div className="bg-slate-800/80 rounded-3xl border border-slate-700 overflow-hidden shadow-xs">
        {loading ? (
          <div className="py-12">
            <Loader message="Loading orders..." />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900/60 text-slate-400 uppercase tracking-wider border-b border-slate-700 text-[11px] font-semibold">
                <tr>
                  <th className="py-3.5 px-4">Order ID</th>
                  <th className="py-3.5 px-4">Customer</th>
                  <th className="py-3.5 px-4">Date</th>
                  <th className="py-3.5 px-4">Total</th>
                  <th className="py-3.5 px-4">Payment</th>
                  <th className="py-3.5 px-4">Fulfillment Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/60 text-slate-300">
                {orders.map((ord) => (
                  <tr key={ord._id} className="hover:bg-slate-700/40 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-amber-400">
                      {ord._id.substring(0, 10)}...
                    </td>
                    <td className="py-3 px-4">
                      <p className="font-bold text-white">
                        {ord.shippingAddress?.fullName || ord.user?.name || 'Customer'}
                      </p>
                      <span className="text-[10px] text-slate-400">{ord.shippingAddress?.city}</span>
                    </td>
                    <td className="py-3 px-4 text-slate-400">
                      {new Date(ord.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4 font-bold text-white">₹{ord.totalPrice}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase ${
                          ord.isPaid
                            ? 'bg-emerald-500/20 text-emerald-300'
                            : 'bg-amber-500/20 text-amber-300'
                        }`}
                      >
                        {ord.isPaid ? 'Paid' : 'Pending'}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <select
                        value={ord.orderStatus}
                        onChange={(e) => handleStatusChange(ord._id, e.target.value)}
                        className="bg-slate-900 border border-slate-700 text-xs font-semibold rounded-lg px-2.5 py-1 text-white focus:outline-none focus:border-amber-500"
                      >
                        <option value="Pending">Pending</option>
                        <option value="Processing">Processing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => setSelectedOrder(ord)}
                        className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-700"
                        title="View Full Order"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      <Pagination
        page={ordersPage}
        pages={ordersTotalPages}
        onPageChange={handlePageChange}
      />

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-6 animate-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h3 className="font-serif font-bold text-base text-white">
                  Order Details
                </h3>
                <span className="font-mono text-[11px] text-amber-400">
                  {selectedOrder._id}
                </span>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Address */}
            <div className="p-4 bg-slate-800/80 rounded-2xl border border-slate-700 text-xs space-y-1">
              <div className="flex items-center space-x-1.5 text-amber-400 font-semibold mb-1">
                <MapPin className="w-3.5 h-3.5" />
                <span>Shipping Address</span>
              </div>
              <p className="font-bold text-white">{selectedOrder.shippingAddress?.fullName}</p>
              <p className="text-slate-300">{selectedOrder.shippingAddress?.addressLine}</p>
              <p className="text-slate-300">
                {selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.state} - {selectedOrder.shippingAddress?.postalCode}
              </p>
              <p className="text-slate-400">Phone: {selectedOrder.shippingAddress?.phone}</p>
            </div>

            {/* Ordered Items */}
            <div className="space-y-3">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                Ordered Items
              </span>
              <div className="space-y-2">
                {selectedOrder.orderItems.map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-2.5 bg-slate-800 rounded-xl border border-slate-700"
                  >
                    <div className="flex items-center space-x-3">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-8 h-12 object-cover rounded shadow-xs"
                      />
                      <div>
                        <p className="text-xs font-bold text-white truncate max-w-[200px]">{item.title}</p>
                        <p className="text-[10px] text-slate-400">Qty: {item.quantity} × ₹{item.price}</p>
                      </div>
                    </div>
                    <span className="font-bold text-xs text-white">₹{item.price * item.quantity}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Total */}
            <div className="p-4 bg-slate-800 rounded-2xl flex items-center justify-between font-bold text-sm">
              <span className="text-slate-300">Total Order Amount</span>
              <span className="font-serif text-lg text-amber-400">₹{selectedOrder.totalPrice}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageOrders;

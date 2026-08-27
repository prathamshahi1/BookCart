import Order from '../models/Order.js';
import Book from '../models/Book.js';
import Cart from '../models/Cart.js';

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
export const createOrder = async (req, res, next) => {
  try {
    const { orderItems, shippingAddress, paymentMethod, paymentResult } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No order items found'
      });
    }

    if (!shippingAddress || !shippingAddress.fullName || !shippingAddress.addressLine) {
      return res.status(400).json({
        success: false,
        message: 'Please provide complete shipping address details'
      });
    }

    // Verify items, prices, and stock from Database
    let subtotal = 0;
    let totalDiscount = 0;
    const verifiedOrderItems = [];

    for (const item of orderItems) {
      const book = await Book.findById(item.book || item._id);
      if (!book) {
        return res.status(404).json({
          success: false,
          message: `Book ${item.title || item.book} not found`
        });
      }

      if (book.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for "${book.title}". Only ${book.stock} left in stock.`
        });
      }

      const itemPrice = book.discountPrice > 0 ? book.discountPrice : book.price;
      subtotal += book.price * item.quantity;
      if (book.discountPrice > 0) {
        totalDiscount += (book.price - book.discountPrice) * item.quantity;
      }

      verifiedOrderItems.push({
        book: book._id,
        title: book.title,
        image: book.image,
        price: itemPrice,
        quantity: item.quantity
      });
    }

    const shippingPrice = subtotal > 500 ? 0 : 50;
    const totalPrice = subtotal - totalDiscount + shippingPrice;

    // Check payment capture
    const isOnlinePaid =
      paymentMethod !== 'Cash on Delivery' &&
      (paymentMethod?.includes('Instant') ||
        paymentMethod?.includes('Direct') ||
        paymentMethod === 'Razorpay' ||
        (paymentResult && (paymentResult.status === 'captured' || paymentResult.razorpayPaymentId)));

    const order = new Order({
      user: req.user._id,
      orderItems: verifiedOrderItems,
      shippingAddress,
      paymentMethod: paymentMethod || 'Instant Online Payment',
      paymentResult: paymentResult || {
        id: `pay_${Date.now()}`,
        status: isOnlinePaid ? 'captured' : 'pending'
      },
      subtotal,
      shippingPrice,
      discount: totalDiscount,
      totalPrice,
      isPaid: Boolean(isOnlinePaid),
      paidAt: isOnlinePaid ? Date.now() : null,
      orderStatus: 'Processing',
      statusHistory: [
        {
          status: 'Processing',
          timestamp: Date.now(),
          note: isOnlinePaid ? 'Payment confirmed & Order placed' : 'Order placed with Cash on Delivery'
        }
      ]
    });

    const createdOrder = await order.save();

    // Deduct stock for books
    for (const item of verifiedOrderItems) {
      await Book.findByIdAndUpdate(item.book, {
        $inc: { stock: -item.quantity }
      });
    }

    // Clear user cart
    await Cart.findOneAndUpdate({ user: req.user._id }, { items: [] });

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: createdOrder
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/my-orders
// @access  Private
export const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate('orderItems.book', 'title author image')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: orders
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
export const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'name email phone')
      .populate('orderItems.book', 'title author image price discountPrice');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Customer can only view own order, Admin can view all
    if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this order'
      });
    }

    res.json({
      success: true,
      data: order
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel order
// @route   PUT /api/orders/:id/cancel
// @access  Private
export const cancelOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    if (order.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to cancel this order'
      });
    }

    if (!['Pending', 'Processing'].includes(order.orderStatus)) {
      return res.status(400).json({
        success: false,
        message: `Order cannot be cancelled as it is already ${order.orderStatus.toLowerCase()}`
      });
    }

    order.orderStatus = 'Cancelled';
    order.statusHistory.push({
      status: 'Cancelled',
      timestamp: Date.now(),
      note: `Order cancelled by ${req.user.role === 'admin' ? 'Administrator' : 'Customer'}`
    });

    // Restock books
    for (const item of order.orderItems) {
      await Book.findByIdAndUpdate(item.book, {
        $inc: { stock: item.quantity }
      });
    }

    await order.save();

    res.json({
      success: true,
      message: 'Order cancelled successfully',
      data: order
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all orders (Admin only)
// @route   GET /api/orders
// @access  Private/Admin
export const getAllOrders = async (req, res, next) => {
  try {
    const { page = 1, limit = 15, status } = req.query;
    const query = {};

    if (status && status !== 'All') {
      query.orderStatus = status;
    }

    const count = await Order.countDocuments(query);
    const orders = await Order.find(query)
      .populate('user', 'name email')
      .populate('orderItems.book', 'title author')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({
      success: true,
      data: {
        orders,
        page: Number(page),
        pages: Math.ceil(count / limit),
        totalOrders: count
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update order status (Admin only)
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
export const updateOrderStatus = async (req, res, next) => {
  try {
    const { status, note } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    order.orderStatus = status;
    if (status === 'Delivered') {
      order.isDelivered = true;
      order.deliveredAt = Date.now();
      if (order.paymentMethod === 'Cash on Delivery') {
        order.isPaid = true;
        order.paidAt = Date.now();
      }
    }

    order.statusHistory.push({
      status,
      timestamp: Date.now(),
      note: note || `Status updated to ${status} by admin`
    });

    const updatedOrder = await order.save();

    res.json({
      success: true,
      message: `Order status updated to ${status}`,
      data: updatedOrder
    });
  } catch (error) {
    next(error);
  }
};

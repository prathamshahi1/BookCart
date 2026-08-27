import { createRazorpayOrder, verifyRazorpaySignature } from '../utils/paymentUtils.js';
import Payment from '../models/Payment.js';
import Order from '../models/Order.js';

// @desc    Get Razorpay Key ID for client
// @route   GET /api/payment/key
// @access  Public / Private
export const getRazorpayKey = (req, res) => {
  res.json({
    success: true,
    data: {
      keyId: process.env.RAZORPAY_KEY_ID || 'rzp_test_bookcartDemo123'
    }
  });
};

// @desc    Create Razorpay Order
// @route   POST /api/payment/create-order
// @access  Private
export const createPaymentOrder = async (req, res, next) => {
  try {
    const { amount, receiptId } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid payment amount'
      });
    }

    const receipt = receiptId || `rcpt_${Date.now()}`;
    const razorpayOrder = await createRazorpayOrder(amount, receipt);

    res.json({
      success: true,
      data: {
        orderId: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        key: process.env.RAZORPAY_KEY_ID || 'rzp_test_bookcartDemo123'
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Verify Razorpay Payment Signature
// @route   POST /api/payment/verify
// @access  Private
export const verifyPayment = async (req, res, next) => {
  try {
    const {
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
      orderId,
      amount
    } = req.body;

    if (!razorpayOrderId || !razorpayPaymentId) {
      return res.status(400).json({
        success: false,
        message: 'Payment verification details missing'
      });
    }

    const isSignatureValid = verifyRazorpaySignature(
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature
    );

    if (!isSignatureValid) {
      return res.status(400).json({
        success: false,
        message: 'Payment verification failed: Invalid signature'
      });
    }

    // Record Payment in database
    const payment = await Payment.create({
      order: orderId || null,
      user: req.user._id,
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature: razorpaySignature || 'mock_signature',
      amount: amount || 0,
      currency: 'INR',
      status: 'captured'
    });

    // If order ID was supplied, mark order as paid
    if (orderId) {
      const order = await Order.findById(orderId);
      if (order) {
        order.isPaid = true;
        order.paidAt = Date.now();
        order.paymentResult = {
          id: razorpayPaymentId,
          status: 'captured',
          razorpayOrderId,
          razorpayPaymentId,
          razorpaySignature
        };
        order.statusHistory.push({
          status: order.orderStatus,
          timestamp: Date.now(),
          note: `Payment verified via Razorpay ID: ${razorpayPaymentId}`
        });
        await order.save();
      }
    }

    res.json({
      success: true,
      message: 'Payment verified and captured successfully',
      data: {
        paymentId: payment._id,
        razorpayPaymentId
      }
    });
  } catch (error) {
    next(error);
  }
};

import express from 'express';
import {
  createOrder,
  getMyOrders,
  getOrderById,
  cancelOrder,
  getAllOrders,
  updateOrderStatus
} from '../controllers/orderController.js';
import { protect } from '../middleware/authMiddleware.js';
import { admin } from '../middleware/adminMiddleware.js';

const router = express.Router();

router.use(protect);

router
  .route('/')
  .post(createOrder)
  .get(admin, getAllOrders);

router.get('/my-orders', getMyOrders);

router
  .route('/:id')
  .get(getOrderById);

router.put('/:id/cancel', cancelOrder);
router.put('/:id/status', admin, updateOrderStatus);

export default router;

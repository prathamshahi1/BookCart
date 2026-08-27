import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';

import connectDB from './config/db.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

// Route imports
import authRoutes from './routes/authRoutes.js';
import bookRoutes from './routes/bookRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import wishlistRoutes from './routes/wishlistRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

dotenv.config();

const app = express();

app.set('trust proxy', 1);

app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' }
  })
);

app.use(
  cors({
    origin: '*',
    credentials: true
  })
);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Ensure database connection
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    console.error('Database connection error in request middleware:', error.message);
    res.status(500).json({
      success: false,
      message: `Database Connection Failed: ${error.message}`
    });
  }
});

// Health check routes
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    message: 'BookCart API Server is healthy and running',
    timestamp: new Date().toISOString()
  });
});
app.get('/health', (req, res) => {
  res.json({
    status: 'online',
    message: 'BookCart API Server is healthy and running',
    timestamp: new Date().toISOString()
  });
});

// API Routes (Dual mounted for /api/* and /*)
app.use('/api/auth', authRoutes);
app.use('/auth', authRoutes);

app.use('/api/books', bookRoutes);
app.use('/books', bookRoutes);

app.use('/api/categories', categoryRoutes);
app.use('/categories', categoryRoutes);

app.use('/api/cart', cartRoutes);
app.use('/cart', cartRoutes);

app.use('/api/wishlist', wishlistRoutes);
app.use('/wishlist', wishlistRoutes);

app.use('/api/orders', orderRoutes);
app.use('/orders', orderRoutes);

app.use('/api/payment', paymentRoutes);
app.use('/payment', paymentRoutes);

app.use('/api/reviews', reviewRoutes);
app.use('/reviews', reviewRoutes);

app.use('/api/admin', adminRoutes);
app.use('/admin', adminRoutes);

// Error Handling Middleware
app.use(notFound);
app.use(errorHandler);

export default app;

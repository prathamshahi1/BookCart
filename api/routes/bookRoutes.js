import express from 'express';
import {
  getBooks,
  getFeaturedBooks,
  getBestSellers,
  getNewArrivals,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
  getFilterOptions
} from '../controllers/bookController.js';
import {
  getBookReviews,
  createBookReview
} from '../controllers/reviewController.js';
import { protect } from '../middleware/authMiddleware.js';
import { admin } from '../middleware/adminMiddleware.js';

const router = express.Router();

// Specific routes first before /:id
router.get('/featured', getFeaturedBooks);
router.get('/bestsellers', getBestSellers);
router.get('/new-arrivals', getNewArrivals);
router.get('/filters', getFilterOptions);

// Main Book collection routes
router
  .route('/')
  .get(getBooks)
  .post(protect, admin, createBook);

// Single Book routes
router
  .route('/:id')
  .get(getBookById)
  .put(protect, admin, updateBook)
  .delete(protect, admin, deleteBook);

// Review sub-routes for a book
router
  .route('/:id/reviews')
  .get(getBookReviews)
  .post(protect, createBookReview);

export default router;

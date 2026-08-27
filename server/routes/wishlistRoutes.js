import express from 'express';
import {
  getWishlist,
  toggleWishlist,
  addToWishlist,
  removeFromWishlist
} from '../controllers/wishlistController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.get('/', getWishlist);
router.post('/:bookId/toggle', toggleWishlist);
router.post('/:bookId', addToWishlist);
router.delete('/:bookId', removeFromWishlist);

export default router;

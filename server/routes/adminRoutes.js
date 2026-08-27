import express from 'express';
import {
  getDashboardStats,
  getAnalytics,
  getAllUsers,
  updateUserStatus,
  deleteUser
} from '../controllers/adminController.js';
import { protect } from '../middleware/authMiddleware.js';
import { admin } from '../middleware/adminMiddleware.js';
import { upload } from '../middleware/uploadMiddleware.js';

const router = express.Router();

// Admin protection for all routes in this router
router.use(protect, admin);

router.get('/dashboard', getDashboardStats);
router.get('/analytics', getAnalytics);

router
  .route('/users')
  .get(getAllUsers);

router
  .route('/users/:id')
  .put(updateUserStatus)
  .delete(deleteUser);

// Image upload route
router.post('/upload', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: 'No file uploaded'
    });
  }

  // Normalize path with forward slashes
  const imagePath = `/${req.file.path.replace(/\\/g, '/')}`;

  res.json({
    success: true,
    message: 'Image uploaded successfully',
    data: {
      url: imagePath
    }
  });
});

export default router;

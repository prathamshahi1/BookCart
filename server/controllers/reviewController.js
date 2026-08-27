import Review from '../models/Review.js';
import Book from '../models/Book.js';
import Order from '../models/Order.js';

// Helper to recalculate book rating & review count
const updateBookStats = async (bookId) => {
  const reviews = await Review.find({ book: bookId });
  const numReviews = reviews.length;
  const rating =
    numReviews > 0
      ? Number((reviews.reduce((acc, item) => item.rating + acc, 0) / numReviews).toFixed(1))
      : 0;

  await Book.findByIdAndUpdate(bookId, { rating, numReviews });
};

// @desc    Get reviews for a book
// @route   GET /api/books/:id/reviews
// @access  Public
export const getBookReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({ book: req.params.id })
      .populate('user', 'name avatar')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: reviews
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new review for a book
// @route   POST /api/books/:id/reviews
// @access  Private
export const createBookReview = async (req, res, next) => {
  try {
    const { rating, comment } = req.body;
    const bookId = req.params.id;

    if (!rating || !comment) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both rating and review comment'
      });
    }

    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found'
      });
    }

    // Check if user has purchased this book
    const userOrder = await Order.findOne({
      user: req.user._id,
      'orderItems.book': bookId,
      $or: [{ isPaid: true }, { orderStatus: { $in: ['Delivered', 'Shipped', 'Processing'] } }]
    });

    const isVerifiedPurchase = Boolean(userOrder);

    // Check if already reviewed
    const alreadyReviewed = await Review.findOne({
      book: bookId,
      user: req.user._id
    });

    if (alreadyReviewed) {
      alreadyReviewed.rating = Number(rating);
      alreadyReviewed.comment = comment.trim();
      alreadyReviewed.isVerifiedPurchase = isVerifiedPurchase;
      await alreadyReviewed.save();
      await updateBookStats(bookId);

      return res.json({
        success: true,
        message: 'Review updated successfully',
        data: alreadyReviewed
      });
    }

    const review = await Review.create({
      user: req.user._id,
      book: bookId,
      rating: Number(rating),
      comment: comment.trim(),
      isVerifiedPurchase
    });

    await updateBookStats(bookId);

    const populatedReview = await Review.findById(review._id).populate('user', 'name avatar');

    res.status(201).json({
      success: true,
      message: 'Review submitted successfully',
      data: populatedReview
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a review
// @route   DELETE /api/reviews/:id
// @access  Private
export const deleteReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    // Check permission (owner or admin)
    if (
      review.user.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this review'
      });
    }

    const bookId = review.book;
    await Review.deleteOne({ _id: review._id });
    await updateBookStats(bookId);

    res.json({
      success: true,
      message: 'Review removed successfully'
    });
  } catch (error) {
    next(error);
  }
};

import Wishlist from '../models/Wishlist.js';
import Book from '../models/Book.js';

// @desc    Get user's wishlist
// @route   GET /api/wishlist
// @access  Private
export const getWishlist = async (req, res, next) => {
  try {
    let wishlist = await Wishlist.findOne({ user: req.user._id }).populate({
      path: 'books',
      select: 'title author price discountPrice image rating numReviews stock category'
    });

    if (!wishlist) {
      wishlist = await Wishlist.create({ user: req.user._id, books: [] });
    }

    // Filter out deleted books
    wishlist.books = wishlist.books.filter((b) => b !== null);

    res.json({
      success: true,
      data: wishlist.books
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle book in wishlist (add/remove)
// @route   POST /api/wishlist/:bookId/toggle
// @access  Private
export const toggleWishlist = async (req, res, next) => {
  try {
    const { bookId } = req.params;

    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found'
      });
    }

    let wishlist = await Wishlist.findOne({ user: req.user._id });
    if (!wishlist) {
      wishlist = new Wishlist({ user: req.user._id, books: [] });
    }

    const index = wishlist.books.indexOf(bookId);
    let action = '';

    if (index > -1) {
      wishlist.books.splice(index, 1);
      action = 'removed';
    } else {
      wishlist.books.push(bookId);
      action = 'added';
    }

    await wishlist.save();

    res.json({
      success: true,
      message: `Book ${action} ${action === 'added' ? 'to' : 'from'} wishlist`,
      action,
      data: wishlist.books
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add book to wishlist
// @route   POST /api/wishlist/:bookId
// @access  Private
export const addToWishlist = async (req, res, next) => {
  try {
    const { bookId } = req.params;

    let wishlist = await Wishlist.findOne({ user: req.user._id });
    if (!wishlist) {
      wishlist = new Wishlist({ user: req.user._id, books: [] });
    }

    if (!wishlist.books.includes(bookId)) {
      wishlist.books.push(bookId);
      await wishlist.save();
    }

    return getWishlist(req, res, next);
  } catch (error) {
    next(error);
  }
};

// @desc    Remove book from wishlist
// @route   DELETE /api/wishlist/:bookId
// @access  Private
export const removeFromWishlist = async (req, res, next) => {
  try {
    const { bookId } = req.params;

    let wishlist = await Wishlist.findOne({ user: req.user._id });
    if (wishlist) {
      wishlist.books = wishlist.books.filter(
        (id) => id.toString() !== bookId
      );
      await wishlist.save();
    }

    return getWishlist(req, res, next);
  } catch (error) {
    next(error);
  }
};

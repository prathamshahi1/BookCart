import Cart from '../models/Cart.js';
import Book from '../models/Book.js';

// @desc    Get current user's shopping cart
// @route   GET /api/cart
// @access  Private
export const getCart = async (req, res, next) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id }).populate({
      path: 'items.book',
      select: 'title author price discountPrice image stock category'
    });

    if (!cart) {
      cart = await Cart.create({ user: req.user._id, items: [] });
    }

    // Filter out any items where book was deleted
    const validItems = cart.items.filter((item) => item.book !== null);
    if (validItems.length !== cart.items.length) {
      cart.items = validItems;
      await cart.save();
    }

    // Calculate subtotal, discount, total
    let subtotal = 0;
    let totalDiscount = 0;

    cart.items.forEach((item) => {
      if (item.book) {
        const itemEffectivePrice = item.book.discountPrice > 0 ? item.book.discountPrice : item.book.price;
        subtotal += item.book.price * item.quantity;
        if (item.book.discountPrice > 0) {
          totalDiscount += (item.book.price - item.book.discountPrice) * item.quantity;
        }
      }
    });

    const shipping = subtotal > 500 || subtotal === 0 ? 0 : 50;
    const finalTotal = subtotal - totalDiscount + shipping;

    res.json({
      success: true,
      data: {
        _id: cart._id,
        items: cart.items,
        subtotal,
        totalDiscount,
        shipping,
        finalTotal,
        totalItemsCount: cart.items.reduce((acc, item) => acc + item.quantity, 0)
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add book to cart
// @route   POST /api/cart
// @access  Private
export const addToCart = async (req, res, next) => {
  try {
    const { bookId, quantity = 1 } = req.body;

    if (!bookId) {
      return res.status(400).json({
        success: false,
        message: 'Book ID is required'
      });
    }

    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found'
      });
    }

    if (book.stock <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Sorry, this book is currently out of stock'
      });
    }

    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      cart = new Cart({ user: req.user._id, items: [] });
    }

    const effectivePrice = book.discountPrice > 0 ? book.discountPrice : book.price;
    const existingIndex = cart.items.findIndex(
      (item) => item.book.toString() === bookId
    );

    const qtyToAdd = Number(quantity);

    if (existingIndex > -1) {
      const newQty = cart.items[existingIndex].quantity + qtyToAdd;
      if (newQty > book.stock) {
        return res.status(400).json({
          success: false,
          message: `Cannot add more than available stock (${book.stock} available)`
        });
      }
      cart.items[existingIndex].quantity = newQty;
      cart.items[existingIndex].price = effectivePrice;
    } else {
      if (qtyToAdd > book.stock) {
        return res.status(400).json({
          success: false,
          message: `Cannot add more than available stock (${book.stock} available)`
        });
      }
      cart.items.push({
        book: bookId,
        quantity: qtyToAdd,
        price: effectivePrice
      });
    }

    await cart.save();
    return getCart(req, res, next);
  } catch (error) {
    next(error);
  }
};

// @desc    Update cart item quantity
// @route   PUT /api/cart/:bookId
// @access  Private
export const updateCartItemQuantity = async (req, res, next) => {
  try {
    const { bookId } = req.params;
    const { quantity } = req.body;

    const newQty = Number(quantity);
    if (newQty < 1) {
      return removeFromCart(req, res, next);
    }

    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found'
      });
    }

    if (newQty > book.stock) {
      return res.status(400).json({
        success: false,
        message: `Only ${book.stock} units available in stock`
      });
    }

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.book.toString() === bookId
    );

    if (itemIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Item not found in cart'
      });
    }

    cart.items[itemIndex].quantity = newQty;
    await cart.save();

    return getCart(req, res, next);
  } catch (error) {
    next(error);
  }
};

// @desc    Remove book from cart
// @route   DELETE /api/cart/:bookId
// @access  Private
export const removeFromCart = async (req, res, next) => {
  try {
    const { bookId } = req.params;
    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      });
    }

    cart.items = cart.items.filter(
      (item) => item.book.toString() !== bookId
    );

    await cart.save();
    return getCart(req, res, next);
  } catch (error) {
    next(error);
  }
};

// @desc    Clear entire cart
// @route   DELETE /api/cart
// @access  Private
export const clearCart = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (cart) {
      cart.items = [];
      await cart.save();
    }
    return getCart(req, res, next);
  } catch (error) {
    next(error);
  }
};

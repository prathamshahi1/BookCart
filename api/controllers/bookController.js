import Book from '../models/Book.js';
import Review from '../models/Review.js';

// @desc    Fetch all books with search, filter, sort & pagination
// @route   GET /api/books
// @access  Public
export const getBooks = async (req, res, next) => {
  try {
    const pageSize = Number(req.query.limit) || 12;
    const page = Number(req.query.page) || 1;

    const query = {};

    // Keyword Search across title, author, description, tags
    if (req.query.search && req.query.search.trim() !== '') {
      const searchRegex = new RegExp(req.query.search.trim(), 'i');
      query.$or = [
        { title: searchRegex },
        { author: searchRegex },
        { description: searchRegex },
        { category: searchRegex },
        { isbn: searchRegex }
      ];
    }

    // Category Filter (support multiple categories comma-separated or single)
    if (req.query.category && req.query.category !== 'all') {
      const categories = req.query.category.split(',').map((c) => c.trim());
      query.category = { $in: categories.map((c) => new RegExp(`^${c}$`, 'i')) };
    }

    // Author Filter
    if (req.query.author && req.query.author !== 'all') {
      query.author = new RegExp(req.query.author.trim(), 'i');
    }

    // Price Range Filter
    if (req.query.minPrice || req.query.maxPrice) {
      query.price = {};
      if (req.query.minPrice) query.price.$gte = Number(req.query.minPrice);
      if (req.query.maxPrice) query.price.$lte = Number(req.query.maxPrice);
    }

    // Rating Filter
    if (req.query.rating) {
      query.rating = { $gte: Number(req.query.rating) };
    }

    // Stock Filter (inStock only)
    if (req.query.inStock === 'true') {
      query.stock = { $gt: 0 };
    }

    // Sorting options
    let sort = { createdAt: -1 }; // Default newest
    if (req.query.sort) {
      switch (req.query.sort) {
        case 'price-asc':
          sort = { price: 1 };
          break;
        case 'price-desc':
          sort = { price: -1 };
          break;
        case 'rating-desc':
          sort = { rating: -1, numReviews: -1 };
          break;
        case 'popular':
          sort = { numReviews: -1, rating: -1 };
          break;
        case 'title-asc':
          sort = { title: 1 };
          break;
        case 'title-desc':
          sort = { title: -1 };
          break;
        case 'oldest':
          sort = { createdAt: 1 };
          break;
        default:
          sort = { createdAt: -1 };
      }
    }

    const count = await Book.countDocuments(query);
    const books = await Book.find(query)
      .sort(sort)
      .limit(pageSize)
      .skip(pageSize * (page - 1));

    res.json({
      success: true,
      data: {
        books,
        page,
        pages: Math.ceil(count / pageSize),
        totalBooks: count
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get featured books for homepage
// @route   GET /api/books/featured
// @access  Public
export const getFeaturedBooks = async (req, res, next) => {
  try {
    const books = await Book.find({ featured: true }).limit(8);
    res.json({
      success: true,
      data: books
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get best-selling books
// @route   GET /api/books/bestsellers
// @access  Public
export const getBestSellers = async (req, res, next) => {
  try {
    const books = await Book.find({ bestSeller: true }).limit(8);
    // If not enough marked as bestseller, fallback to top rated
    if (books.length === 0) {
      const topRated = await Book.find({}).sort({ rating: -1 }).limit(8);
      return res.json({ success: true, data: topRated });
    }
    res.json({
      success: true,
      data: books
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get new arrivals
// @route   GET /api/books/new-arrivals
// @access  Public
export const getNewArrivals = async (req, res, next) => {
  try {
    const books = await Book.find({}).sort({ createdAt: -1 }).limit(8);
    res.json({
      success: true,
      data: books
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Fetch single book by ID with related books
// @route   GET /api/books/:id
// @access  Public
export const getBookById = async (req, res, next) => {
  try {
    const book = await Book.findById(req.params.id);

    if (book) {
      // Find related books in the same category
      const relatedBooks = await Book.find({
        category: book.category,
        _id: { $ne: book._id }
      }).limit(4);

      // Find reviews for this book
      const reviews = await Review.find({ book: book._id })
        .populate('user', 'name avatar')
        .sort({ createdAt: -1 });

      res.json({
        success: true,
        data: {
          book,
          relatedBooks,
          reviews
        }
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'Book not found'
      });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new book
// @route   POST /api/books
// @access  Private/Admin
export const createBook = async (req, res, next) => {
  try {
    const {
      title,
      author,
      description,
      category,
      price,
      discountPrice,
      stock,
      isbn,
      publisher,
      language,
      pages,
      publicationDate,
      image,
      featured,
      bestSeller,
      tags
    } = req.body;

    if (!title || !author || !description || !category || price === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Please provide title, author, description, category, and price'
      });
    }

    const book = new Book({
      title,
      author,
      description,
      category,
      price: Number(price),
      discountPrice: discountPrice ? Number(discountPrice) : 0,
      stock: stock !== undefined ? Number(stock) : 10,
      isbn: isbn || '978-0-0000-0000-0',
      publisher: publisher || 'BookCart Press',
      language: language || 'English',
      pages: pages ? Number(pages) : 300,
      publicationDate: publicationDate || new Date(),
      image: image || 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=800',
      featured: Boolean(featured),
      bestSeller: Boolean(bestSeller),
      tags: Array.isArray(tags) ? tags : []
    });

    const createdBook = await book.save();

    res.status(201).json({
      success: true,
      message: 'Book created successfully',
      data: createdBook
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a book
// @route   PUT /api/books/:id
// @access  Private/Admin
export const updateBook = async (req, res, next) => {
  try {
    const book = await Book.findById(req.params.id);

    if (book) {
      book.title = req.body.title || book.title;
      book.author = req.body.author || book.author;
      book.description = req.body.description || book.description;
      book.category = req.body.category || book.category;
      if (req.body.price !== undefined) book.price = Number(req.body.price);
      if (req.body.discountPrice !== undefined) book.discountPrice = Number(req.body.discountPrice);
      if (req.body.stock !== undefined) book.stock = Number(req.body.stock);
      book.isbn = req.body.isbn || book.isbn;
      book.publisher = req.body.publisher || book.publisher;
      book.language = req.body.language || book.language;
      if (req.body.pages !== undefined) book.pages = Number(req.body.pages);
      if (req.body.publicationDate) book.publicationDate = req.body.publicationDate;
      if (req.body.image) book.image = req.body.image;
      if (req.body.featured !== undefined) book.featured = Boolean(req.body.featured);
      if (req.body.bestSeller !== undefined) book.bestSeller = Boolean(req.body.bestSeller);
      if (req.body.tags) book.tags = req.body.tags;

      const updatedBook = await book.save();

      res.json({
        success: true,
        message: 'Book updated successfully',
        data: updatedBook
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'Book not found'
      });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a book
// @route   DELETE /api/books/:id
// @access  Private/Admin
export const deleteBook = async (req, res, next) => {
  try {
    const book = await Book.findById(req.params.id);

    if (book) {
      await Review.deleteMany({ book: book._id });
      await Book.deleteOne({ _id: book._id });

      res.json({
        success: true,
        message: 'Book and its associated reviews removed successfully'
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'Book not found'
      });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get filter options (categories and top authors)
// @route   GET /api/books/filters
// @access  Public
export const getFilterOptions = async (req, res, next) => {
  try {
    const categories = await Book.distinct('category');
    const authors = await Book.distinct('author');
    const priceStats = await Book.aggregate([
      {
        $group: {
          _id: null,
          minPrice: { $min: '$price' },
          maxPrice: { $max: '$price' }
        }
      }
    ]);

    res.json({
      success: true,
      data: {
        categories,
        authors: authors.slice(0, 20),
        priceRange: priceStats[0] || { minPrice: 0, maxPrice: 1000 }
      }
    });
  } catch (error) {
    next(error);
  }
};

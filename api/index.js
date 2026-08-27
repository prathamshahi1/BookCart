// server/app.js
import express10 from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";

// server/config/db.js
import mongoose from "mongoose";
var DEFAULT_URI = "mongodb+srv://svpshahi_db_user:wh6Q3zLZlovJUvQf@cluster0.bk8ltpa.mongodb.net/bookcart?retryWrites=true&w=majority&appName=Cluster0";
var cached = global.mongoose;
if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}
var connectDB = async () => {
  const uri = process.env.MONGODB_URI || process.env.MONGO_URI || DEFAULT_URI;
  if (cached.conn) {
    return cached.conn;
  }
  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 8e3
    };
    cached.promise = mongoose.connect(uri, opts).then((mongooseInstance) => {
      console.log(`\u2705 MongoDB Connected: ${mongooseInstance.connection.host}`);
      return mongooseInstance;
    });
  }
  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    console.error(`\u274C MongoDB Connection Error: ${e.message}`);
    throw e;
  }
  return cached.conn;
};
var db_default = connectDB;

// server/middleware/errorMiddleware.js
var notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};
var errorHandler = (err, req, res, next) => {
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message || "Internal Server Error";
  if (err.name === "CastError" && err.kind === "ObjectId") {
    statusCode = 404;
    message = "Resource not found with the specified ID";
  }
  if (err.code === 11e3) {
    statusCode = 400;
    const field = Object.keys(err.keyValue)[0];
    message = `Duplicate value entered for ${field} field`;
  }
  if (err.name === "ValidationError") {
    statusCode = 400;
    message = Object.values(err.errors).map((val) => val.message).join(", ");
  }
  if (err.name === "JsonWebTokenError") {
    statusCode = 401;
    message = "Invalid authentication token";
  }
  if (err.name === "TokenExpiredError") {
    statusCode = 401;
    message = "Authentication token expired";
  }
  res.status(statusCode).json({
    success: false,
    message,
    stack: process.env.NODE_ENV === "production" ? null : err.stack
  });
};

// server/routes/authRoutes.js
import express from "express";

// server/models/User.js
import mongoose2 from "mongoose";
import bcrypt from "bcryptjs";
var addressSchema = new mongoose2.Schema({
  fullName: { type: String, required: true },
  phone: { type: String, required: true },
  addressLine: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  postalCode: { type: String, required: true },
  country: { type: String, default: "India" },
  isDefault: { type: Boolean, default: false }
});
var userSchema = new mongoose2.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide a name"],
      trim: true,
      maxlength: [50, "Name cannot exceed 50 characters"]
    },
    email: {
      type: String,
      required: [true, "Please provide an email"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please provide a valid email address"
      ]
    },
    password: {
      type: String,
      required: [true, "Please provide a password"],
      minlength: [6, "Password must be at least 6 characters"],
      select: false
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user"
    },
    avatar: {
      type: String,
      default: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250"
    },
    isBlocked: {
      type: Boolean,
      default: false
    },
    addresses: [addressSchema]
  },
  {
    timestamps: true
  }
);
userSchema.pre("save", async function(next) {
  if (!this.isModified("password")) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};
var User = mongoose2.model("User", userSchema);
var User_default = User;

// server/utils/generateToken.js
import jwt from "jsonwebtoken";
var generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || "bookcart_default_jwt_secret_key_2026", {
    expiresIn: process.env.JWT_EXPIRE || "30d"
  });
};
var generateToken_default = generateToken;

// server/controllers/authController.js
var registerUser = async (req, res, next) => {
  try {
    const { name, email, password, confirmPassword } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide name, email, and password"
      });
    }
    if (confirmPassword && password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Passwords do not match"
      });
    }
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters long"
      });
    }
    const userExists = await User_default.findOne({ email: email.toLowerCase().trim() });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: "User already exists with this email address"
      });
    }
    const user = await User_default.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password
    });
    if (user) {
      res.status(201).json({
        success: true,
        message: "Registration successful",
        data: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          avatar: user.avatar,
          token: generateToken_default(user._id)
        }
      });
    } else {
      res.status(400).json({
        success: false,
        message: "Invalid user data received"
      });
    }
  } catch (error) {
    next(error);
  }
};
var loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide an email and password"
      });
    }
    const user = await User_default.findOne({ email: email.toLowerCase().trim() }).select("+password");
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password"
      });
    }
    if (user.isBlocked) {
      return res.status(403).json({
        success: false,
        message: "Your account has been suspended. Please contact support."
      });
    }
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password"
      });
    }
    res.json({
      success: true,
      message: "Login successful",
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        addresses: user.addresses,
        token: generateToken_default(user._id)
      }
    });
  } catch (error) {
    next(error);
  }
};
var getUserProfile = async (req, res, next) => {
  try {
    const user = await User_default.findById(req.user._id);
    if (user) {
      res.json({
        success: true,
        data: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          avatar: user.avatar,
          addresses: user.addresses,
          createdAt: user.createdAt
        }
      });
    } else {
      res.status(404).json({
        success: false,
        message: "User profile not found"
      });
    }
  } catch (error) {
    next(error);
  }
};
var updateUserProfile = async (req, res, next) => {
  try {
    const user = await User_default.findById(req.user._id).select("+password");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }
    user.name = req.body.name || user.name;
    if (req.body.email && req.body.email !== user.email) {
      const emailExists = await User_default.findOne({ email: req.body.email.toLowerCase().trim() });
      if (emailExists && emailExists._id.toString() !== user._id.toString()) {
        return res.status(400).json({
          success: false,
          message: "Email is already taken by another account"
        });
      }
      user.email = req.body.email.toLowerCase().trim();
    }
    if (req.body.avatar) {
      user.avatar = req.body.avatar;
    }
    if (req.body.password) {
      if (req.body.password.length < 6) {
        return res.status(400).json({
          success: false,
          message: "New password must be at least 6 characters long"
        });
      }
      user.password = req.body.password;
    }
    const updatedUser = await user.save();
    res.json({
      success: true,
      message: "Profile updated successfully",
      data: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        avatar: updatedUser.avatar,
        addresses: updatedUser.addresses,
        token: generateToken_default(updatedUser._id)
      }
    });
  } catch (error) {
    next(error);
  }
};
var saveAddress = async (req, res, next) => {
  try {
    const { fullName, phone, addressLine, city, state, postalCode, country, isDefault } = req.body;
    if (!fullName || !phone || !addressLine || !city || !state || !postalCode) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required address details"
      });
    }
    const user = await User_default.findById(req.user._id);
    if (isDefault) {
      user.addresses.forEach((addr) => {
        addr.isDefault = false;
      });
    }
    user.addresses.push({
      fullName,
      phone,
      addressLine,
      city,
      state,
      postalCode,
      country: country || "India",
      isDefault: isDefault || user.addresses.length === 0
    });
    await user.save();
    res.status(201).json({
      success: true,
      message: "Address saved successfully",
      data: user.addresses
    });
  } catch (error) {
    next(error);
  }
};
var deleteAddress = async (req, res, next) => {
  try {
    const user = await User_default.findById(req.user._id);
    user.addresses = user.addresses.filter(
      (addr) => addr._id.toString() !== req.params.id
    );
    await user.save();
    res.json({
      success: true,
      message: "Address removed successfully",
      data: user.addresses
    });
  } catch (error) {
    next(error);
  }
};

// server/middleware/authMiddleware.js
import jwt2 from "jsonwebtoken";
var protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt2.verify(
        token,
        process.env.JWT_SECRET || "bookcart_default_jwt_secret_key_2026"
      );
      const user = await User_default.findById(decoded.id).select("-password");
      if (!user) {
        return res.status(401).json({
          success: false,
          message: "User no longer exists"
        });
      }
      if (user.isBlocked) {
        return res.status(403).json({
          success: false,
          message: "Your account has been suspended. Please contact customer support."
        });
      }
      req.user = user;
      next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired authentication token. Please log in again."
      });
    }
  }
  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Access denied. No authentication token provided."
    });
  }
};

// server/routes/authRoutes.js
var router = express.Router();
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/me", protect, getUserProfile);
router.put("/profile", protect, updateUserProfile);
router.post("/address", protect, saveAddress);
router.delete("/address/:id", protect, deleteAddress);
var authRoutes_default = router;

// server/routes/bookRoutes.js
import express2 from "express";

// server/models/Book.js
import mongoose3 from "mongoose";
var bookSchema = new mongoose3.Schema(
  {
    title: {
      type: String,
      required: [true, "Please provide book title"],
      trim: true
    },
    author: {
      type: String,
      required: [true, "Please provide author name"],
      trim: true
    },
    description: {
      type: String,
      required: [true, "Please provide book description"]
    },
    category: {
      type: String,
      required: [true, "Please specify a category"],
      trim: true
    },
    price: {
      type: Number,
      required: [true, "Please provide book price"],
      min: [0, "Price cannot be negative"]
    },
    discountPrice: {
      type: Number,
      default: 0,
      min: [0, "Discount price cannot be negative"]
    },
    stock: {
      type: Number,
      required: [true, "Please provide stock count"],
      default: 0,
      min: [0, "Stock cannot be negative"]
    },
    isbn: {
      type: String,
      trim: true,
      default: "978-0-0000-0000-0"
    },
    publisher: {
      type: String,
      default: "Penguin Random House"
    },
    language: {
      type: String,
      default: "English"
    },
    pages: {
      type: Number,
      default: 320
    },
    publicationDate: {
      type: Date,
      default: Date.now
    },
    image: {
      type: String,
      required: [true, "Please provide book cover image URL"],
      default: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=800"
    },
    rating: {
      type: Number,
      default: 0,
      min: [0, "Rating cannot be below 0"],
      max: [5, "Rating cannot exceed 5"]
    },
    numReviews: {
      type: Number,
      default: 0
    },
    featured: {
      type: Boolean,
      default: false
    },
    bestSeller: {
      type: Boolean,
      default: false
    },
    tags: [String]
  },
  {
    timestamps: true
  }
);
bookSchema.index({ title: "text", author: "text", description: "text", category: "text" });
var Book = mongoose3.model("Book", bookSchema);
var Book_default = Book;

// server/models/Review.js
import mongoose4 from "mongoose";
var reviewSchema = new mongoose4.Schema(
  {
    user: {
      type: mongoose4.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    book: {
      type: mongoose4.Schema.Types.ObjectId,
      ref: "Book",
      required: true
    },
    rating: {
      type: Number,
      required: [true, "Please provide a rating between 1 and 5"],
      min: 1,
      max: 5
    },
    comment: {
      type: String,
      required: [true, "Please write a review comment"],
      trim: true,
      maxlength: [1e3, "Review cannot exceed 1000 characters"]
    },
    isVerifiedPurchase: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);
reviewSchema.index({ user: 1, book: 1 }, { unique: true });
var Review = mongoose4.model("Review", reviewSchema);
var Review_default = Review;

// server/controllers/bookController.js
var getBooks = async (req, res, next) => {
  try {
    const pageSize = Number(req.query.limit) || 12;
    const page = Number(req.query.page) || 1;
    const query = {};
    if (req.query.search && req.query.search.trim() !== "") {
      const searchRegex = new RegExp(req.query.search.trim(), "i");
      query.$or = [
        { title: searchRegex },
        { author: searchRegex },
        { description: searchRegex },
        { category: searchRegex },
        { isbn: searchRegex }
      ];
    }
    if (req.query.category && req.query.category !== "all") {
      const categories = req.query.category.split(",").map((c) => c.trim());
      query.category = { $in: categories.map((c) => new RegExp(`^${c}$`, "i")) };
    }
    if (req.query.author && req.query.author !== "all") {
      query.author = new RegExp(req.query.author.trim(), "i");
    }
    if (req.query.minPrice || req.query.maxPrice) {
      query.price = {};
      if (req.query.minPrice) query.price.$gte = Number(req.query.minPrice);
      if (req.query.maxPrice) query.price.$lte = Number(req.query.maxPrice);
    }
    if (req.query.rating) {
      query.rating = { $gte: Number(req.query.rating) };
    }
    if (req.query.inStock === "true") {
      query.stock = { $gt: 0 };
    }
    let sort = { createdAt: -1 };
    if (req.query.sort) {
      switch (req.query.sort) {
        case "price-asc":
          sort = { price: 1 };
          break;
        case "price-desc":
          sort = { price: -1 };
          break;
        case "rating-desc":
          sort = { rating: -1, numReviews: -1 };
          break;
        case "popular":
          sort = { numReviews: -1, rating: -1 };
          break;
        case "title-asc":
          sort = { title: 1 };
          break;
        case "title-desc":
          sort = { title: -1 };
          break;
        case "oldest":
          sort = { createdAt: 1 };
          break;
        default:
          sort = { createdAt: -1 };
      }
    }
    const count = await Book_default.countDocuments(query);
    const books = await Book_default.find(query).sort(sort).limit(pageSize).skip(pageSize * (page - 1));
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
var getFeaturedBooks = async (req, res, next) => {
  try {
    const books = await Book_default.find({ featured: true }).limit(8);
    res.json({
      success: true,
      data: books
    });
  } catch (error) {
    next(error);
  }
};
var getBestSellers = async (req, res, next) => {
  try {
    const books = await Book_default.find({ bestSeller: true }).limit(8);
    if (books.length === 0) {
      const topRated = await Book_default.find({}).sort({ rating: -1 }).limit(8);
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
var getNewArrivals = async (req, res, next) => {
  try {
    const books = await Book_default.find({}).sort({ createdAt: -1 }).limit(8);
    res.json({
      success: true,
      data: books
    });
  } catch (error) {
    next(error);
  }
};
var getBookById = async (req, res, next) => {
  try {
    const book = await Book_default.findById(req.params.id);
    if (book) {
      const relatedBooks = await Book_default.find({
        category: book.category,
        _id: { $ne: book._id }
      }).limit(4);
      const reviews = await Review_default.find({ book: book._id }).populate("user", "name avatar").sort({ createdAt: -1 });
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
        message: "Book not found"
      });
    }
  } catch (error) {
    next(error);
  }
};
var createBook = async (req, res, next) => {
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
    if (!title || !author || !description || !category || price === void 0) {
      return res.status(400).json({
        success: false,
        message: "Please provide title, author, description, category, and price"
      });
    }
    const book = new Book_default({
      title,
      author,
      description,
      category,
      price: Number(price),
      discountPrice: discountPrice ? Number(discountPrice) : 0,
      stock: stock !== void 0 ? Number(stock) : 10,
      isbn: isbn || "978-0-0000-0000-0",
      publisher: publisher || "BookCart Press",
      language: language || "English",
      pages: pages ? Number(pages) : 300,
      publicationDate: publicationDate || /* @__PURE__ */ new Date(),
      image: image || "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=800",
      featured: Boolean(featured),
      bestSeller: Boolean(bestSeller),
      tags: Array.isArray(tags) ? tags : []
    });
    const createdBook = await book.save();
    res.status(201).json({
      success: true,
      message: "Book created successfully",
      data: createdBook
    });
  } catch (error) {
    next(error);
  }
};
var updateBook = async (req, res, next) => {
  try {
    const book = await Book_default.findById(req.params.id);
    if (book) {
      book.title = req.body.title || book.title;
      book.author = req.body.author || book.author;
      book.description = req.body.description || book.description;
      book.category = req.body.category || book.category;
      if (req.body.price !== void 0) book.price = Number(req.body.price);
      if (req.body.discountPrice !== void 0) book.discountPrice = Number(req.body.discountPrice);
      if (req.body.stock !== void 0) book.stock = Number(req.body.stock);
      book.isbn = req.body.isbn || book.isbn;
      book.publisher = req.body.publisher || book.publisher;
      book.language = req.body.language || book.language;
      if (req.body.pages !== void 0) book.pages = Number(req.body.pages);
      if (req.body.publicationDate) book.publicationDate = req.body.publicationDate;
      if (req.body.image) book.image = req.body.image;
      if (req.body.featured !== void 0) book.featured = Boolean(req.body.featured);
      if (req.body.bestSeller !== void 0) book.bestSeller = Boolean(req.body.bestSeller);
      if (req.body.tags) book.tags = req.body.tags;
      const updatedBook = await book.save();
      res.json({
        success: true,
        message: "Book updated successfully",
        data: updatedBook
      });
    } else {
      res.status(404).json({
        success: false,
        message: "Book not found"
      });
    }
  } catch (error) {
    next(error);
  }
};
var deleteBook = async (req, res, next) => {
  try {
    const book = await Book_default.findById(req.params.id);
    if (book) {
      await Review_default.deleteMany({ book: book._id });
      await Book_default.deleteOne({ _id: book._id });
      res.json({
        success: true,
        message: "Book and its associated reviews removed successfully"
      });
    } else {
      res.status(404).json({
        success: false,
        message: "Book not found"
      });
    }
  } catch (error) {
    next(error);
  }
};
var getFilterOptions = async (req, res, next) => {
  try {
    const categories = await Book_default.distinct("category");
    const authors = await Book_default.distinct("author");
    const priceStats = await Book_default.aggregate([
      {
        $group: {
          _id: null,
          minPrice: { $min: "$price" },
          maxPrice: { $max: "$price" }
        }
      }
    ]);
    res.json({
      success: true,
      data: {
        categories,
        authors: authors.slice(0, 20),
        priceRange: priceStats[0] || { minPrice: 0, maxPrice: 1e3 }
      }
    });
  } catch (error) {
    next(error);
  }
};

// server/models/Order.js
import mongoose5 from "mongoose";
var orderItemSchema = new mongoose5.Schema({
  book: {
    type: mongoose5.Schema.Types.ObjectId,
    ref: "Book",
    required: true
  },
  title: { type: String, required: true },
  image: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true, min: 1 }
});
var orderSchema = new mongoose5.Schema(
  {
    user: {
      type: mongoose5.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    orderItems: [orderItemSchema],
    shippingAddress: {
      fullName: { type: String, required: true },
      phone: { type: String, required: true },
      addressLine: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      postalCode: { type: String, required: true },
      country: { type: String, default: "India" }
    },
    paymentMethod: {
      type: String,
      required: true,
      default: "Razorpay"
    },
    paymentResult: {
      id: { type: String },
      status: { type: String },
      update_time: { type: String },
      razorpayOrderId: { type: String },
      razorpayPaymentId: { type: String },
      razorpaySignature: { type: String }
    },
    subtotal: {
      type: Number,
      required: true,
      default: 0
    },
    shippingPrice: {
      type: Number,
      required: true,
      default: 0
    },
    discount: {
      type: Number,
      required: true,
      default: 0
    },
    totalPrice: {
      type: Number,
      required: true,
      default: 0
    },
    isPaid: {
      type: Boolean,
      required: true,
      default: false
    },
    paidAt: {
      type: Date
    },
    orderStatus: {
      type: String,
      enum: ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"],
      default: "Pending"
    },
    statusHistory: [
      {
        status: { type: String },
        timestamp: { type: Date, default: Date.now },
        note: { type: String }
      }
    ],
    deliveredAt: {
      type: Date
    }
  },
  {
    timestamps: true
  }
);
var Order = mongoose5.model("Order", orderSchema);
var Order_default = Order;

// server/controllers/reviewController.js
var updateBookStats = async (bookId) => {
  const reviews = await Review_default.find({ book: bookId });
  const numReviews = reviews.length;
  const rating = numReviews > 0 ? Number((reviews.reduce((acc, item) => item.rating + acc, 0) / numReviews).toFixed(1)) : 0;
  await Book_default.findByIdAndUpdate(bookId, { rating, numReviews });
};
var getBookReviews = async (req, res, next) => {
  try {
    const reviews = await Review_default.find({ book: req.params.id }).populate("user", "name avatar").sort({ createdAt: -1 });
    res.json({
      success: true,
      data: reviews
    });
  } catch (error) {
    next(error);
  }
};
var createBookReview = async (req, res, next) => {
  try {
    const { rating, comment } = req.body;
    const bookId = req.params.id;
    if (!rating || !comment) {
      return res.status(400).json({
        success: false,
        message: "Please provide both rating and review comment"
      });
    }
    const book = await Book_default.findById(bookId);
    if (!book) {
      return res.status(404).json({
        success: false,
        message: "Book not found"
      });
    }
    const userOrder = await Order_default.findOne({
      user: req.user._id,
      "orderItems.book": bookId,
      $or: [{ isPaid: true }, { orderStatus: { $in: ["Delivered", "Shipped", "Processing"] } }]
    });
    const isVerifiedPurchase = Boolean(userOrder);
    const alreadyReviewed = await Review_default.findOne({
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
        message: "Review updated successfully",
        data: alreadyReviewed
      });
    }
    const review = await Review_default.create({
      user: req.user._id,
      book: bookId,
      rating: Number(rating),
      comment: comment.trim(),
      isVerifiedPurchase
    });
    await updateBookStats(bookId);
    const populatedReview = await Review_default.findById(review._id).populate("user", "name avatar");
    res.status(201).json({
      success: true,
      message: "Review submitted successfully",
      data: populatedReview
    });
  } catch (error) {
    next(error);
  }
};
var deleteReview = async (req, res, next) => {
  try {
    const review = await Review_default.findById(req.params.id);
    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found"
      });
    }
    if (review.user.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this review"
      });
    }
    const bookId = review.book;
    await Review_default.deleteOne({ _id: review._id });
    await updateBookStats(bookId);
    res.json({
      success: true,
      message: "Review removed successfully"
    });
  } catch (error) {
    next(error);
  }
};

// server/middleware/adminMiddleware.js
var admin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403).json({
      success: false,
      message: "Access denied. Administrative privileges required."
    });
  }
};

// server/routes/bookRoutes.js
var router2 = express2.Router();
router2.get("/featured", getFeaturedBooks);
router2.get("/bestsellers", getBestSellers);
router2.get("/new-arrivals", getNewArrivals);
router2.get("/filters", getFilterOptions);
router2.route("/").get(getBooks).post(protect, admin, createBook);
router2.route("/:id").get(getBookById).put(protect, admin, updateBook).delete(protect, admin, deleteBook);
router2.route("/:id/reviews").get(getBookReviews).post(protect, createBookReview);
var bookRoutes_default = router2;

// server/routes/categoryRoutes.js
import express3 from "express";

// server/models/Category.js
import mongoose6 from "mongoose";
var categorySchema = new mongoose6.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide category name"],
      unique: true,
      trim: true
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    description: {
      type: String,
      default: ""
    },
    image: {
      type: String,
      default: ""
    },
    icon: {
      type: String,
      default: "BookOpen"
    }
  },
  {
    timestamps: true
  }
);
var Category = mongoose6.model("Category", categorySchema);
var Category_default = Category;

// server/controllers/categoryController.js
var getCategories = async (req, res, next) => {
  try {
    const categories = await Category_default.find({}).sort({ name: 1 });
    const bookCounts = await Book_default.aggregate([
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 }
        }
      }
    ]);
    const countMap = {};
    bookCounts.forEach((item) => {
      countMap[item._id.toLowerCase()] = item.count;
    });
    const categoriesWithCount = categories.map((cat) => ({
      ...cat.toObject(),
      bookCount: countMap[cat.name.toLowerCase()] || 0
    }));
    res.json({
      success: true,
      data: categoriesWithCount
    });
  } catch (error) {
    next(error);
  }
};
var createCategory = async (req, res, next) => {
  try {
    const { name, description, image, icon } = req.body;
    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Category name is required"
      });
    }
    const slug = name.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-");
    const existingCategory = await Category_default.findOne({
      $or: [{ name: name.trim() }, { slug }]
    });
    if (existingCategory) {
      return res.status(400).json({
        success: false,
        message: "Category with this name already exists"
      });
    }
    const category = await Category_default.create({
      name: name.trim(),
      slug,
      description: description || "",
      image: image || "",
      icon: icon || "BookOpen"
    });
    res.status(201).json({
      success: true,
      message: "Category created successfully",
      data: category
    });
  } catch (error) {
    next(error);
  }
};
var updateCategory = async (req, res, next) => {
  try {
    const category = await Category_default.findById(req.params.id);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found"
      });
    }
    if (req.body.name) {
      category.name = req.body.name.trim();
      category.slug = req.body.name.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-");
    }
    if (req.body.description !== void 0) category.description = req.body.description;
    if (req.body.image !== void 0) category.image = req.body.image;
    if (req.body.icon !== void 0) category.icon = req.body.icon;
    const updated = await category.save();
    res.json({
      success: true,
      message: "Category updated successfully",
      data: updated
    });
  } catch (error) {
    next(error);
  }
};
var deleteCategory = async (req, res, next) => {
  try {
    const category = await Category_default.findById(req.params.id);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found"
      });
    }
    await Category_default.deleteOne({ _id: category._id });
    res.json({
      success: true,
      message: "Category deleted successfully"
    });
  } catch (error) {
    next(error);
  }
};

// server/routes/categoryRoutes.js
var router3 = express3.Router();
router3.route("/").get(getCategories).post(protect, admin, createCategory);
router3.route("/:id").put(protect, admin, updateCategory).delete(protect, admin, deleteCategory);
var categoryRoutes_default = router3;

// server/routes/cartRoutes.js
import express4 from "express";

// server/models/Cart.js
import mongoose7 from "mongoose";
var cartItemSchema = new mongoose7.Schema({
  book: {
    type: mongoose7.Schema.Types.ObjectId,
    ref: "Book",
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    default: 1,
    min: [1, "Quantity cannot be less than 1"]
  },
  price: {
    type: Number,
    required: true
  }
});
var cartSchema = new mongoose7.Schema(
  {
    user: {
      type: mongoose7.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true
    },
    items: [cartItemSchema]
  },
  {
    timestamps: true
  }
);
var Cart = mongoose7.model("Cart", cartSchema);
var Cart_default = Cart;

// server/controllers/cartController.js
var getCart = async (req, res, next) => {
  try {
    let cart = await Cart_default.findOne({ user: req.user._id }).populate({
      path: "items.book",
      select: "title author price discountPrice image stock category"
    });
    if (!cart) {
      cart = await Cart_default.create({ user: req.user._id, items: [] });
    }
    const validItems = cart.items.filter((item) => item.book !== null);
    if (validItems.length !== cart.items.length) {
      cart.items = validItems;
      await cart.save();
    }
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
var addToCart = async (req, res, next) => {
  try {
    const { bookId, quantity = 1 } = req.body;
    if (!bookId) {
      return res.status(400).json({
        success: false,
        message: "Book ID is required"
      });
    }
    const book = await Book_default.findById(bookId);
    if (!book) {
      return res.status(404).json({
        success: false,
        message: "Book not found"
      });
    }
    if (book.stock <= 0) {
      return res.status(400).json({
        success: false,
        message: "Sorry, this book is currently out of stock"
      });
    }
    let cart = await Cart_default.findOne({ user: req.user._id });
    if (!cart) {
      cart = new Cart_default({ user: req.user._id, items: [] });
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
var updateCartItemQuantity = async (req, res, next) => {
  try {
    const { bookId } = req.params;
    const { quantity } = req.body;
    const newQty = Number(quantity);
    if (newQty < 1) {
      return removeFromCart(req, res, next);
    }
    const book = await Book_default.findById(bookId);
    if (!book) {
      return res.status(404).json({
        success: false,
        message: "Book not found"
      });
    }
    if (newQty > book.stock) {
      return res.status(400).json({
        success: false,
        message: `Only ${book.stock} units available in stock`
      });
    }
    const cart = await Cart_default.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found"
      });
    }
    const itemIndex = cart.items.findIndex(
      (item) => item.book.toString() === bookId
    );
    if (itemIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Item not found in cart"
      });
    }
    cart.items[itemIndex].quantity = newQty;
    await cart.save();
    return getCart(req, res, next);
  } catch (error) {
    next(error);
  }
};
var removeFromCart = async (req, res, next) => {
  try {
    const { bookId } = req.params;
    const cart = await Cart_default.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found"
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
var clearCart = async (req, res, next) => {
  try {
    const cart = await Cart_default.findOne({ user: req.user._id });
    if (cart) {
      cart.items = [];
      await cart.save();
    }
    return getCart(req, res, next);
  } catch (error) {
    next(error);
  }
};

// server/routes/cartRoutes.js
var router4 = express4.Router();
router4.use(protect);
router4.route("/").get(getCart).post(addToCart).delete(clearCart);
router4.route("/:bookId").put(updateCartItemQuantity).delete(removeFromCart);
var cartRoutes_default = router4;

// server/routes/wishlistRoutes.js
import express5 from "express";

// server/models/Wishlist.js
import mongoose8 from "mongoose";
var wishlistSchema = new mongoose8.Schema(
  {
    user: {
      type: mongoose8.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true
    },
    books: [
      {
        type: mongoose8.Schema.Types.ObjectId,
        ref: "Book"
      }
    ]
  },
  {
    timestamps: true
  }
);
var Wishlist = mongoose8.model("Wishlist", wishlistSchema);
var Wishlist_default = Wishlist;

// server/controllers/wishlistController.js
var getWishlist = async (req, res, next) => {
  try {
    let wishlist = await Wishlist_default.findOne({ user: req.user._id }).populate({
      path: "books",
      select: "title author price discountPrice image rating numReviews stock category"
    });
    if (!wishlist) {
      wishlist = await Wishlist_default.create({ user: req.user._id, books: [] });
    }
    wishlist.books = wishlist.books.filter((b) => b !== null);
    res.json({
      success: true,
      data: wishlist.books
    });
  } catch (error) {
    next(error);
  }
};
var toggleWishlist = async (req, res, next) => {
  try {
    const { bookId } = req.params;
    const book = await Book_default.findById(bookId);
    if (!book) {
      return res.status(404).json({
        success: false,
        message: "Book not found"
      });
    }
    let wishlist = await Wishlist_default.findOne({ user: req.user._id });
    if (!wishlist) {
      wishlist = new Wishlist_default({ user: req.user._id, books: [] });
    }
    const index = wishlist.books.indexOf(bookId);
    let action = "";
    if (index > -1) {
      wishlist.books.splice(index, 1);
      action = "removed";
    } else {
      wishlist.books.push(bookId);
      action = "added";
    }
    await wishlist.save();
    res.json({
      success: true,
      message: `Book ${action} ${action === "added" ? "to" : "from"} wishlist`,
      action,
      data: wishlist.books
    });
  } catch (error) {
    next(error);
  }
};
var addToWishlist = async (req, res, next) => {
  try {
    const { bookId } = req.params;
    let wishlist = await Wishlist_default.findOne({ user: req.user._id });
    if (!wishlist) {
      wishlist = new Wishlist_default({ user: req.user._id, books: [] });
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
var removeFromWishlist = async (req, res, next) => {
  try {
    const { bookId } = req.params;
    let wishlist = await Wishlist_default.findOne({ user: req.user._id });
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

// server/routes/wishlistRoutes.js
var router5 = express5.Router();
router5.use(protect);
router5.get("/", getWishlist);
router5.post("/:bookId/toggle", toggleWishlist);
router5.post("/:bookId", addToWishlist);
router5.delete("/:bookId", removeFromWishlist);
var wishlistRoutes_default = router5;

// server/routes/orderRoutes.js
import express6 from "express";

// server/controllers/orderController.js
var createOrder = async (req, res, next) => {
  try {
    const { orderItems, shippingAddress, paymentMethod, paymentResult } = req.body;
    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No order items found"
      });
    }
    if (!shippingAddress || !shippingAddress.fullName || !shippingAddress.addressLine) {
      return res.status(400).json({
        success: false,
        message: "Please provide complete shipping address details"
      });
    }
    let subtotal = 0;
    let totalDiscount = 0;
    const verifiedOrderItems = [];
    for (const item of orderItems) {
      const book = await Book_default.findById(item.book || item._id);
      if (!book) {
        return res.status(404).json({
          success: false,
          message: `Book ${item.title || item.book} not found`
        });
      }
      if (book.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for "${book.title}". Only ${book.stock} left in stock.`
        });
      }
      const itemPrice = book.discountPrice > 0 ? book.discountPrice : book.price;
      subtotal += book.price * item.quantity;
      if (book.discountPrice > 0) {
        totalDiscount += (book.price - book.discountPrice) * item.quantity;
      }
      verifiedOrderItems.push({
        book: book._id,
        title: book.title,
        image: book.image,
        price: itemPrice,
        quantity: item.quantity
      });
    }
    const shippingPrice = subtotal > 500 ? 0 : 50;
    const totalPrice = subtotal - totalDiscount + shippingPrice;
    const isOnlinePaid = paymentMethod !== "Cash on Delivery" && (paymentMethod?.includes("Instant") || paymentMethod?.includes("Direct") || paymentMethod === "Razorpay" || paymentResult && (paymentResult.status === "captured" || paymentResult.razorpayPaymentId));
    const order = new Order_default({
      user: req.user._id,
      orderItems: verifiedOrderItems,
      shippingAddress,
      paymentMethod: paymentMethod || "Instant Online Payment",
      paymentResult: paymentResult || {
        id: `pay_${Date.now()}`,
        status: isOnlinePaid ? "captured" : "pending"
      },
      subtotal,
      shippingPrice,
      discount: totalDiscount,
      totalPrice,
      isPaid: Boolean(isOnlinePaid),
      paidAt: isOnlinePaid ? Date.now() : null,
      orderStatus: "Processing",
      statusHistory: [
        {
          status: "Processing",
          timestamp: Date.now(),
          note: isOnlinePaid ? "Payment confirmed & Order placed" : "Order placed with Cash on Delivery"
        }
      ]
    });
    const createdOrder = await order.save();
    for (const item of verifiedOrderItems) {
      await Book_default.findByIdAndUpdate(item.book, {
        $inc: { stock: -item.quantity }
      });
    }
    await Cart_default.findOneAndUpdate({ user: req.user._id }, { items: [] });
    res.status(201).json({
      success: true,
      message: "Order created successfully",
      data: createdOrder
    });
  } catch (error) {
    next(error);
  }
};
var getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order_default.find({ user: req.user._id }).populate("orderItems.book", "title author image").sort({ createdAt: -1 });
    res.json({
      success: true,
      data: orders
    });
  } catch (error) {
    next(error);
  }
};
var getOrderById = async (req, res, next) => {
  try {
    const order = await Order_default.findById(req.params.id).populate("user", "name email phone").populate("orderItems.book", "title author image price discountPrice");
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }
    if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Not authorized to view this order"
      });
    }
    res.json({
      success: true,
      data: order
    });
  } catch (error) {
    next(error);
  }
};
var cancelOrder = async (req, res, next) => {
  try {
    const order = await Order_default.findById(req.params.id);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }
    if (order.user.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Not authorized to cancel this order"
      });
    }
    if (!["Pending", "Processing"].includes(order.orderStatus)) {
      return res.status(400).json({
        success: false,
        message: `Order cannot be cancelled as it is already ${order.orderStatus.toLowerCase()}`
      });
    }
    order.orderStatus = "Cancelled";
    order.statusHistory.push({
      status: "Cancelled",
      timestamp: Date.now(),
      note: `Order cancelled by ${req.user.role === "admin" ? "Administrator" : "Customer"}`
    });
    for (const item of order.orderItems) {
      await Book_default.findByIdAndUpdate(item.book, {
        $inc: { stock: item.quantity }
      });
    }
    await order.save();
    res.json({
      success: true,
      message: "Order cancelled successfully",
      data: order
    });
  } catch (error) {
    next(error);
  }
};
var getAllOrders = async (req, res, next) => {
  try {
    const { page = 1, limit = 15, status } = req.query;
    const query = {};
    if (status && status !== "All") {
      query.orderStatus = status;
    }
    const count = await Order_default.countDocuments(query);
    const orders = await Order_default.find(query).populate("user", "name email").populate("orderItems.book", "title author").sort({ createdAt: -1 }).skip((page - 1) * limit).limit(Number(limit));
    res.json({
      success: true,
      data: {
        orders,
        page: Number(page),
        pages: Math.ceil(count / limit),
        totalOrders: count
      }
    });
  } catch (error) {
    next(error);
  }
};
var updateOrderStatus = async (req, res, next) => {
  try {
    const { status, note } = req.body;
    const order = await Order_default.findById(req.params.id);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }
    order.orderStatus = status;
    if (status === "Delivered") {
      order.isDelivered = true;
      order.deliveredAt = Date.now();
      if (order.paymentMethod === "Cash on Delivery") {
        order.isPaid = true;
        order.paidAt = Date.now();
      }
    }
    order.statusHistory.push({
      status,
      timestamp: Date.now(),
      note: note || `Status updated to ${status} by admin`
    });
    const updatedOrder = await order.save();
    res.json({
      success: true,
      message: `Order status updated to ${status}`,
      data: updatedOrder
    });
  } catch (error) {
    next(error);
  }
};

// server/routes/orderRoutes.js
var router6 = express6.Router();
router6.use(protect);
router6.route("/").post(createOrder).get(admin, getAllOrders);
router6.get("/my-orders", getMyOrders);
router6.route("/:id").get(getOrderById);
router6.put("/:id/cancel", cancelOrder);
router6.put("/:id/status", admin, updateOrderStatus);
var orderRoutes_default = router6;

// server/routes/paymentRoutes.js
import express7 from "express";

// server/utils/paymentUtils.js
import Razorpay from "razorpay";
import crypto from "crypto";
var razorpayInstance = null;
var getRazorpayInstance = () => {
  const key_id = process.env.RAZORPAY_KEY_ID;
  const key_secret = process.env.RAZORPAY_KEY_SECRET;
  if (key_id && key_secret) {
    try {
      if (!razorpayInstance) {
        razorpayInstance = new Razorpay({
          key_id,
          key_secret
        });
      }
      return razorpayInstance;
    } catch (err) {
      console.warn("Razorpay initialization warning:", err.message);
    }
  }
  return null;
};
var createRazorpayOrder = async (amountInINR, receiptId) => {
  const rzp = getRazorpayInstance();
  const amountInPaise = Math.round(amountInINR * 100);
  if (rzp) {
    try {
      const options = {
        amount: amountInPaise,
        currency: "INR",
        receipt: receiptId,
        payment_capture: 1
      };
      return await rzp.orders.create(options);
    } catch (apiErr) {
      console.log(`\u2139\uFE0F Live Razorpay API returned: ${apiErr.message}. Utilizing Sandbox Test Mode.`);
    }
  }
  return {
    id: `order_mock_${Date.now()}_${Math.floor(Math.random() * 1e3)}`,
    entity: "order",
    amount: amountInPaise,
    amount_paid: 0,
    amount_due: amountInPaise,
    currency: "INR",
    receipt: receiptId,
    status: "created",
    attempts: 0,
    notes: { mode: "sandbox_test_mode" },
    created_at: Math.floor(Date.now() / 1e3)
  };
};
var verifyRazorpaySignature = (orderId, paymentId, signature) => {
  if (!orderId || orderId.startsWith("order_mock_") || signature === "mock_verified_signature" || paymentId.startsWith("pay_mock_")) {
    return true;
  }
  const key_secret = process.env.RAZORPAY_KEY_SECRET;
  if (!key_secret) return true;
  const generatedSignature = crypto.createHmac("sha256", key_secret).update(`${orderId}|${paymentId}`).digest("hex");
  return generatedSignature === signature;
};

// server/models/Payment.js
import mongoose9 from "mongoose";
var paymentSchema = new mongoose9.Schema(
  {
    order: {
      type: mongoose9.Schema.Types.ObjectId,
      ref: "Order",
      required: false
    },
    user: {
      type: mongoose9.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    razorpayOrderId: {
      type: String,
      required: true
    },
    razorpayPaymentId: {
      type: String
    },
    razorpaySignature: {
      type: String
    },
    amount: {
      type: Number,
      required: true
    },
    currency: {
      type: String,
      default: "INR"
    },
    status: {
      type: String,
      enum: ["created", "captured", "failed"],
      default: "created"
    },
    receipt: {
      type: String
    }
  },
  {
    timestamps: true
  }
);
var Payment = mongoose9.model("Payment", paymentSchema);
var Payment_default = Payment;

// server/controllers/paymentController.js
var getRazorpayKey = (req, res) => {
  res.json({
    success: true,
    data: {
      keyId: process.env.RAZORPAY_KEY_ID || "rzp_test_bookcartDemo123"
    }
  });
};
var createPaymentOrder = async (req, res, next) => {
  try {
    const { amount, receiptId } = req.body;
    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment amount"
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
        key: process.env.RAZORPAY_KEY_ID || "rzp_test_bookcartDemo123"
      }
    });
  } catch (error) {
    next(error);
  }
};
var verifyPayment = async (req, res, next) => {
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
        message: "Payment verification details missing"
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
        message: "Payment verification failed: Invalid signature"
      });
    }
    const payment = await Payment_default.create({
      order: orderId || null,
      user: req.user._id,
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature: razorpaySignature || "mock_signature",
      amount: amount || 0,
      currency: "INR",
      status: "captured"
    });
    if (orderId) {
      const order = await Order_default.findById(orderId);
      if (order) {
        order.isPaid = true;
        order.paidAt = Date.now();
        order.paymentResult = {
          id: razorpayPaymentId,
          status: "captured",
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
      message: "Payment verified and captured successfully",
      data: {
        paymentId: payment._id,
        razorpayPaymentId
      }
    });
  } catch (error) {
    next(error);
  }
};

// server/routes/paymentRoutes.js
var router7 = express7.Router();
router7.get("/key", getRazorpayKey);
router7.post("/create-order", protect, createPaymentOrder);
router7.post("/verify", protect, verifyPayment);
var paymentRoutes_default = router7;

// server/routes/reviewRoutes.js
import express8 from "express";
var router8 = express8.Router();
router8.delete("/:id", protect, deleteReview);
var reviewRoutes_default = router8;

// server/routes/adminRoutes.js
import express9 from "express";

// server/controllers/adminController.js
var getDashboardStats = async (req, res, next) => {
  try {
    const totalUsers = await User_default.countDocuments({});
    const totalBooks = await Book_default.countDocuments({});
    const totalOrders = await Order_default.countDocuments({});
    const revenueResult = await Order_default.aggregate([
      { $match: { orderStatus: { $ne: "Cancelled" } } },
      { $group: { _id: null, totalRevenue: { $sum: "$totalPrice" } } }
    ]);
    const totalRevenue = revenueResult.length > 0 ? revenueResult[0].totalRevenue : 0;
    const pendingOrders = await Order_default.countDocuments({ orderStatus: "Pending" });
    const deliveredOrders = await Order_default.countDocuments({ orderStatus: "Delivered" });
    const lowStockBooksCount = await Book_default.countDocuments({ stock: { $lte: 5 } });
    const recentOrders = await Order_default.find({}).populate("user", "name email").sort({ createdAt: -1 }).limit(5);
    const recentUsers = await User_default.find({}).select("-password").sort({ createdAt: -1 }).limit(5);
    const lowStockBooks = await Book_default.find({ stock: { $lte: 5 } }).select("title author stock price image category").limit(6);
    res.json({
      success: true,
      data: {
        totalUsers,
        totalBooks,
        totalOrders,
        totalRevenue: Math.round(totalRevenue * 100) / 100,
        pendingOrders,
        deliveredOrders,
        lowStockCount: lowStockBooksCount,
        recentOrders,
        recentUsers,
        lowStockBooks
      }
    });
  } catch (error) {
    next(error);
  }
};
var getAnalytics = async (req, res, next) => {
  try {
    const monthlyStats = await Order_default.aggregate([
      {
        $match: { orderStatus: { $ne: "Cancelled" } }
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" }
          },
          revenue: { $sum: "$totalPrice" },
          orders: { $sum: 1 }
        }
      },
      {
        $sort: { "_id.year": 1, "_id.month": 1 }
      }
    ]);
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const formattedMonthlyData = monthlyStats.map((item) => ({
      month: `${monthNames[item._id.month - 1]} ${item._id.year}`,
      revenue: Math.round(item.revenue),
      orders: item.orders
    }));
    const salesChartData = formattedMonthlyData.length > 0 ? formattedMonthlyData : [
      { month: "Mar", revenue: 14200, orders: 28 },
      { month: "Apr", revenue: 21500, orders: 42 },
      { month: "May", revenue: 18900, orders: 37 },
      { month: "Jun", revenue: 32400, orders: 64 },
      { month: "Jul", revenue: 28600, orders: 55 },
      { month: "Aug", revenue: 41200, orders: 83 }
    ];
    const statusCounts = await Order_default.aggregate([
      {
        $group: {
          _id: "$orderStatus",
          count: { $sum: 1 }
        }
      }
    ]);
    const categoryDistribution = await Book_default.aggregate([
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 }
        }
      }
    ]);
    const topBooks = await Book_default.find({}).sort({ numReviews: -1, rating: -1 }).limit(5);
    res.json({
      success: true,
      data: {
        salesChartData,
        orderStatusDistribution: statusCounts.map((s) => ({ status: s._id, count: s.count })),
        categoryDistribution: categoryDistribution.map((c) => ({ name: c._id, count: c.count })),
        topSellingBooks: topBooks
      }
    });
  } catch (error) {
    next(error);
  }
};
var getAllUsers = async (req, res, next) => {
  try {
    const pageSize = Number(req.query.limit) || 10;
    const page = Number(req.query.page) || 1;
    const query = {};
    if (req.query.search && req.query.search.trim() !== "") {
      const searchRegex = new RegExp(req.query.search.trim(), "i");
      query.$or = [{ name: searchRegex }, { email: searchRegex }];
    }
    if (req.query.role && req.query.role !== "all") {
      query.role = req.query.role;
    }
    const count = await User_default.countDocuments(query);
    const users = await User_default.find(query).select("-password").sort({ createdAt: -1 }).limit(pageSize).skip(pageSize * (page - 1));
    res.json({
      success: true,
      data: {
        users,
        page,
        pages: Math.ceil(count / pageSize),
        totalUsers: count
      }
    });
  } catch (error) {
    next(error);
  }
};
var updateUserStatus = async (req, res, next) => {
  try {
    const user = await User_default.findById(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }
    if (user._id.toString() === req.user._id.toString() && req.body.isBlocked === true) {
      return res.status(400).json({
        success: false,
        message: "You cannot block your own administrative account"
      });
    }
    if (req.body.isBlocked !== void 0) {
      user.isBlocked = Boolean(req.body.isBlocked);
    }
    if (req.body.role && ["user", "admin"].includes(req.body.role)) {
      user.role = req.body.role;
    }
    const updatedUser = await user.save();
    res.json({
      success: true,
      message: "User updated successfully",
      data: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        isBlocked: updatedUser.isBlocked
      }
    });
  } catch (error) {
    next(error);
  }
};
var deleteUser = async (req, res, next) => {
  try {
    const user = await User_default.findById(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }
    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: "You cannot delete your own administrative account"
      });
    }
    await User_default.deleteOne({ _id: user._id });
    res.json({
      success: true,
      message: "User account removed successfully"
    });
  } catch (error) {
    next(error);
  }
};

// server/middleware/uploadMiddleware.js
import multer from "multer";
import path from "path";
import fs from "fs";
import os from "os";
var isServerless = process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME || process.env.LAMBDA_TASK_ROOT;
var uploadDir = isServerless ? path.join(os.tmpdir(), "uploads") : "uploads/";
try {
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }
} catch (e) {
}
var storage = isServerless ? multer.memoryStorage() : multer.diskStorage({
  destination(req, file, cb) {
    cb(null, uploadDir);
  },
  filename(req, file, cb) {
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname).toLowerCase()}`
    );
  }
});
var checkFileType = (file, cb) => {
  const filetypes = /jpg|jpeg|png|webp|svg/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);
  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error("Images only (jpg, jpeg, png, webp, svg)!"));
  }
};
var upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  // 5MB max
  fileFilter: function(req, file, cb) {
    checkFileType(file, cb);
  }
});

// server/routes/adminRoutes.js
var router9 = express9.Router();
router9.use(protect, admin);
router9.get("/dashboard", getDashboardStats);
router9.get("/analytics", getAnalytics);
router9.route("/users").get(getAllUsers);
router9.route("/users/:id").put(updateUserStatus).delete(deleteUser);
router9.post("/upload", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: "No file uploaded"
    });
  }
  const imagePath = `/${req.file.path.replace(/\\/g, "/")}`;
  res.json({
    success: true,
    message: "Image uploaded successfully",
    data: {
      url: imagePath
    }
  });
});
var adminRoutes_default = router9;

// server/app.js
dotenv.config();
var app = express10();
app.set("trust proxy", 1);
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" }
  })
);
app.use(
  cors({
    origin: "*",
    credentials: true
  })
);
app.use(express10.json({ limit: "10mb" }));
app.use(express10.urlencoded({ extended: true, limit: "10mb" }));
app.use(async (req, res, next) => {
  try {
    await db_default();
    next();
  } catch (error) {
    console.error("Database connection error in request middleware:", error.message);
    res.status(500).json({
      success: false,
      message: `Database Connection Failed: ${error.message}`
    });
  }
});
app.get("/api/health", (req, res) => {
  res.json({
    status: "online",
    message: "BookCart API Server is healthy and running",
    timestamp: (/* @__PURE__ */ new Date()).toISOString()
  });
});
app.get("/health", (req, res) => {
  res.json({
    status: "online",
    message: "BookCart API Server is healthy and running",
    timestamp: (/* @__PURE__ */ new Date()).toISOString()
  });
});
app.use("/api/auth", authRoutes_default);
app.use("/auth", authRoutes_default);
app.use("/api/books", bookRoutes_default);
app.use("/books", bookRoutes_default);
app.use("/api/categories", categoryRoutes_default);
app.use("/categories", categoryRoutes_default);
app.use("/api/cart", cartRoutes_default);
app.use("/cart", cartRoutes_default);
app.use("/api/wishlist", wishlistRoutes_default);
app.use("/wishlist", wishlistRoutes_default);
app.use("/api/orders", orderRoutes_default);
app.use("/orders", orderRoutes_default);
app.use("/api/payment", paymentRoutes_default);
app.use("/payment", paymentRoutes_default);
app.use("/api/reviews", reviewRoutes_default);
app.use("/reviews", reviewRoutes_default);
app.use("/api/admin", adminRoutes_default);
app.use("/admin", adminRoutes_default);
app.use(notFound);
app.use(errorHandler);
var app_default = app;
export {
  app_default as default
};

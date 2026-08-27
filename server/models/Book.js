import mongoose from 'mongoose';

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide book title'],
      trim: true
    },
    author: {
      type: String,
      required: [true, 'Please provide author name'],
      trim: true
    },
    description: {
      type: String,
      required: [true, 'Please provide book description']
    },
    category: {
      type: String,
      required: [true, 'Please specify a category'],
      trim: true
    },
    price: {
      type: Number,
      required: [true, 'Please provide book price'],
      min: [0, 'Price cannot be negative']
    },
    discountPrice: {
      type: Number,
      default: 0,
      min: [0, 'Discount price cannot be negative']
    },
    stock: {
      type: Number,
      required: [true, 'Please provide stock count'],
      default: 0,
      min: [0, 'Stock cannot be negative']
    },
    isbn: {
      type: String,
      trim: true,
      default: '978-0-0000-0000-0'
    },
    publisher: {
      type: String,
      default: 'Penguin Random House'
    },
    language: {
      type: String,
      default: 'English'
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
      required: [true, 'Please provide book cover image URL'],
      default: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=800'
    },
    rating: {
      type: Number,
      default: 0,
      min: [0, 'Rating cannot be below 0'],
      max: [5, 'Rating cannot exceed 5']
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

// Add text indexes for lightning search
bookSchema.index({ title: 'text', author: 'text', description: 'text', category: 'text' });

const Book = mongoose.model('Book', bookSchema);
export default Book;

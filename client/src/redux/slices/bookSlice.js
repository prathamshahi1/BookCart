import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

// Async Thunks
export const fetchBooks = createAsyncThunk(
  'books/fetchBooks',
  async (params = {}, { rejectWithValue }) => {
    try {
      const queryParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          queryParams.append(key, value);
        }
      });
      const { data } = await api.get(`/books?${queryParams.toString()}`);
      return data.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchFeaturedBooks = createAsyncThunk(
  'books/fetchFeaturedBooks',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get('/books/featured');
      return data.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchBestSellers = createAsyncThunk(
  'books/fetchBestSellers',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get('/books/bestsellers');
      return data.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchNewArrivals = createAsyncThunk(
  'books/fetchNewArrivals',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get('/books/new-arrivals');
      return data.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchBookDetails = createAsyncThunk(
  'books/fetchBookDetails',
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/books/${id}`);
      return data.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchFilterOptions = createAsyncThunk(
  'books/fetchFilterOptions',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get('/books/filters');
      return data.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const submitBookReview = createAsyncThunk(
  'books/submitBookReview',
  async ({ bookId, rating, comment }, { rejectWithValue }) => {
    try {
      const { data } = await api.post(`/books/${bookId}/reviews`, { rating, comment });
      return data.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const bookSlice = createSlice({
  name: 'books',
  initialState: {
    books: [],
    page: 1,
    pages: 1,
    totalBooks: 0,
    featuredBooks: [],
    bestSellers: [],
    newArrivals: [],
    currentBook: null,
    relatedBooks: [],
    reviews: [],
    filterOptions: {
      categories: [],
      authors: [],
      priceRange: { minPrice: 0, maxPrice: 2000 }
    },
    loading: false,
    detailsLoading: false,
    reviewLoading: false,
    error: null
  },
  reducers: {
    clearCurrentBook: (state) => {
      state.currentBook = null;
      state.relatedBooks = [];
      state.reviews = [];
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Books
      .addCase(fetchBooks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBooks.fulfilled, (state, action) => {
        state.loading = false;
        state.books = action.payload.books;
        state.page = action.payload.page;
        state.pages = action.payload.pages;
        state.totalBooks = action.payload.totalBooks;
      })
      .addCase(fetchBooks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Featured
      .addCase(fetchFeaturedBooks.fulfilled, (state, action) => {
        state.featuredBooks = action.payload;
      })
      // Best Sellers
      .addCase(fetchBestSellers.fulfilled, (state, action) => {
        state.bestSellers = action.payload;
      })
      // New Arrivals
      .addCase(fetchNewArrivals.fulfilled, (state, action) => {
        state.newArrivals = action.payload;
      })
      // Book Details
      .addCase(fetchBookDetails.pending, (state) => {
        state.detailsLoading = true;
        state.error = null;
      })
      .addCase(fetchBookDetails.fulfilled, (state, action) => {
        state.detailsLoading = false;
        state.currentBook = action.payload.book;
        state.relatedBooks = action.payload.relatedBooks;
        state.reviews = action.payload.reviews;
      })
      .addCase(fetchBookDetails.rejected, (state, action) => {
        state.detailsLoading = false;
        state.error = action.payload;
      })
      // Filters
      .addCase(fetchFilterOptions.fulfilled, (state, action) => {
        state.filterOptions = action.payload;
      })
      // Submit Review
      .addCase(submitBookReview.pending, (state) => {
        state.reviewLoading = true;
      })
      .addCase(submitBookReview.fulfilled, (state, action) => {
        state.reviewLoading = false;
        const existsIndex = state.reviews.findIndex(
          (r) => r.user?._id === action.payload.user?._id || r.user === action.payload.user
        );
        if (existsIndex > -1) {
          state.reviews[existsIndex] = action.payload;
        } else {
          state.reviews.unshift(action.payload);
        }
      })
      .addCase(submitBookReview.rejected, (state, action) => {
        state.reviewLoading = false;
      });
  }
});

export const { clearCurrentBook } = bookSlice.actions;
export default bookSlice.reducer;

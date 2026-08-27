import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

// Async Thunks
export const fetchCart = createAsyncThunk(
  'cart/fetchCart',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get('/cart');
      return data?.data || null;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch cart');
    }
  }
);

export const addToCart = createAsyncThunk(
  'cart/addToCart',
  async ({ bookId, quantity = 1 }, { rejectWithValue }) => {
    try {
      const { data } = await api.post('/cart', { bookId, quantity });
      return data?.data || null;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to add to cart');
    }
  }
);

export const updateCartQuantity = createAsyncThunk(
  'cart/updateCartQuantity',
  async ({ bookId, quantity }, { rejectWithValue }) => {
    try {
      const { data } = await api.put(`/cart/${bookId}`, { quantity });
      return data?.data || null;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to update quantity');
    }
  }
);

export const removeFromCart = createAsyncThunk(
  'cart/removeFromCart',
  async (bookId, { rejectWithValue }) => {
    try {
      const { data } = await api.delete(`/cart/${bookId}`);
      return data?.data || null;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to remove from cart');
    }
  }
);

export const clearCart = createAsyncThunk(
  'cart/clearCart',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.delete('/cart');
      return data?.data || null;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to clear cart');
    }
  }
);

const initialState = {
  items: [],
  subtotal: 0,
  totalDiscount: 0,
  shipping: 0,
  finalTotal: 0,
  totalItemsCount: 0,
  loading: false,
  error: null
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    resetCart: (state) => {
      state.items = [];
      state.subtotal = 0;
      state.totalDiscount = 0;
      state.shipping = 0;
      state.finalTotal = 0;
      state.totalItemsCount = 0;
      state.loading = false;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    const handleCartUpdate = (state, action) => {
      state.loading = false;
      state.error = null;
      if (action.payload && typeof action.payload === 'object') {
        state.items = Array.isArray(action.payload.items) ? action.payload.items : [];
        state.subtotal = Number(action.payload.subtotal) || 0;
        state.totalDiscount = Number(action.payload.totalDiscount) || 0;
        state.shipping = Number(action.payload.shipping) || 0;
        state.finalTotal = Number(action.payload.finalTotal) || 0;
        state.totalItemsCount = Number(action.payload.totalItemsCount) || 0;
      }
    };

    const handlePending = (state) => {
      state.loading = true;
      state.error = null;
    };

    const handleRejected = (state, action) => {
      state.loading = false;
      state.error = action.payload || 'Cart operation failed';
    };

    builder
      // Fetch Cart
      .addCase(fetchCart.pending, handlePending)
      .addCase(fetchCart.fulfilled, handleCartUpdate)
      .addCase(fetchCart.rejected, handleRejected)

      // Add to Cart
      .addCase(addToCart.pending, handlePending)
      .addCase(addToCart.fulfilled, handleCartUpdate)
      .addCase(addToCart.rejected, handleRejected)

      // Update Qty
      .addCase(updateCartQuantity.pending, handlePending)
      .addCase(updateCartQuantity.fulfilled, handleCartUpdate)
      .addCase(updateCartQuantity.rejected, handleRejected)

      // Remove
      .addCase(removeFromCart.pending, handlePending)
      .addCase(removeFromCart.fulfilled, handleCartUpdate)
      .addCase(removeFromCart.rejected, handleRejected)

      // Clear
      .addCase(clearCart.pending, handlePending)
      .addCase(clearCart.fulfilled, handleCartUpdate)
      .addCase(clearCart.rejected, handleRejected);
  }
});

export const { resetCart } = cartSlice.actions;
export default cartSlice.reducer;

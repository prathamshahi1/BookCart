import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import bookReducer from './slices/bookSlice';
import cartReducer from './slices/cartSlice';
import wishlistReducer from './slices/wishlistSlice';
import orderReducer from './slices/orderSlice';
import adminReducer from './slices/adminSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    books: bookReducer,
    cart: cartReducer,
    wishlist: wishlistReducer,
    order: orderReducer,
    orders: orderReducer,
    admin: adminReducer
  },
  devTools: process.env.NODE_ENV !== 'production'
});

export default store;

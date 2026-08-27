import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

const userInfoFromStorage = localStorage.getItem('userInfo')
  ? JSON.parse(localStorage.getItem('userInfo'))
  : null;

// Async Thunks
export const login = createAsyncThunk(
  'auth/login',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const { data } = await api.post('/auth/login', { email, password });
      localStorage.setItem('userInfo', JSON.stringify(data.data));
      return data.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const register = createAsyncThunk(
  'auth/register',
  async ({ name, email, password, confirmPassword }, { rejectWithValue }) => {
    try {
      const { data } = await api.post('/auth/register', {
        name,
        email,
        password,
        confirmPassword
      });
      localStorage.setItem('userInfo', JSON.stringify(data.data));
      return data.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const getProfile = createAsyncThunk(
  'auth/getProfile',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get('/auth/me');
      return data.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateProfile = createAsyncThunk(
  'auth/updateProfile',
  async (userData, { rejectWithValue }) => {
    try {
      const { data } = await api.put('/auth/profile', userData);
      localStorage.setItem('userInfo', JSON.stringify(data.data));
      return data.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const addAddress = createAsyncThunk(
  'auth/addAddress',
  async (addressData, { rejectWithValue }) => {
    try {
      const { data } = await api.post('/auth/address', addressData);
      return data.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const removeAddress = createAsyncThunk(
  'auth/removeAddress',
  async (addressId, { rejectWithValue }) => {
    try {
      const { data } = await api.delete(`/auth/address/${addressId}`);
      return data.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    userInfo: userInfoFromStorage,
    profile: null,
    loading: false,
    error: null,
    success: false
  },
  reducers: {
    logout: (state) => {
      localStorage.removeItem('userInfo');
      state.userInfo = null;
      state.profile = null;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
      state.success = false;
    }
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.userInfo = action.payload;
        state.success = true;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Register
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.userInfo = action.payload;
        state.success = true;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get Profile
      .addCase(getProfile.fulfilled, (state, action) => {
        state.profile = action.payload;
      })
      .addCase(getProfile.rejected, (state) => {
        state.userInfo = null;
        state.profile = null;
        localStorage.removeItem('userInfo');
      })
      // Update Profile
      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.userInfo = action.payload;
        state.profile = action.payload;
        state.success = true;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Address operations
      .addCase(addAddress.fulfilled, (state, action) => {
        if (state.profile) {
          state.profile.addresses = action.payload;
        }
        if (state.userInfo) {
          state.userInfo.addresses = action.payload;
        }
      })
      .addCase(removeAddress.fulfilled, (state, action) => {
        if (state.profile) {
          state.profile.addresses = action.payload;
        }
        if (state.userInfo) {
          state.userInfo.addresses = action.payload;
        }
      });
  }
});

export const fetchUserProfile = getProfile;
export const { logout, clearError, clearError: clearAuthError } = authSlice.actions;
export default authSlice.reducer;

/*
  File: productSlice.js
  Thư viện sử dụng:
  - @reduxjs/toolkit: createSlice để tạo reducer và actions
  Mục đích: Quản lý state và actions cho products trong Redux store.
*/
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const STORAGE_KEY = 'products_data';

// Async thunk để fetch products từ localStorage hoặc API
export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (_, { rejectWithValue }) => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
      const response = await fetch('/products.json');
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      const data = await response.json();
      const products = data.products;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
      return products;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const productSlice = createSlice({
  name: 'products',
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {
    // Thêm sản phẩm mới
    addProduct: (state, action) => {
      const newProduct = action.payload;
      state.items.push(newProduct);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.items));
    },
    // Cập nhật sản phẩm
    updateProduct: (state, action) => {
      const { id, ...updatedData } = action.payload;
      const index = state.items.findIndex(p => p.id === id);
      if (index !== -1) {
        state.items[index] = { ...state.items[index], ...updatedData };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state.items));
      }
    },
    // Xóa sản phẩm
    deleteProduct: (state, action) => {
      const id = action.payload;
      state.items = state.items.filter(p => p.id !== id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.items));
    },
    // Clear error
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
        state.error = null;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { addProduct, updateProduct, deleteProduct, clearError } = productSlice.actions;
export default productSlice.reducer;


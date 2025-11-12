/*
  File: store/index.js
  Thư viện sử dụng:
  - @reduxjs/toolkit: configureStore để tạo Redux store
  Mục đích: Cấu hình và export Redux store cho ứng dụng.
*/
import { configureStore } from '@reduxjs/toolkit';
import productReducer from './slices/productSlice';

export const store = configureStore({
  reducer: {
    products: productReducer,
  },
});

export default store;


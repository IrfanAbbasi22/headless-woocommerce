import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchWooCommerceCart } from '../../api/fetchAndSyncCart';

export const loadCartFromWoo = createAsyncThunk(
    'cart/loadCartFromWoo',
    async () => {
      const data = await fetchWooCommerceCart();
      return data;
    }
  );
  
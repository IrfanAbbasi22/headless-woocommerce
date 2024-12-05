// redux/cartSlice.js
import { createSlice } from '@reduxjs/toolkit';

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: [],
    totals: { 
        "total_items": "0",
        "total_price": "0",
    },
  },
  reducers: {
    addToCart(state, action) {
      const product = action.payload;
      const existingItem = state.items.find((item) => item.id === product.id);
      if (existingItem) {
        existingItem.qty += 1;
        console.log('state1', existingItem.qty);
      } else {
        state.items.push({ ...product, qty: 1 });
      }

      // Update total_items
      state.totals.total_items = state.items.reduce((total, item) => total + item.qty, 0);
      state.totals.total_price = state.items.reduce((total, item) => total + item.qty * item.price, 0);

    },
    updateQty(state, action) {
      const { id, qty } = action.payload;
      const itemIndex = state.items.findIndex((item) => item.id === id);
  
      if (itemIndex !== -1) {
        if (qty === 0) {
          state.items.splice(itemIndex, 1);
        } else {
          state.items[itemIndex].qty = qty;
        }
      }

      // Update total_items
      state.totals.total_items = state.items.reduce((total, item) => total + item.qty, 0);
      state.totals.total_price = state.items.reduce((total, item) => total + item.qty * item.price, 0);
    },
    removeFromCart(state, action) {
        state.items = state.items.filter(item => item.id !== action.payload);

        // Update total_items
        state.totals.total_items = state.items.reduce((total, item) => total + item.qty, 0);
        state.totals.total_price = state.items.reduce((total, item) => total + item.price * item.qty, 0);

    }
  },
});

// Total Selected Items
export const selectCartItems = (state) => state.cart.items;

// Total Items Count
export const selectTotalItems = (state) =>
    state.cart.items.reduce((total, item) => total + item.qty, 0);

// Total Price
export const selectedItemsTotalPrice = (state) =>
    state.cart.items.reduce((total, item) => total + item.price * item.qty, 0);

export const { addToCart, updateQty, removeFromCart } = cartSlice.actions;
export default cartSlice.reducer;

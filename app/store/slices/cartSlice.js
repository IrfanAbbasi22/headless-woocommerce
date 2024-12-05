// redux/cartSlice.js
import { createSlice } from '@reduxjs/toolkit';

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    // Product list
    items: [],
    // Total Items
    items_count: 0,

    // Billing Address
    billing_address: {},
    shipping_address: {},
    totals: { 
      "total_items": 0,
      "total_price": 0,
      "currency_prefix": '',
    },
    // Coupons Data
    coupons: [],
    itemsPreloader: false,
  },
  reducers: {
    // Set the cart data from WooCommerce API
    setCart(state, action) {
      // state.items = action.payload.items;
      // state.totals.total_items = action.payload.totals.total_items;
      state.totals.total_price = action.payload.totals.total_price;
      state.currencySymbol = action.payload.currencySymbol;
    },

    addToCart(state, action) {
      const product = action.payload;
      const existingItem = state.items.find((item) => item.id === product.id);
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.items.push({ ...product, quantity: 1 });
      }
    },

    updateQty(state, action) {
      const { id, qty } = action.payload;
      const itemIndex = state.items.findIndex((item) => item.id === id);

      if (itemIndex !== -1) {
        if (qty === 0) {
          state.items.splice(itemIndex, 1);
        } else {
          state.items[itemIndex].quantity = qty;
        }
      }

      state.items_count = state.items.reduce((total, item) => total + item.quantity, 0);
    },

    removeFromCart(state, action) {
      const itemId = action.payload;
      state.items = state.items.filter(item => item.id !== itemId);

      state.items_count = state.items.reduce((total, item) => total + item.quantity, 0);
    },

    // Load WooCommerce cart into Redux (used when the page loads)
    loadCartFromWoo(state, action) {
      const data = action.payload
      // console.log('data woo2', data);
      state.items = data?.items;
      state.items_count = parseInt(data?.items_count, 10);
      state.totals = data?.totals;
      state.billing_address = data?.billing_address;
      state.shipping_address = data?.shipping_address;
      state.coupons = data?.coupons;
      // state.totals.currency_prefix = data?.totals?.currency_prefix;
    },
    
    toggleChangesPreloader(state, action) {
      const res = action.payload
      state.itemsPreloader = res;
    },

    resetAfterOrderCreation(state, action) {
      return {
        ...state, // Retain any top-level properties not being reset
        items: [], // Reset the product list
        items_count: 0, // Reset the total items count
    
        // Reset addresses
        billing_address: {},
        shipping_address: {},
    
        // Reset totals
        totals: {
          total_items: 0,
          total_price: 0,
          currency_prefix: '',
        },

        // Reset Coupons
        coupons: [],
    
        // Reset any other properties
        itemsPreloader: false,
      };
    }
  },
});

// Selectors
export const cartDetails = (state) => state.cart;
export const selectCartItems = (state) => state.cart.items;
export const selectTotalItems = (state) => state.cart.items_count;
export const selectedItemsTotalPrice = (state) => state.cart.totals.total_price;
export const cartChangesPreloader = (state) => state.cart.itemsPreloader;

export const { addToCart, updateQty, removeFromCart, toggleChangesPreloader, setCart, resetAfterOrderCreation, loadCartFromWoo } = cartSlice.actions;
export default cartSlice.reducer;
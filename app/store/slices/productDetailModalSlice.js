import { createSlice } from "@reduxjs/toolkit";

const productDetailModalSlice = createSlice({
  name: "productDetailModal",
  initialState: {
    isOpen: false,
    productDetails: null,
  },
  reducers: {
    openModal: (state, action) => {
      state.isOpen = true;
      state.productDetails = action.payload;

      console.log('inside acrion', state)
    },
    closeModal: (state) => {
      state.isOpen = false;
      state.productDetails = null;
    },
  },
});

export const { openModal, closeModal } = productDetailModalSlice.actions;
export default productDetailModalSlice.reducer;

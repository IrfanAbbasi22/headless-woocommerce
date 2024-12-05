import { createSlice } from '@reduxjs/toolkit';


const initialState = {
  currentStep: 'cart', // 'cart', 'shipping', or 'payment'
};

const cartStepsSlice = createSlice({
  name: 'cartSteps',
  initialState,
  reducers: {
    setCurrentStep: (state, action) => {
      state.currentStep = action.payload;
    },
  },
});


export const currentSelectedStep = (state) => state.cartSteps.currentStep;

export const { setCurrentStep } = cartStepsSlice.actions;
export default cartStepsSlice.reducer;
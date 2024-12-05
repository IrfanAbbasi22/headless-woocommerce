import { configureStore } from '@reduxjs/toolkit';
import counterReducer from './slices/counterSlice';
import productDetailModalReducer from './slices/productDetailModalSlice';
import cartReducer from './slices/cartSlice';
import cartStepsReducer from './slices/cartStepsSlice';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // Default to localStorage

// Persistence configuration
const persistConfig = {
  key: 'root',
  storage,
};

const cartPersistedReducer = persistReducer(persistConfig, cartReducer);

export const store = configureStore({
  reducer: {
    productDetailModal: productDetailModalReducer,
    cart: cartPersistedReducer,
    cartSteps: cartStepsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);

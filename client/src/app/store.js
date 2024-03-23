import { configureStore } from '@reduxjs/toolkit';
import tradesReducer from '../features/trades/tradesSlice';
import userReducer from '../features/user/userSlice';
import itemsReducer from '../features/items/itemsSlice';

export const store = configureStore({
  reducer: {
    trades: tradesReducer,
    user: userReducer,
    items: itemsReducer,
  },
});

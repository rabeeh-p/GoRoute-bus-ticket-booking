import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slice/userSlicer';

const store = configureStore({
  reducer: {
    user: userReducer,
  },
});

export default store;

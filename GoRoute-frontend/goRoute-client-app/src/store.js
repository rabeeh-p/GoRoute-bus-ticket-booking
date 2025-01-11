import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slice/userSlicer';
import busReducer from './slice/busSlice'; 

const store = configureStore({
  reducer: {
    user: userReducer,
    // bus: busReducer
  },
});

export default store;

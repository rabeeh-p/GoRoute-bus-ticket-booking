import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  token: null,
  userType: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    // setToken: (state, action) => {
    //   const { token, expiry } = action.payload;
    //   state.token = token;
    // },
    setToken: (state, action) => {
      const { access } = action.payload;  // Directly use 'access'
      state.token = access;
    },
    setUserType: (state, action) => {
      state.userType = action.payload;
    },
    clearUserData: (state) => {
      state.token = null;
      state.userType = null;
      state.tokenExpiry = null;
    },
  },
});

export const { setToken, setUserType, clearUserData } = userSlice.actions;
export default userSlice.reducer;

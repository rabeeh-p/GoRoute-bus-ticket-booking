import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    buses: [],
    loading: false,
    error: '',
    searchParams: {} // New state for storing search parameters
  };
  
  const busSlice = createSlice({
    name: 'bus',
    initialState,
    reducers: {
      setBuses: (state, action) => {
        state.buses = action.payload;
      },
      setLoading: (state, action) => {
        state.loading = action.payload;
      },
      setError: (state, action) => {
        state.error = action.payload;
      },
      setSearchParams: (state, action) => {
        state.searchParams = action.payload;
      },
    },
  });
  
  export const { setBuses, setLoading, setError, setSearchParams } = busSlice.actions;
  export default busSlice.reducer;
  
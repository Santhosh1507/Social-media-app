import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  recommendedUsers: [], // Array for recommended users
  loading: false, // Loading status
  error: null, // Error handling
};

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    setRecommendedUsers: (state, action) => {
      state.recommendedUsers = action.payload; // Update recommended users
    },
    setLoading: (state, action) => {
      state.loading = action.payload; // Update loading status
    },
    setError: (state, action) => {
      state.error = action.payload; // Update error status
    },
  },
});

export const { setRecommendedUsers, setLoading, setError } = usersSlice.actions;
export default usersSlice.reducer;

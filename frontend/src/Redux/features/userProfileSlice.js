// Redux/features/userProfileSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { axiosInstance } from '../../lib/axios';

export const fetchUserProfile = createAsyncThunk(
  'userProfile/fetchByUsername',
  async (username) => {
    const response = await axiosInstance.get(`/users/${username}`);
    return response.data;
  }
);

export const updateUserProfile = createAsyncThunk(
  'userProfile/updateProfile',
  async (updatedData) => {
    const response = await axiosInstance.put('/users/profile', updatedData);
    return response.data;
  }
);

export const deleteUserAccount = createAsyncThunk(
  'userProfile/deleteAccount',
  async (userId) => {
    await axiosInstance.delete(`/auth/delete/${userId}`);
  }
);

const userProfileSlice = createSlice({
  name: 'userProfile',
  initialState: {
    profile: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.profile = action.payload;
        state.loading = false;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.profile = action.payload; // Update the profile in the store
      })
      .addCase(deleteUserAccount.fulfilled, (state) => {
        state.profile = null; // Clear the profile after deletion
      });
  },
});

export default userProfileSlice.reducer;

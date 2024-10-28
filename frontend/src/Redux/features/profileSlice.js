// Redux/features/profileSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { axiosInstance } from '../../lib/axios';
import { toast } from 'react-hot-toast';

// Thunks
export const fetchConnectionStatus = createAsyncThunk(
  'connections/fetchStatus',
  async (userId) => {
    const response = await axiosInstance.get(`/connections/status/${userId}`);
    return response.data;
  }
);

export const sendConnectionRequest = createAsyncThunk(
  'connections/sendRequest',
  async (userId) => {
    const response = await axiosInstance.post(`/connections/request/${userId}`);
    return response.data;
  }
);

export const acceptRequest = createAsyncThunk(
  'connections/acceptRequest',
  async (requestId) => {
    const response = await axiosInstance.put(`/connections/accept/${requestId}`);
    return response.data;
  }
);

export const rejectRequest = createAsyncThunk(
  'connections/rejectRequest',
  async (requestId) => {
    const response = await axiosInstance.put(`/connections/reject/${requestId}`);
    return response.data;
  }
);

export const removeConnection = createAsyncThunk(
  'profile/removeConnection',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete(`/connections/${userId}`);
      toast.success('Connection removed');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'An error occurred');
    }
  }
);

// Initial state
const initialState = {
  connectionStatus: null,
  loading: false,
  error: null,
};

// Slice
// Slice
const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Connection Status
      .addCase(fetchConnectionStatus.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchConnectionStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.status[action.meta.arg] = action.payload; // userId
      })
      .addCase(fetchConnectionStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(sendConnectionRequest.fulfilled, (state, action) => {
        // Handle request success if needed
      })
      .addCase(acceptRequest.fulfilled, (state, action) => {
        // Handle acceptance success if needed
      })
      .addCase(rejectRequest.fulfilled, (state, action) => {
        // Handle rejection success if needed
      })

      // Remove Connection
      .addCase(removeConnection.pending, (state) => {
        state.loading = true;
      })
      .addCase(removeConnection.fulfilled, (state, action) => {
        // Update state to reflect removal
        state.loading = false;
      })
      .addCase(removeConnection.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const selectConnectionStatus = (state, userId) => state.connections.status[userId];
export const selectLoading = (state) => state.connections.loading;
export const selectError = (state) => state.connections.error;


export default profileSlice.reducer;

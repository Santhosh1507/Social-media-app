import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { axiosInstance } from '../../lib/axios'; // Adjust the path accordingly
import { toast } from 'react-hot-toast';

// Thunk to fetch messages for a selected conversation
export const fetchMessages = createAsyncThunk(
  'messages/fetchMessages',
  async (conversationId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/messages/${conversationId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch messages');
    }
  }
);

// Thunk to send a message
export const sendMessage = createAsyncThunk(
  'messages/sendMessage',
  async ({ conversationId, message }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`/messages/send/${conversationId}`, { message });
      return response.data; // Assuming this contains the new message
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to send message');
    }
  }
);

// Initial state
const initialState = {
  messages: [],
  loading: false,
  error: null,
  optimisticMessage: null, // To handle optimistic UI
};

// Slice
const messagesSlice = createSlice({
  name: 'messages',
  initialState,
  reducers: {
    clearMessages(state) {
      state.messages = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch messages
      .addCase(fetchMessages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        state.messages = action.payload;
        state.loading = false;
      })
      .addCase(fetchMessages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(action.payload); // Show error message
      })

      // Send message with optimistic update
      .addCase(sendMessage.pending, (state, action) => {
        state.loading = true;
        state.error = null;
        state.optimisticMessage = action.meta.arg.message; // Add the optimistic message
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.messages.push(action.payload); // Confirm and add the real message
        state.loading = false;
        state.optimisticMessage = null; // Clear the optimistic message
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(action.payload); // Show error message
        state.optimisticMessage = null; // Rollback the optimistic message
      });
  },
});

// Export actions and reducer
export const { clearMessages } = messagesSlice.actions;
export default messagesSlice.reducer;

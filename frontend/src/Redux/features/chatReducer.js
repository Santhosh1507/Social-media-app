// chatReducer.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "../../lib/axios";
import toast from "react-hot-toast";

export const fetchConversations = createAsyncThunk(
  "conversations/fetchConversations",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.get("/users");
      return data;
    } catch (error) {
      toast.error(
        error.response?.data?.error || "Failed to fetch conversations"
      );
      return rejectWithValue(error.response?.data);
    }
  }
);

export const fetchMessages = createAsyncThunk(
  "messages/fetchMessages",
  async (conversationId, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.get(`/messages/${conversationId}`);
      return data;
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to load messages");
      return rejectWithValue(error.response?.data);
    }
  }
);

export const sendMessage = createAsyncThunk(
  "messages/sendMessages",
  async ({ conversationId, message }, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.post(
        `/messages/send/${conversationId}`,
        { message }
      );
      return data; // Assuming the response contains the new message
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to send message");
      return rejectWithValue(error.response?.data);
    }
  }
);
// Async thunk to send a message

// Create a slice for chat
const chatSlice = createSlice({
  name: "chat",
  initialState: {
    loading: false,
    conversations: [],
    messages: [],
    selectedConversation: null,
    error: null,
  },
  reducers: {
    addMessage: (state, action) => {
      state.messages.push(action.payload);
    },
    setMessages: (state, action) => {
      state.messages = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchConversations.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchConversations.fulfilled, (state, action) => {
        state.loading = false;
        state.conversations = action.payload;
      })
      .addCase(fetchConversations.rejected, (state) => {
        state.loading = false;
      })
      .addCase(fetchMessages.pending, (state) => {
        state.loading = true; // Set loading to true while fetching
        state.error = null; // Clear any previous errors
      })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        state.loading = false; // Set loading to false when fetching is done
        state.messages = action.payload; // Store fetched messages
      })
      .addCase(fetchMessages.rejected, (state, action) => {
        state.loading = false; // Set loading to false on error
        state.error = action.payload; // Optionally store the error message
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.messages.push(action.payload);
      });
  },
});

export const { addMessage, setMessages } = chatSlice.actions;
// Export the reducer
export default chatSlice.reducer;

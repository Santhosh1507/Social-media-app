// chatReducer.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { axiosInstance } from '../../lib/axios';

// Async thunk to get messages
export const getMessages = createAsyncThunk(
    'chat/fetchMessages',
    async (userId) => {
        const response = await axiosInstance.get(`/api/messages/${userId}`);
        return response.data; // returns the list of messages
    }
);

// Async thunk to send a message
export const sendMessage = createAsyncThunk(
    'chat/sendMessage',
    async ({ receiverId, messageContent }) => {
        const response = await axiosInstance.post(`/api/messages/send/${receiverId}`, { message: messageContent });
        return response.data.message; // returns the new message
    }
);

// Create a slice for chat
const chatSlice = createSlice({
    name: 'chat',
    initialState: {
        messages: [],
        currentConversation: null,
    },
    reducers: {
        setCurrentConversation: (state, action) => {
            state.currentConversation = action.payload; // set current conversation
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getMessages.fulfilled, (state, action) => {
                state.messages = action.payload; // update messages on fetch
            })
            .addCase(sendMessage.fulfilled, (state, action) => {
                state.messages.push(action.payload); // add new message to messages
            });
    },
});

// Export actions
export const { setCurrentConversation } = chatSlice.actions;

// Export the reducer
export default chatSlice.reducer;

// chatActions.js
import { axiosInstance } from "./axios";

// Action Types
export const GET_MESSAGES = 'GET_MESSAGES';
export const SEND_MESSAGE = 'SEND_MESSAGE';
export const SET_CURRENT_CONVERSATION = 'SET_CURRENT_CONVERSATION';

// Get messages of a conversation
export const getMessages = (userId) => async (dispatch) => {
    try {
        const res = await axiosInstance.get(`/api/messages/${userId}`);
        dispatch({
            type: GET_MESSAGES,
            payload: res.data, // list of messages
        });
    } catch (error) {
        console.error("Error fetching messages", error);
    }
};

// Send a message
export const sendMessage = (receiverId, messageContent) => async (dispatch) => {
    try {
        const res = await axiosInstance.post(`/api/messages/send/${receiverId}`, { message: messageContent });
        dispatch({
            type: SEND_MESSAGE,
            payload: res.data.message, // new message
        });
    } catch (error) {
        console.error("Error sending message", error);
    }
};

// Set current conversation
export const setCurrentConversation = (conversation) => ({
    type: SET_CURRENT_CONVERSATION,
    payload: conversation, // conversation object
});

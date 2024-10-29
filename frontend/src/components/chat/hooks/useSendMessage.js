import { useState } from "react";
import { addMessage } from '../../../Redux/features/chatReducer';
import useConversation from "../zustand/useConversation";
import toast from "react-hot-toast";
import { axiosInstance } from "../../../lib/axios"; 
import { useDispatch } from 'react-redux';
import { sendMessage } from '../../../Redux/features/chatReducer';// Import your axios instance

const useSendMessage = () => {
  // const [loading, setLoading] = useState(false);
  // const { messages, setMessages, selectedConversation } = useConversation();
  // const dispatch = useDispatch();
  // const { selectedConversation } = useConversation();
  // const [loading, setLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const sendMessageAction  = async (conversationId, message) => {
    setLoading(true);
    try {
      await dispatch(sendMessage({ conversationId, message }));
    } catch (error) {
      // Handle axios specific error format
      const errorMessage = error.response?.data?.error || error.message;
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return { sendMessageAction, loading };
};

export default useSendMessage;

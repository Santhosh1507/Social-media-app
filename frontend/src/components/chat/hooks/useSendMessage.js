import { useState } from "react";
import useConversation from "../zustand/useConversation";
import toast from "react-hot-toast";
import { axiosInstance } from "../../../lib/axios"; // Import your axios instance

const useSendMessage = () => {
  const [loading, setLoading] = useState(false);
  const { messages, setMessages, selectedConversation } = useConversation();

  const sendMessage = async (message) => {
    setLoading(true);
    try {
      const res = await axiosInstance.post(
        `/messages/send/${selectedConversation._id}`,
        {
          message,
        }
      );

      const data = res.data;
      if (data.error) throw new Error(data.error);

      // Ensure messages is an array before setting
      setMessages((prevMessages) =>
        Array.isArray(prevMessages) ? [...prevMessages, data] : [data]
      );
    } catch (error) {
      // Handle axios specific error format
      const errorMessage = error.response?.data?.error || error.message;
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return { sendMessage, loading };
};

export default useSendMessage;

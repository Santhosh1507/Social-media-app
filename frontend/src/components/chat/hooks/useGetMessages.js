import { useEffect } from "react";
import useConversation from "../zustand/useConversation";
import toast from "react-hot-toast";
import { axiosInstance } from "../../../lib/axios"; 
import { useDispatch, useSelector } from 'react-redux';
import { fetchMessages } from '../../../Redux/features/chatReducer';// Assuming this is your axios instance

const useGetMessages = () => {
//   const [loading, setLoading] = useState(false);
//   const { messages, setMessages, selectedConversation } = useConversation();
const dispatch = useDispatch();
  const { selectedConversation } = useConversation();
  const { loading, messages } = useSelector((state) => state.chat);

//   useEffect(() => {
//       const getMessages = async () => {
//           setLoading(true);
//           try {
//               const res = await axiosInstance.get(`/messages/${selectedConversation._id}`);
//               const data = res.data;
              
//               // Ensure messages is always an array, fallback to empty array if not
//               setMessages(data);
//           } catch (error) {
//               toast.error(error.response?.data?.error || "Failed to load messages.");
//           } finally {
//               setLoading(false);
//           }
//       };

//       if (selectedConversation?._id) {
//           getMessages();
//       }
//   }, [selectedConversation?._id, setMessages]);

useEffect(() => {
    if (selectedConversation?._id) {
      dispatch(fetchMessages(selectedConversation._id));
    }
  }, [selectedConversation?._id, dispatch]);

  return { messages, loading };
};

export default useGetMessages;

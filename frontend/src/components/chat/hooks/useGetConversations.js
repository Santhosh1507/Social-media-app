import { useEffect} from "react";
import toast from "react-hot-toast";
import { axiosInstance } from "../../../lib/axios";
import { useDispatch, useSelector } from 'react-redux';
import { fetchConversations } from '../../../Redux/features/chatReducer';
 // Adjust the path as needed

const useGetConversations = () => {
  // const [loading, setLoading] = useState(false);
  // const [conversations, setConversations] = useState([]);
  const dispatch = useDispatch();
  const { loading, conversations } = useSelector((state) => state.chat);

  useEffect(() => {
    // const getConversations = async () => {
    //   setLoading(true);
    //   try {
      

    //     const { data } = await axiosInstance.get("/users"); // Use axiosInstance to make the request

    //     if (data.error) {
    //       throw new Error(data.error);
    //     }

    //     setConversations(data);
    //   } catch (error) {
    //     toast.error(error.message);
    //   } finally {
    //     setLoading(false);
    //   }
    // };

    // getConversations();
    const getConversations = async () => {
      await dispatch(fetchConversations());
    };

    getConversations();
  }, []);

  return { loading, conversations };
};

export default useGetConversations;

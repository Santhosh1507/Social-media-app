import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { axiosInstance } from "../../../lib/axios"; // Adjust the path as needed

const useGetConversations = () => {
  const [loading, setLoading] = useState(false);
  const [conversations, setConversations] = useState([]);

  useEffect(() => {
    const getConversations = async () => {
      try {
        setLoading(true);

        const { data } = await axiosInstance.get("/users"); // Use axiosInstance to make the request

        if (data.error) {
          throw new Error(data.error);
        }

        setConversations(data);
      } catch (error) {
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    };

    getConversations();
  }, []);

  return { loading, conversations };
};

export default useGetConversations;

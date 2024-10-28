import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPosts, selectPosts } from '../Redux/features/postsSlice';
import Sidebar from "../components/Sidebar";
import PostCreation from "../components/PostCreation";
import { fetchAuthUser, selectAuthUser } from '../Redux/features/authSlice';
import Post from "../components/Post";
import { setRecommendedUsers, setLoading, setError } from '../Redux/features/usersSlice';
import { Users } from "lucide-react";
import RecommendedUser from "../components/RecommendedUser";
import { axiosInstance } from '../lib/axios'; // Ensure this import is correct

const HomePage = () => {
  
  const dispatch = useDispatch();
  const [error, setErrorState] = useState(null);

  const authUser = useSelector(selectAuthUser);
  const { recommendedUsers, loading } = useSelector((state) => state.users);
  const posts = useSelector(selectPosts) || []; // Ensure this is always an array

  useEffect(() => {
    const fetchRecommendedUsers = async () => {
      dispatch(setLoading(true)); // Set loading to true
      try {
        const res = await axiosInstance.get("/users/suggestions");
        dispatch(setRecommendedUsers(res.data));
      } catch (err) {
        dispatch(setError("Failed to fetch recommended users.")); // Dispatch error
      } finally {
        dispatch(setLoading(false)); // Set loading to false
      }
    };

    dispatch(fetchAuthUser()).then(() => {
      fetchRecommendedUsers();
      dispatch(fetchPosts());
    });
  }, [dispatch]);

  return (
    <div className='grid grid-cols-1 lg:grid-cols-4 gap-6'>
      <div className='hidden lg:block lg:col-span-1'>
        {authUser ? <Sidebar user={authUser} /> : <div>Loading...</div>}
      </div>

      <div className='col-span-1 lg:col-span-2 order-first lg:order-none'>
        {authUser ? <PostCreation user={authUser} /> : <div>Loading...</div>}

        {posts.length ? (
          posts.map((post) => <Post key={post._id} post={post} />)
        ) : (
          <div className='bg-white rounded-lg shadow p-8 text-center'>
            <div className='mb-6'>
              <Users size={64} className='mx-auto text-blue-500' />
            </div>
            <h2 className='text-2xl font-bold mb-4 text-gray-800'>No Posts Yet</h2>
            <p className='text-gray-600 mb-6'>Connect with others to start seeing posts in your feed!</p>
          </div>
        )}

        {error && <div className="text-red-500">{error}</div>}
      </div>

      {recommendedUsers?.length > 0 && (
        <div className='col-span-1 lg:col-span-1 hidden lg:block'>
          <div className='bg-white rounded-lg shadow p-4'>
            <h2 className='font-semibold mb-4'>People you may know</h2>
            {recommendedUsers?.map((user) => (
              <RecommendedUser key={user._id} user={user} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;

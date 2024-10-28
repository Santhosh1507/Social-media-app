import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { fetchPostById } from '../Redux/features/postsSlice';
import { fetchAuthUser } from '../Redux/features/authSlice';
import { useAuth } from "../context/AuthContext"; // If needed
import Sidebar from '../components/Sidebar';
import Post from '../components/Post';

const PostPage = () => {
  const { postId } = useParams();
  const dispatch = useDispatch();

  // Access the Redux state
  const { authUser } = useAuth();
  const { post, loading: isLoading, error } = useSelector((state) => state.posts);

  // Fetch the post when the component mounts
  useEffect(() => {
    dispatch(fetchPostById(postId));
    // Fetch user data if needed, dispatching setAuthUser if you have user data from somewhere
  }, [dispatch, postId]);

  if (isLoading) return <div>Loading post...</div>;
  if (error) return <div>Error loading post: {error}</div>;
  if (!post) return <div>Post not found</div>;

  return (
    <div className='grid grid-cols-1 lg:grid-cols-4 gap-6'>
      <div className='hidden lg:block lg:col-span-1'>
        <Sidebar user={authUser} />
      </div>

      <div className='col-span-1 lg:col-span-2'>
        <Post post={post} />
      </div>
    </div>
  );
};

export default PostPage;

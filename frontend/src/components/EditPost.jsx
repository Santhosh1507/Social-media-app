import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { editPost } from '../Redux/features/postsSlice';

const EditPost = ({ post, onClose }) => {
  const [editContent, setEditContent] = useState(post.content);
  const [editImage, setEditImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(post.image || '');

  const dispatch = useDispatch();
  const navigate = useNavigate(); // Initialize useNavigate

  const handleEditPost = async (e) => {
    e.preventDefault();
    await dispatch(editPost({ postId: post._id, content: editContent, image: editImage }));
    onClose(); // Close the modal after dispatching
    navigate(0); // Reload the current route to fetch updated data
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setEditImage(file);

    // Update image preview
    if (file) {
      const fileURL = URL.createObjectURL(file);
      setImagePreview(fileURL);
    } else {
      setImagePreview('');
    }
  };

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center'>
      <div className='p-4 rounded max-w-3xl bg-white'>
        <h3 className='text-lg font-semibold mb-2'>Edit Post</h3>
        <form onSubmit={handleEditPost}>
          <div className='flex flex-col gap-4'>
            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className='w-full border border-gray-300 rounded mb-2 p-2'
              placeholder='Edit your post content here...'
            />
            <div>
              <input type='file' onChange={handleFileChange} className='mb-2' />
              {imagePreview && (
                <img src={imagePreview} alt='Preview' className='w-1/5 h-3/5 mb-2 rounded' />
              )}
            </div>
          </div>
          <div className='flex justify-end'>
            <button
              type='button'
              onClick={onClose}
              className='mr-2 text-gray-500 hover:text-gray-700'
            >
              Cancel
            </button>
            <button
              type='submit'
              className='bg-blue-500 text-white px-4 py-1 rounded'
              disabled={false} // You can manage loading state using a local state if needed
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditPost;

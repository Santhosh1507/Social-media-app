import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createPost } from "../Redux/features/postsSlice"; // Import your action
import toast from "react-hot-toast";
import { Loader, Image } from "lucide-react";

const PostCreation = ({ user }) => {
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.posts);

  const handlePostCreation = async (e) => {
    e.preventDefault(); // Prevent the default form submission
    try {
      const postData = { content };
      if (image) postData.image = await readFileAsDataURL(image);

      await dispatch(createPost(postData)); // Dispatch the action
      resetForm();
      toast.success("Post created successfully");
      window.location.reload();
    } catch (error) {
      // Improved error handling
      if (error.response) {
        // If error has a response from the server
        toast.error(error.response.data.message || "Failed to create post");
      } else if (error.message) {
        // If there is a message but no response
        toast.error(error.message || "Failed to create post");
      } else {
        // For any other errors
        toast.error("Failed to create post");
      }
    }
  };

  const resetForm = () => {
    setContent("");
    setImage(null);
    setImagePreview(null);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    if (file) {
      readFileAsDataURL(file).then(setImagePreview);
    } else {
      setImagePreview(null);
    }
  };

  const readFileAsDataURL = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  return (
    <form onSubmit={handlePostCreation} className='bg-secondary rounded-lg shadow mb-4 p-4'> {/* Add onSubmit here */}
      <div className='flex space-x-3'>
        <img src={user.profilePicture || "/avatar.png"} alt={user.name} className='size-12 rounded-full' />
        <textarea
          placeholder="What's on your mind?"
          className='w-full p-3 rounded-lg bg-base-100 hover:bg-base-200 focus:bg-base-200 focus:outline-none resize-none transition-colors duration-200 min-h-[100px]'
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
      </div>

      {imagePreview && (
        <div className='mt-4'>
          <img src={imagePreview} alt='Selected' className='w-full h-auto rounded-lg' />
        </div>
      )}

      <div className='flex justify-between items-center mt-4'>
        <div className='flex space-x-4'>
          <label className='flex items-center text-info hover:text-info-dark transition-colors duration-200 cursor-pointer'>
            <Image size={20} className='mr-2' />
            <span>Photo</span>
            <input type='file' accept='image/*' className='hidden' onChange={handleImageChange} />
          </label>
        </div>

        <button
          type='submit' // Make this a submit button to trigger the form
          className='bg-primary text-white rounded-lg px-4 py-2 hover:bg-primary-dark transition-colors duration-200'
        >
          {loading ? <Loader className='size-5 animate-spin' /> : 'Share'}
        </button>
      </div>
    </form>
  );
};

export default PostCreation;

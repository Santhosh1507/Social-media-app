import { useDispatch } from "react-redux";
import { acceptRequest, rejectRequest } from "../Redux/features/profileSlice"; // Adjust the path as necessary
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

const FriendRequest = ({ request }) => {
  const dispatch = useDispatch();

  const handleAccept = async () => {
    const action =  dispatch(acceptRequest(request._id));
    if (acceptRequest.fulfilled.match(action)) {
      toast.success("Connection request accepted");
    } else {
      toast.error(action.payload || "Failed to accept request");
    }
  };

  const handleReject = async () => {
    const action =  dispatch(rejectRequest(request._id));
    if (rejectRequest.fulfilled.match(action)) {
      toast.success("Connection request rejected");
    } else {
      toast.error(action.payload || "Failed to reject request");
    }
  };

  return (
    <div className='bg-white rounded-lg shadow p-4 flex items-center justify-between transition-all hover:shadow-md'>
      <div className='flex items-center gap-4'>
        <Link to={`/profile/${request.sender.username}`}>
          <img
            src={request.sender.profilePicture || "/avatar.png"}
            alt={request.sender.name}
            className='w-16 h-16 rounded-full object-cover'
          />
        </Link>

        <div>
          <Link to={`/profile/${request.sender.username}`} className='font-semibold text-lg'>
            {request.sender.name}
          </Link>
          <p className='text-gray-600'>{request.sender.headline}</p>
        </div>
      </div>

      <div className='space-x-2'>
        <button
          className='bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark transition-colors'
          onClick={handleAccept}
        >
          Accept
        </button>
        <button
          className='bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors'
          onClick={handleReject}
        >
          Reject
        </button>
      </div>
    </div>
  );
};

export default FriendRequest;

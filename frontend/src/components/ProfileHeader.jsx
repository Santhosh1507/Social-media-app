import { useMemo, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import { Camera, Clock, MapPin, UserCheck, UserPlus, X } from "lucide-react";
import Modal from "./Modal";
import {
  fetchConnectionStatus,
  sendConnectionRequest,
  acceptRequest,
  rejectRequest,
  removeConnection,
} from "../Redux/features/profileSlice";
import { fetchAuthUser } from "../Redux/features/authSlice";

const ProfileHeader = ({ userData, onSave, isOwnProfile }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [modalImage, setModalImage] = useState("");

  const dispatch = useDispatch();
  const authUser = useSelector(fetchAuthUser);
  const connectionStatus = useSelector((state) => state.profile.connectionStatus);

  const isConnected = userData.connections.includes(authUser._id);

  // Fetch connection status if not already fetched
  useMemo(() => {
    if (!isOwnProfile && userData?._id) {
      dispatch(fetchConnectionStatus(userData._id));
    }
  }, [dispatch, userData?._id, isOwnProfile]);

  const handleSendConnectionRequest = useCallback(() => {
    dispatch(sendConnectionRequest(userData._id))
      .then(() => toast.success("Connection request sent"))
      .catch((error) => toast.error(error.message || "An error occurred"));
  }, [dispatch, userData._id]);

  const handleAcceptRequest = useCallback(
    (requestId) => {
      dispatch(acceptRequest(requestId))
        .then(() => toast.success("Connection request accepted"))
        .catch((error) => toast.error(error.message || "An error occurred"));
    },
    [dispatch]
  );

  const handleRejectRequest = useCallback(
    (requestId) => {
      dispatch(rejectRequest(requestId))
        .then(() => toast.success("Connection request rejected"))
        .catch((error) => toast.error(error.message || "An error occurred"));
    },
    [dispatch]
  );

  const handleRemoveConnection = useCallback(() => {
    dispatch(removeConnection(userData._id))
      .then(() => toast.success("Connection removed"))
      .catch((error) => toast.error(error.message || "An error occurred"));
  }, [dispatch, userData._id]);

  const getConnectionStatus = useMemo(() => {
    if (isConnected) return "connected";
    return connectionStatus?.status || "not_connected";
  }, [isConnected, connectionStatus]);

  const renderConnectionButton = () => {
    const baseClass =
      "text-white py-2 px-4 rounded-full transition duration-300 flex items-center justify-center";
    switch (getConnectionStatus) {
      case "connected":
        return (
          <div className="flex gap-2 justify-center">
            <div className={`${baseClass} bg-green-500 hover:bg-green-600`}>
              <UserCheck size={20} className="mr-2" />
              Connected
            </div>
            <button
              className={`${baseClass} bg-red-500 hover:bg-red-600 text-sm`}
              onClick={handleRemoveConnection}
            >
              <X size={20} className="mr-2" />
              Remove Connection
            </button>
          </div>
        );
      case "pending":
        return (
          <button className={`${baseClass} bg-yellow-500 hover:bg-yellow-600`}>
            <Clock size={20} className="mr-2" />
            Pending
          </button>
        );
      case "received":
        return (
          <div className="flex gap-2 justify-center">
            <button
              onClick={() => handleAcceptRequest(connectionStatus.requestId)}
              className={`${baseClass} bg-green-500 hover:bg-green-600`}
            >
              Accept
            </button>
            <button
              onClick={() => handleRejectRequest(connectionStatus.requestId)}
              className={`${baseClass} bg-red-500 hover:bg-red-600`}
            >
              Reject
            </button>
          </div>
        );
      default:
        return (
          <button
            onClick={handleSendConnectionRequest}
            className="bg-primary hover:bg-primary-dark text-white py-2 px-4 rounded-full transition duration-300 flex items-center justify-center"
          >
            <UserPlus size={20} className="mr-2" />
            Connect
          </button>
        );
    }
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditedData((prev) => ({ ...prev, [event.target.name]: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    onSave(editedData);
    setIsEditing(false);
  };

  const handleImageClick = (imageUrl) => {
    setModalImage(imageUrl);
    setShowModal(true);
  };

  return (
    <div className='bg-white shadow rounded-lg mb-6'>
			<div
				className='relative h-48 rounded-t-lg bg-cover bg-center cursor-pointer'
				style={{
					backgroundImage: `url('${editedData.bannerImg || userData.bannerImg || "/banner.png"}')`,
				}}
				onClick={() => handleImageClick(editedData.bannerImg || userData.bannerImg || "/banner.png")}
			>
				{isEditing && (
					<label className='absolute top-2 right-2 bg-white p-2 rounded-full shadow cursor-pointer'>
						<Camera size={20} />
						<input
							type='file'
							className='hidden'
							name='bannerImg'
							onChange={handleImageChange}
							accept='image/*'
						/>
					</label>
				)}
			</div>

			<div className='p-4'>
				<div className='relative -mt-20 mb-4'>
					<img
						className='w-32 h-32 rounded-full mx-auto object-cover cursor-pointer'
						src={editedData.profilePicture || userData.profilePicture || "/avatar.png"}
						alt={userData.name}
						onClick={() => handleImageClick(editedData.profilePicture || userData.profilePicture || "/avatar.png")}
					/>

					{isEditing && (
						<label className='absolute bottom-0 right-1/2 transform translate-x-16 bg-white p-2 rounded-full shadow cursor-pointer'>
							<Camera size={20} />
							<input
								type='file'
								className='hidden'
								name='profilePicture'
								onChange={handleImageChange}
								accept='image/*'
							/>
						</label>
					)}
				</div>

				<div className='text-center mb-4'>
					{isEditing ? (
						<input
							type='text'
							value={editedData.name ?? userData.name}
							onChange={(e) => setEditedData({ ...editedData, name: e.target.value })}
							className='text-2xl font-bold mb-2 text-center w-full'
						/>
					) : (
						<h1 className='text-2xl font-bold mb-2'>{userData.name}</h1>
					)}

					{isEditing ? (
						<input
							type='text'
							value={editedData.headline ?? userData.headline}
							onChange={(e) => setEditedData({ ...editedData, headline: e.target.value })}
							className='text-gray-600 text-center w-full'
						/>
					) : (
						<p className='text-gray-600'>{userData.headline}</p>
					)}

					<div className='flex justify-center items-center mt-2'>
						<MapPin size={16} className='text-gray-500 mr-1' />
						{isEditing ? (
							<input
								type='text'
								value={editedData.location ?? userData.location}
								onChange={(e) => setEditedData({ ...editedData, location: e.target.value })}
								className='text-gray-600 text-center'
							/>
						) : (
							<span className='text-gray-600'>{userData.location}</span>
						)}
					</div>
				</div>

				{isOwnProfile ? (
					isEditing ? (
						<button
							className='w-full bg-primary text-white py-2 px-4 rounded-full hover:bg-primary-dark transition duration-300'
							onClick={handleSave}
						>
							Save Profile
						</button>
					) : (
						<button
							onClick={() => setIsEditing(true)}
							className='w-full bg-primary text-white py-2 px-4 rounded-full hover:bg-primary-dark transition duration-300'
						>
							Edit Profile
						</button>
					)
				) : (
					<div className='flex justify-center'>{renderConnectionButton()}</div>
				)}
			</div>

			{/* Render the Modal */}
			<Modal isOpen={showModal} onClose={() => setShowModal(false)} imageUrl={modalImage} />
		</div>
	);
};

export default ProfileHeader;
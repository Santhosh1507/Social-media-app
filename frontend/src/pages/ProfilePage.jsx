import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchUserProfile, updateUserProfile, deleteUserAccount } from "../Redux/features/userProfileSlice";
import { fetchAuthUser } from "../Redux/features/authSlice";
import ProfileHeader from "../components/ProfileHeader";
import AboutSection from "../components/AboutSection";
import DeleteAccountModal from "../components/DeleteAccountModal";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const ProfilePage = () => {
    const { username } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const authUser = useSelector((state) => state.auth.user);
    const { profile: userProfile, loading: isUserProfileLoading, error: userProfileError } = useSelector((state) => state.userProfile);

    useEffect(() => {
        const fetchData = async () => {
            try {
                dispatch(fetchAuthUser());
                dispatch(fetchUserProfile(username));
            } catch (error) {
                toast.error("Failed to load user data");
                console.error("Error fetching user data:", error);
            }
        };

        fetchData();
    }, [dispatch, username]);

    const handleSave = (updatedData) => {
        dispatch(updateUserProfile(updatedData)).then(() => {
            toast.success("Profile updated successfully");
        }).catch((error) => {
            toast.error("Failed to update profile");
            console.error("Error updating profile:", error);
        });
    };

    const handleDeleteAccount = () => {
        if (authUser?._id) {
            dispatch(deleteUserAccount(authUser._id)).then(() => {
                toast.success("Account deleted successfully");
                navigate("/login");
            }).catch((error) => {
                toast.error("Failed to delete account");
                console.error("Error deleting account:", error);
            });
        } else {
            toast.error("User ID is missing");
        }
        setShowDeleteModal(false);
    };

    if (isUserProfileLoading) return <div>Loading user profile...</div>;
    if (userProfileError) return <div>Error loading profile: {userProfileError}</div>;
    if (!userProfile) return <div>User profile not found.</div>;

    const isOwnProfile = authUser.username === userProfile.username;
    const userData = isOwnProfile ? authUser : userProfile;

    return (
        <div className='max-w-4xl mx-auto p-4'>
            <ProfileHeader userData={userData} isOwnProfile={isOwnProfile} onSave={handleSave} />
            <AboutSection userData={userData} isOwnProfile={isOwnProfile} onSave={handleSave} />

            

            
        </div>
    );
};

export default ProfilePage;

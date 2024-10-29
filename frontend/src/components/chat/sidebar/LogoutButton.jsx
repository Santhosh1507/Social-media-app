import React from "react";
import { BiLogOut } from "react-icons/bi";
import useLogout from "../../chat/hooks/useSendMessage";
import { useNavigate } from "react-router-dom";


const LogoutButton = () => {
  const { loading, logout } = useLogout();
  // const navigate = useNavigate();

  const navigate = useNavigate();

  const handleLogout = async () => {
    navigate('/'); // Navigate to home page after logout
  };

  return (
    <div className="mt-auto">
      {!loading ? (
        <BiLogOut
          className="w-6 h-6 text-red-500 cursor-pointer"
          onClick={handleLogout} // Call handleLogout instead of logout
        />
      ) : (
        <span className="loading loading-spinner"></span>
      )}
    </div>
  );
};

export default LogoutButton;

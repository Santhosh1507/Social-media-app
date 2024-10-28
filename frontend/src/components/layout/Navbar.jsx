import { Link } from "react-router-dom";
import { Bell, Home, LogOut, User, Users } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { useAuth } from "../../context/AuthContext"; // Import the Auth context
import { fetchNotifications, fetchConnectionRequests, selectNotifications, selectConnectionRequests } from "../../Redux/features/postsSlice"; // Import Redux actions
import { useEffect } from "react";

const Navbar = () => {
  const { authUser, logout } = useAuth(); // Get authUser and logout from context
  const dispatch = useDispatch();

  // Get notifications and connection requests from Redux store
  const notifications = useSelector(selectNotifications) || []; // Fallback to empty array
  const connectionRequests = useSelector(selectConnectionRequests) || []; // Fallback to empty array

  // Fetch notifications and connection requests when authUser changes
  useEffect(() => {
    if (authUser) {
      dispatch(fetchNotifications());
      dispatch(fetchConnectionRequests());
    }
  }, [dispatch, authUser]);

  const unreadNotificationCount = notifications.filter((notif) => !notif.read).length;
  const unreadConnectionRequestsCount = connectionRequests.length;

  return (
    <nav className='bg-secondary shadow-md sticky top-0 z-10'>
      <div className='max-w-7xl mx-auto px-4'>
        <div className='flex justify-between items-center py-3'>
          <div className='flex items-center space-x-4'>
            <Link to='/'>
              <h2 className="text-2xl font-bold text-primary">Social Media App</h2>
            </Link>
          </div>
          <div className='flex items-center gap-2 md:gap-6'>
            {authUser ? (
              <>
                <Link to={"/"} className='text-neutral flex flex-col items-center'>
                  <Home size={20} />
                  <span className='text-xs hidden md:block'>Home</span>
                </Link>
                <Link to='/network' className='text-neutral flex flex-col items-center relative'>
                  <Users size={20} />
                  <span className='text-xs hidden md:block'>My Network</span>
                  {unreadConnectionRequestsCount > 0 && (
                    <span className='absolute -top-1 -right-1 md:right-4 bg-blue-500 text-white text-xs rounded-full size-3 md:size-4 flex items-center justify-center'>
                      {unreadConnectionRequestsCount}
                    </span>
                  )}
                </Link>
                <Link to={`/chat`} className='text-neutral flex flex-col items-center'>
                  <User size={20} />
                  <span className='text-xs hidden md:block'>Chat</span>
                </Link>
                <Link to='/notifications' className='text-neutral flex flex-col items-center relative'>
                  <Bell size={20} />
                  <span className='text-xs hidden md:block'>Notifications</span>
                  {unreadNotificationCount > 0 && (
                    <span className='absolute -top-1 -right-1 md:right-4 bg-blue-500 text-white text-xs rounded-full size-3 md:size-4 flex items-center justify-center'>
                      {unreadNotificationCount}
                    </span>
                  )}
                </Link>
                <Link to={`/profile/${authUser.username}`} className='text-neutral flex flex-col items-center'>
                  <User size={20} />
                  <span className='text-xs hidden md:block'>Me</span>
                </Link>
                
                <button
                  className='flex items-center space-x-1 text-sm text-gray-600 hover:text-gray-800'
                  onClick={logout}
                >
                  <LogOut size={20} />
                  <span className='hidden md:inline'>Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link to='/login' className='btn btn-ghost'>
                  Sign In
                </Link>
                <Link to='/signup' className='btn btn-primary'>
                  Join now
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

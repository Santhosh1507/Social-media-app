import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "./components/layout/Layout";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/auth/LoginPage";
import SignUpPage from "./pages/auth/SignUpPage";
import { useAuth } from "./context/AuthContext"; // Import the useAuth hook
import NotificationsPage from "./pages/NotificationsPage";
import NetworkPage from "./pages/NetworkPage";
import PostPage from "./pages/PostPage";
import ProfilePage from "./pages/ProfilePage";
import Home from './pages/Home'
import { Toaster } from "react-hot-toast";
import { useEffect } from "react";

function App() {
  const { authUser, loading, fetchUser } = useAuth(); 
  
 useEffect(() => {
     fetchUser();
 }, []) // Use the auth context

  if (loading) return null; // Optionally, show a loading spinner or placeholder

  return (
    <Layout>
      <Routes>
        <Route path='/' element={authUser ? <HomePage /> : <Navigate to={"/login"} />} />
        <Route path='/signup' element={!authUser ? <SignUpPage /> : <Navigate to={"/"} />} />
        <Route path='/login' element={!authUser ? <LoginPage /> : <Navigate to={"/"} />} />
        <Route path='/notifications' element={authUser ? <NotificationsPage /> : <Navigate to={"/login"} />} />
        <Route path='/network' element={authUser ? <NetworkPage /> : <Navigate to={"/login"} />} />
        <Route path='/post/:postId' element={authUser ? <PostPage /> : <Navigate to={"/login"} />} />
        <Route path='/profile/:username' element={authUser ? <ProfilePage /> : <Navigate to={"/login"} />} />
        <Route path='/chat' element={authUser ? <Home /> : <Navigate to={"/login"} />} />
      </Routes>
      <Toaster />
    </Layout>
  );
}

export default App;

import React, { createContext, useState, useContext } from "react";
import { axiosInstance } from "../lib/axios.js"; // Adjust the import according to your structure
import { toast } from "react-hot-toast";

const AuthContext = createContext();

export const useAuthContext = () => {
  return useContext(AuthContext)
}

export const AuthProvider = ({ children }) => {
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState(null);
    const [authUser, setAuthUser] = useState(null);

    const signUp = async (data) => {
        setLoading(true);
        try {
            const res = await axiosInstance.post("/auth/signup", data);
            toast.success("Account created successfully");
            return res.data; // You may want to return user data or similar
        } catch (err) {
            toast.error(err.response.data.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    const login = async (username, password) => {
        try {
            const response = await axiosInstance.post('/auth/login', { username, password });
            setUser(response.data.user); // Assuming your API returns user data
            console.log(response.data.user);
            toast.success("Login successful!");
        } catch (error) {
            toast.error(error.response.data.message || "Something went wrong");
        }
    };

    const logout = async () => {
        await axiosInstance.post("/auth/logout");
        setAuthUser(null); // Clear user on logout
    };

    const fetchUser = async () => {
        try {
            const res = await axiosInstance.get('/auth/me');
            setAuthUser(res.data);
        } catch (err) {
            if (err.response && err.response.status === 401) {
                setAuthUser(null);
            } else {
                toast.error(err.response.data.message || "Something went wrong");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthContext.Provider value={{ signUp, loading, user, login, logout, authUser, setAuthUser, fetchUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};

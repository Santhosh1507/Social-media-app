import axios from "axios";

export const axiosInstance = axios.create({
	baseURL: "https://social-media-app-oi1b.onrender.com/api/v1",
	withCredentials: true,
});


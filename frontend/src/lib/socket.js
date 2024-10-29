// src/socket.js
import { io } from "socket.io-client";

const socket = io("https://social-media-app-oi1b.onrender.com", {
    query: {
        userId: localStorage.getItem("userId"), // Assuming you're storing userId in local storage
    },
});

export default socket;

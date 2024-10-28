// src/socket.js
import { io } from "socket.io-client";

const socket = io("http://localhost:5000", {
    query: {
        userId: localStorage.getItem("userId"), // Assuming you're storing userId in local storage
    },
});

export default socket;

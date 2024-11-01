import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";

import authRoutes from "./routes/auth.route.js";
import userRoutes from "./routes/user.route.js";
import postRoutes from "./routes/post.route.js";
import notificationRoutes from "./routes/notification.route.js";
import connectionRoutes from "./routes/connection.route.js";
import { errorHandler } from './middleware/errorHandler.js';
import { server, app, io } from "./lib/socket.js"; // Import app and server from socket.js
import messageRoute from "./routes/messages.route.js";

import { connectDB } from "./lib/db.js";

dotenv.config();
const PORT = process.env.PORT || 5000;
const __dirname = path.resolve();

// Middleware
app.use(
  cors({
    origin: "https://social-media-app-oi1b.onrender.com",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(express.json({ limit: "5mb" }));
app.use(cookieParser());
app.use(errorHandler);

// Attach the io instance to each request
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/posts", postRoutes);
app.use("/api/v1/notifications", notificationRoutes);
app.use("/api/v1/connections", connectionRoutes);
app.use("/api/v1/messages", messageRoute);

app.use("/uploads", express.static(path.join(__dirname, "/uploads")));

// Serve frontend in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "/frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
  });
}

// Start the server
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  connectDB(); // Connect to MongoDB
});

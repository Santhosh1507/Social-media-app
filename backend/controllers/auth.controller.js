import User from "../models/user.model.js";
import Post from "../models/post.model.js";
import Notification from "../models/notification.model.js";
import ConnectionRequest from "../models/connectionRequest.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { sendWelcomeEmail } from "../emails/emailHandlers.js";

export const signup = async (req, res) => {
    try {
        const { name, username, email, password, gender } = req.body;

        if (!name || !username || !email || !password || !gender) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const existingEmail = await User.findOne({ email });
        if (existingEmail) {
            return res.status(400).json({ message: "Email already exists" });
        }

        const existingUsername = await User.findOne({ username });
        if (existingUsername) {
            return res.status(400).json({ message: "Username already exists" });
        }

        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = new User({
            name,
            email,
            password: hashedPassword,
            username,
            gender,
        });

        await user.save();

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "3d" });

        res.cookie("jwt-linkedin", token, {
            httpOnly: true,
            maxAge: 3 * 24 * 60 * 60 * 1000,
            sameSite: "strict",
        });

        await sendWelcomeEmail(user.email, user.name, user.profileUrl); // Send the welcome email

        res.status(201).json({ message: "User registered successfully", user: { name, username, email, gender } });
    } catch (error) {
        console.log("Error in signup: ", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};



export const login = async (req, res) => {
    try {
        const { username, password } = req.body;

        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "3d" });
        await res.cookie("jwt-linkedin", token, {
            httpOnly: true,
            maxAge: 3 * 24 * 60 * 60 * 1000,
            sameSite: "strict",
            secure: process.env.NODE_ENV === "production",
        });

        res.json({ message: "Logged in successfully", user: { name: user.name, username: user.username, email: user.email, gender: user.gender } }); // Return user info
    } catch (error) {
        console.error("Error in login controller:", error);
        res.status(500).json({ message: "Server error" });
    }
};


export const logout = (req, res) => {
	res.clearCookie("jwt-linkedin");
	res.json({ message: "Logged out successfully" });
};

export const getCurrentUser = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password'); // Exclude password
        res.json(user); // Send user info including gender
    } catch (error) {
        console.error("Error in getCurrentUser controller:", error);
        res.status(500).json({ message: "Server error" });
    }
};


export const deleteUserAndContent = async (req, res) => {
    const { id } = req.params;

    try {
        // Optionally, delete related data first (posts, notifications, etc.)
        await Post.deleteMany({ author: id });
        await Notification.deleteMany({ user: id });
        await ConnectionRequest.deleteMany({ requester: id });
        await ConnectionRequest.deleteMany({ recipient: id });

        // Delete the user account
        await User.findByIdAndDelete(id);

        res.status(200).json({ message: 'User account and associated data deleted successfully' });
    } catch (error) {
        console.error('Error deleting user and associated data:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

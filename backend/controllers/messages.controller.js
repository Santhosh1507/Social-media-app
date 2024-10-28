import Conversation from "../models/conversation.model.js";
import Message from "../models/messages.model.js";
import { getReceiverSocketId, io } from "../lib/socket.js";

export const sendMessage = async (req, res) => {
	try {
		const { message } = req.body;
		const { id: receiverId } = req.params;
		const senderId = req.user.id;

		// Log received values
		console.log("Sender ID:", senderId);
		console.log("Receiver ID:", receiverId);
		console.log("Message:", message);

		// Check if senderId and receiverId are valid
		if (!senderId || !receiverId) {
			return res.status(400).json({ error: "Invalid sender or receiver ID." });
		}

		// Validate the message content
		if (!message || typeof message !== 'string' || message.trim() === '') {
			return res.status(400).json({ error: "Message cannot be empty." });
		}

		// Find or create the conversation
		let conversation = await Conversation.findOne({
			participants: { $all: [senderId, receiverId] },
		});

		if (!conversation) {
			conversation = await Conversation.create({
				participants: [senderId, receiverId],
			});
		}

		const newMessage = new Message({
			senderId,
			receiverId,
			message,
		});

		// Ensure the new message is created
		if (!newMessage) {
			return res.status(400).json({ error: "Failed to create a new message." });
		}

		conversation.messages.push(newMessage._id);

		// Save both in parallel
		await Promise.all([conversation.save(), newMessage.save()]);

		const receiverSocketId = getReceiverSocketId(receiverId);
		if (receiverSocketId) {
			io.to(receiverSocketId).emit("newMessage", newMessage);
		}

		res.status(201).json(newMessage);
	} catch (error) {
		console.log("Error in sendMessage controller: ", error.message);
		res.status(500).json({ error: "Internal server error" });
	}
};



// Function to get messages from a conversation
export const getMessage = async (req, res) => {
	try {
		const { id: userToChatId } = req.params; // Get the user to chat with
		const senderId = req.user.id; // Ensure this is correctly set

		// Find the conversation between the two users and populate messages
		const conversation = await Conversation.findOne({
			participants: { $all: [senderId, userToChatId] },
		}).populate("messages"); // Populate messages

		// If no conversation exists, return an empty array
		if (!conversation) return res.status(200).json([]);

		const messages = conversation.messages; // Extract messages

		// Respond with the messages
		res.status(200).json(messages);
	} catch (error) {
		console.log("Error in getMessages controller: ", error.message);
		res.status(500).json({ error: "Internal server error" });
	}
};

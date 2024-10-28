import { create } from "zustand";

const useConversation = create((set) => ({
	messages: [], // Initialize as an empty array
	setMessages: (messages) => set({ messages }),
	selectedConversation: null,
	setSelectedConversation: (conversation) => set({ selectedConversation: conversation }),
}));

export default useConversation;

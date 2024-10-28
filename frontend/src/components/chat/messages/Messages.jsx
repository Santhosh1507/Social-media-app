import React, { useEffect, useRef } from "react";
import Message from "./Message";
import useGetMessages from "../../chat/hooks/useGetMessages";
import MessageSkeleton from "../skeletons/MessageSkeleton";
import useListenMessages from "../../chat/hooks/useListenMessages";

const Messages = () => {
	const { messages = [], loading } = useGetMessages(); // Default to an empty array
	useListenMessages();
	const lastMessageRef = useRef();

	useEffect(() => {
		// Scroll to the last message when messages change
		lastMessageRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [messages]);

	// Debugging log to check the type of messages
	console.log("Messages:", messages, "Type:", Array.isArray(messages));

	return (
		<div className='px-4 flex-1 overflow-auto'>
			{!loading && messages.length > 0 ? (
				messages.map((message, index) => {
					// Use ref only on the last message
					const isLastMessage = index === messages.length - 1;
					return (
						<div key={message._id} ref={isLastMessage ? lastMessageRef : null}>
							<Message message={message} />
						</div>
					);
				})
			) : (
				<>
					{loading && [...Array(3)].map((_, idx) => <MessageSkeleton key={idx} />)}
					{!loading && messages.length === 0 && (
						<p className='text-center'>Send a message to start the conversation</p>
					)}
				</>
			)}
		</div>
	);
};

export default Messages;

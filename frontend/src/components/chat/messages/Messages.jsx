import React, { useEffect, useRef } from "react";
import Message from "./Message";
import useGetMessages from "../../chat/hooks/useGetMessages";
import MessageSkeleton from "../skeletons/MessageSkeleton";
import useListenMessages from "../../chat/hooks/useListenMessages";

const Messages = () => {
  const { messages = [], loading } = useGetMessages(); // Default to an empty array
  useListenMessages();
  const lastMessageRef = useRef();

  // Scroll to the last message when messages change
  useEffect(() => {
    // Only scroll if new messages were added and not during loading
    if (!loading && messages.length > 0) {
      lastMessageRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, []); // Add loading to dependencies

  return (
    <div className='px-4 flex-1 overflow-auto'>
      {loading ? (
        [...Array(3)].map((_, idx) => <MessageSkeleton key={idx} />) // Show skeleton loaders
      ) : messages.length > 0 ? (
        messages.map((message, index) => (
          <div key={message._id} ref={index === messages.length - 1 ? lastMessageRef : null}>
            <Message message={message} />
          </div>
        ))
      ) : (
        <p className='text-center'>Send a message to start the conversation</p>
      )}
    </div>
  );
  
};

export default Messages;

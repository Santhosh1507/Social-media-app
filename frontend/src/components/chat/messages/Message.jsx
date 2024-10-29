import React from "react";
import userAvatar from "../../../assets/user.png";
import { useAuthContext } from "../../../context/AuthContext";
import useConversation from "../zustand/useConversation";
import { extractTime } from "../../../utils/extractTime";

const Message = ({ message }) => {
  const { authUser } = useAuthContext();
  const { selectedConversation } = useConversation();

  // Compare senderId with authUser._id to determine message alignment
  const fromMe = message.senderId === authUser._id;

  // Format the time of the message
  const formattedTime = extractTime(message.createdAt);

  // Determine the alignment of the message (left for others, right for logged-in user)
  const chatClassName = fromMe ? "chat-end" : "chat-start";

  // Fallback to default avatar if profile picture is missing
  const profilePic = fromMe 
    ? authUser?.profilePicture || userAvatar 
    : selectedConversation?.profilePicture || userAvatar;

  // Set the background color of the chat bubble based on sender
  const bubbleBgColor = fromMe ? "bg-emerald-500" : "bg-zinc-600";

  return (
    <div className={`chat ${chatClassName}`}>
      
      <div className={`chat-bubble text-white ${bubbleBgColor}   pb-2`}>
        {message.message}
      </div>
      <div className='chat-footer opacity-50 text-xs flex gap-1 items-center'>
        {formattedTime !== "Invalid time" ? formattedTime : "Unknown time"}
      </div>
    </div>
  );
};

export default Message;

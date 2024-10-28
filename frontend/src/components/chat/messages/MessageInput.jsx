import React, { useState } from "react";
import { BsSend } from "react-icons/bs";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import useSendMessage from "../../chat/hooks/useSendMessage";

const MessageInput = () => {
    const [message, setMessage] = useState("");
    const { loading, sendMessage } = useSendMessage();
    const navigate = useNavigate(); // Initialize the navigate function

    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent form from refreshing
        if (!message) return;

        try {
            // Ensure async call is awaited
            await sendMessage(message);
            setMessage(""); // Clear input on success
            navigate('/chat'); // Navigate to the chat page after sending a message
        } catch (error) {
            console.error("Error sending message:", error); // Handle errors properly
        }
       
    };

    return (
        <form className='px-4 my-3' onSubmit={handleSubmit}>
            <div className='w-full relative'>
                <input
                    type='text'
                    className='border text-sm rounded-lg block w-full p-2.5 bg-gray-700 border-gray-600 text-white'
                    placeholder='Send a message'
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                />
                <button type='submit' className='absolute inset-y-0 end-0 flex items-center pe-3'>
                    {loading ? <div className='loading loading-spinner'></div> : <BsSend />}
                </button>
            </div>
        </form>
    );
};

export default MessageInput;

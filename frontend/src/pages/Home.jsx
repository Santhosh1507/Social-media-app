import React from "react"
import Sidebar from "../components/chat/sidebar/Sidebar"
import MessageContainer from "../components/chat/messages/MessageContainer"

const Home = () => {
  return (
    <div className="flex sm:h-[450px] lg:h-[550px] rounded-lg overflow-hidden bg-gray-200  justify-center">
      <Sidebar />

      <MessageContainer />
    </div>
  )
}

export default Home

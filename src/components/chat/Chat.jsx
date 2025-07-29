import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";
import axios from "axios";
import EmojiPicker from "emoji-picker-react";
import MessageList from "../message/MessageList";

const socket = io("http://localhost:5001");

export const Chat = ({ user }) => {
  const [users, setUsers] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [currentMessage, setCurrentMessage] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    // Fetch all users excluding the current user
    const fetchUsers = async () => {
      try {
        const { data } = await axios.get("http://localhost:5001/users", {
          params: { currentUser: user.username },
        });
        setUsers(data.users);
      } catch (error) {
        console.error("Error fetching users", error);
      }
    };

    fetchUsers();

    // Listen for incoming messages
    socket.on("receive_message", (data) => {
      // if (data.sender === currentChat || data.receiver === currentChat) {
      //   setMessages((prev) => [...prev, data]);
      // }
      if (
        (data.sender === currentChat && data.receiver === user.username) ||
        (data.sender === user.username && data.receiver === currentChat)
      ) {
        setMessages((prev) => [...prev, data]);
      }
    });

    socket.on("user_typing", (data) => {
      if (data.sender === currentChat && data.receiver === user.username) {
        setIsTyping(true);
      }
    });

    return () => {
      socket.off("receive_message");
      socket.off("user_typing");
      socket.off("user_stopped_typing");
    };
  }, [currentChat, user.username]);

  const fetchMessages = async (receiver) => {
    try {
      const { data } = await axios.get("http://localhost:5001/messages", {
        params: { sender: user.username, receiver },
      });
      setMessages(data.messages);
      setCurrentChat(receiver);
    } catch (error) {
      console.error("Error fetching messages", error);
    }
  };

  const sendMessage = () => {
    if (currentMessage.trim() === "") return;
    const messageData = {
      sender: user.username,
      receiver: currentChat,
      message: currentMessage,
      timestamp: new Date().toISOString(),
    };
    socket.emit("send_message", messageData);
    setMessages((prev) => [...prev, messageData]);
    setCurrentMessage("");
    setShowEmojiPicker(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      sendMessage();
    }
  };

  const onEmojiClick = (emojiData) => {
    setCurrentMessage((prevMessage) => prevMessage + emojiData.emoji);
    setShowEmojiPicker(false);
  };

  return (
    <div className="flex justify-center">
      <div className="w-52 border-r border-gray-300 p-2.5 float-left">
        <h2 className="text-xl font-semibold mb-4">Welcome, {user.username}</h2>
        <h3 className="text-lg font-medium mb-2">Chats</h3>
        {users?.map((u) => (
          <div
            key={u._id}
            className={`p-2.5 cursor-pointer border-b border-gray-200 hover:bg-gray-100 ${
              currentChat === u?.username ? "bg-green-200" : ""
            }`}
            onClick={() => fetchMessages(u.username)}
          >
            {u.username}
          </div>
        ))}
      </div>

      {currentChat && (
        <div className="ml-52 p-2.5 flex flex-col h-full">
          <h5 className="text-base font-medium mb-4">
            You are chatting with {currentChat}
          </h5>
          <MessageList messages={messages} user={user} />

          <div className="relative mt-auto p-4 bg-gray-50 border-t border-gray-200">
            <div className="flex items-center gap-2 relative">
              <input
                type="text"
                placeholder="Type a message..."
                value={currentMessage}
                className="min-w-96 border border-gray-300 rounded-md px-3 py-2.5 text-sm transition-colors focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                onChange={(e) => setCurrentMessage(e.target.value)}
                onKeyPress={handleKeyPress}
              />
              <button
                className="bg-transparent border border-gray-300 rounded-md px-3 py-2 cursor-pointer text-lg transition-all duration-200 min-w-11 h-10 flex items-center justify-center hover:bg-gray-100 hover:border-gray-400 hover:scale-105 active:scale-95"
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                title="Add emoji"
              >
                😊
              </button>
              <button
                className="bg-blue-600 text-white border-none rounded-md px-4 py-2.5 cursor-pointer text-sm font-medium transition-all duration-200 min-w-15 hover:bg-blue-700 hover:-translate-y-0.5 active:translate-y-0"
                onClick={sendMessage}
              >
                Send
              </button>
            </div>

            {showEmojiPicker && (
              <div className="absolute bottom-full right-0 z-50 mb-2.5 rounded-xl overflow-hidden shadow-2xl border border-gray-200 animate-slide-up">
                <EmojiPicker
                  onEmojiClick={onEmojiClick}
                  autoFocusSearch={false}
                  theme="light"
                  height={350}
                  width={350}
                  previewConfig={{
                    showPreview: false,
                  }}
                  skinTonesDisabled={true}
                  searchPlaceholder="Search emojis..."
                />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import io from "socket.io-client";
import axios from "axios";
import { UserContext } from "../context/UserContext";
import { toast } from "sonner";
const socket = io("http://localhost:3000", {
  query: { token: localStorage.getItem("authToken") },
});

const ChatRoom = () => {
  const { roomId } = useParams();
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [showAddPeopleModal, setShowAddPeopleModal] = useState(false);
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const { user } = useContext(UserContext);
  const [newMessage, setNewMessage] = useState("");
  useEffect(() => {
    socket.emit("joinRoom", roomId);

    socket.on("receiveMessage", (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      socket.off("receiveMessage");
      socket.emit("leaveRoom", roomId);
    };
  }, [roomId]);

  const sendMessage = () => {
    if (newMessage.trim()) {
      socket.emit("sendMessage", {
        roomId,
        message: newMessage,
        sender: user.name,
      }); // Sending user's name
      // setMessages((prevMessages) => [
      //   ...prevMessages,
      //   { message: newMessage, sender: user.name },
      // ]);
      setNewMessage("");
    }
  };

  // Lazy load users when modal is opened
  const loadUsers = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/chat/users", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });
      setUsers(response.data);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    }
  };

  const addUserToRoom = async (userId) => {
    try {
      await axios.post(
        `http://localhost:3000/api/chat/rooms/${roomId}/invite`,
        { userId },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );
      toast.success("User invited to chat room!");
    } catch (error) {
      console.error("Error adding user:", error);
      toast.error("failed to add please try again");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200 p-4 flex flex-col">
      {/* Header */}
      <header className="bg-purple-700 p-4 flex justify-between items-center rounded-xl shadow-md">
        <h1 className="text-white text-2xl font-semibold">
          Chat Room <span className="text-purple-300">#{roomId}</span>
        </h1>
        <button
          onClick={() => {
            setShowAddPeopleModal(true);
            loadUsers();
          }}
          className="bg-white text-purple-700 px-5 py-2 rounded-full font-medium shadow-sm hover:bg-purple-50 transition-all duration-200"
        >
          + Add People
        </button>
      </header>

      {/* Chat Messages Area */}
      <div className="flex-1 mt-4 p-6 bg-white rounded-2xl shadow-lg overflow-y-auto space-y-4">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 italic">
            No messages yet. Start the conversation!
          </div>
        ) : (
          messages.map((msg, index) => (
            <div key={index} className="flex items-start space-x-3">
              {/* Avatar Placeholder */}
              <div className="w-10 h-10 bg-purple-200 text-purple-700 flex items-center justify-center rounded-full uppercase font-bold">
                {msg.sender.charAt(0)}
              </div>
              {/* Message Bubble */}
              <div className="bg-gray-100 p-3 rounded-lg shadow-sm max-w-[75%]">
                <strong className="text-purple-700">{msg.sender}</strong>
                <p className="text-gray-700 mt-1">{msg.message}</p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Message Input */}
      <div className="mt-4 flex items-center bg-white p-3 rounded-xl shadow-md">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="flex-1 p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:outline-none"
          placeholder="Type your message..."
        />
        <button
          onClick={sendMessage}
          className="ml-3 bg-purple-700 text-white px-5 py-2 rounded-lg shadow hover:bg-purple-800 transition-colors"
        >
          Send
        </button>
      </div>

      {/* Add People Modal */}
      {showAddPeopleModal && (
        <div className="fixed inset-0 backdrop-blur-sm bg-black/40 flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Add People
            </h2>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search users..."
              className="border border-gray-300 rounded-lg p-3 w-full mb-4 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />

            <ul className="max-h-60 overflow-y-auto space-y-3">
              {users
                .filter((user) =>
                  user.name.toLowerCase().includes(searchQuery.toLowerCase())
                )
                .map((user) => (
                  <li
                    key={user._id}
                    className="flex justify-between items-center p-3 bg-gray-50 rounded-lg shadow-sm"
                  >
                    <span className="text-gray-800 font-medium">
                      {user.name}
                    </span>
                    <button
                      onClick={() => addUserToRoom(user._id)}
                      className="bg-green-500 text-white px-3 py-1 rounded-lg hover:bg-green-600 transition-colors"
                    >
                      Add
                    </button>
                  </li>
                ))}
            </ul>

            <button
              onClick={() => setShowAddPeopleModal(false)}
              className="mt-6 w-full bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatRoom;

import React, { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import { getChatMessages } from "../../services/api";
import MessageBubble from "./MessageBubble";
import ChatHeader from "./ChatHeader";

const ChatArea = ({ room, user, wsConnection }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    loadMessages();

    if (wsConnection) {
      joinRoom();
      wsConnection.addEventListener("message", handleIncomingMessage);
    }

    return () => {
      if (wsConnection) {
        leaveRoom();
        wsConnection.removeEventListener("message", handleIncomingMessage);
      }
    };
  }, [room._id, wsConnection]);

  const loadMessages = async () => {
    try {
      const response = await getChatMessages(room._id);
      console.log("API Response:", response); // Debugging line
      if (response.success && Array.isArray(response.data)) {
        setMessages(response.data);
      } else {
        setMessages([]); // Ensure it stays an array
      }
      scrollToBottom();
    } catch (error) {
      console.error("Failed to load messages:", error);
      setMessages([]); // Default to an empty array on failure
      toast.error("Failed to load messages");
    }
  };

  const joinRoom = () => {
    wsConnection.send(
      JSON.stringify({
        type: "JOIN_ROOM",
        roomId: room._id,
      })
    );
  };

  const leaveRoom = () => {
    wsConnection.send(
      JSON.stringify({
        type: "LEAVE_ROOM",
        roomId: room._id,
      })
    );
  };

  const handleIncomingMessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      if (data.type === "NEW_MESSAGE" && data.roomId === room._id) {
        setMessages((prev) => [...prev, data.message]);
        scrollToBottom();
      }
    } catch (error) {
      console.error("Error processing message:", error);
    }
  };

  const handleSendMessage = () => {
    if (
      !newMessage.trim() ||
      !wsConnection ||
      wsConnection.readyState !== WebSocket.OPEN
    ) {
      console.warn("WebSocket is not open. Cannot send message.");
      return;
    }

    const messageData = {
      type: "SEND_MESSAGE",
      roomId: room._id,
      sender: user._id,
      content: newMessage,
    };

    wsConnection.send(JSON.stringify(messageData));

    setMessages((prev) => [
      ...prev,
      { _id: Date.now(), sender: user, content: newMessage },
    ]);

    setNewMessage("");
    scrollToBottom();
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="flex-1 flex flex-col">
      <ChatHeader room={room} />

      <div className="flex-1 overflow-y-auto p-4">
        {messages.map((message) => (
          <MessageBubble
            key={message._id}
            message={message}
            isMine={message.sender._id === user._id}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t bg-white">
        <div className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
            placeholder="Type a message..."
            className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <button
            onClick={handleSendMessage}
            disabled={!newMessage.trim()}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-300"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatArea;

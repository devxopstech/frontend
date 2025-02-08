import { createContext, useContext, useState, useEffect } from "react";
import { io } from "socket.io-client";
import { toast } from "react-toastify";

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [activeChats, setActiveChats] = useState([]);
  const [unreadMessages, setUnreadMessages] = useState({});
  const [messages, setMessages] = useState([]);
  const [socketConnection, setSocketConnection] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) return;

    const socket = io("http://localhost:3000", {
      query: { token },
    });

    setSocketConnection(socket);

    socket.on("connect", () => {
      console.log("Connected to chat server");
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from chat server");
      setSocketConnection(null);
    });

    socket.on("connect_error", (err) => {
      console.error("Socket.IO connection error:", err);
      toast.error("Connection error. Trying to reconnect...");
    });

    socket.on("receiveMessage", (data) => {
      handleNewMessage(data);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const handleNewMessage = (message) => {
    setMessages((prev) => [...prev, message]);
    setUnreadMessages((prev) => ({
      ...prev,
      [message.roomId]: (prev[message.roomId] || 0) + 1,
    }));
  };

  return (
    <ChatContext.Provider
      value={{
        activeChats,
        unreadMessages,
        messages,
        socketConnection,
        setActiveChats,
        setUnreadMessages,
        setMessages,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => useContext(ChatContext);

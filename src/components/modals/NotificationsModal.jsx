import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  getNotifications,
  handleInvitation,
  markNotificationAsOpened,
} from "../../services/api";
import axios from "axios";

const NotificationsModal = ({ onClose }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("requests");
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rooms, setRooms] = useState({ createdRooms: [], joinedRooms: [] });
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await getNotifications();
        console.log("Fetched notifications:", response.data);
        setNotifications(response.data);
      } catch (error) {
        console.error("Failed to fetch notifications:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  const fetchRooms = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/chat/rooms", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });
      const { createdRooms = [], joinedRooms = [] } = response.data || {};
      setRooms({ createdRooms, joinedRooms });
    } catch (err) {
      console.error("Error fetching rooms:", err);
      setRooms({ createdRooms: [], joinedRooms: [] });
    }
  };

  const handleAcceptInvite = async (notification) => {
    try {
      if (notification.type === "chat_invite") {
        const roomId = notification?.metadata?.roomId;
        if (!roomId) {
          console.error(
            "Room ID is missing in the notification metadata:",
            notification
          );
          return;
        }

        const response = await axios.post(
          "http://localhost:3000/api/chat/rooms/accept-invite",
          { roomId },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
          }
        );

        if (response.status === 200) {
          console.log("Successfully joined room:", response.data);
          fetchRooms();
          navigate("/chat-rooms");
        }
      } else if (notification.type === "schedule_invite") {
        const response = await handleInvitation(notification._id, "accept");

        if (response.success) {
          await markNotificationAsOpened(notification._id);
          setNotifications((prev) =>
            prev.filter((n) => n._id !== notification._id)
          );
          navigate("/schedules");
        }
      }
    } catch (error) {
      console.error("Error accepting invite:", error);
    }
  };

  const handleRejectInvite = async (notification) => {
    try {
      const response = await handleInvitation(notification._id, "reject");
      if (response.success) {
        await markNotificationAsOpened(notification._id);
        setNotifications((prev) =>
          prev.filter((n) => n._id !== notification._id)
        );
      }
    } catch (error) {
      console.error("Failed to reject invitation:", error);
    }
  };

  const renderNotificationItem = (notification) => (
    <li
      key={notification._id}
      className="p-4 bg-gray-50 rounded-lg border border-gray-200"
    >
      <p className="text-gray-700 font-medium mb-2">{notification.message}</p>
      <div className="text-gray-400 text-sm mb-3">
        {new Date(notification.createdAt).toLocaleDateString()}
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => handleAcceptInvite(notification)}
          className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors"
        >
          {notification.type === "chat_invite" ? "Join Chat" : "Accept"}
        </button>
        <button
          onClick={() => handleRejectInvite(notification)}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
        >
          {notification.type === "chat_invite" ? "Decline" : "Reject"}
        </button>
      </div>
    </li>
  );

  const renderNotifications = (type) => {
    const filtered = notifications.filter((n) => {
      if (type === "requests") {
        return n.type === "schedule_invite" && n.status === "pending";
      } else if (type === "chat") {
        return n.type === "chat_invite" && n.status === "pending";
      }
      return false;
    });

    if (filtered.length === 0) {
      return (
        <div className="text-center py-8">
          <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-10 h-10 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <p className="text-gray-500 font-medium">No notifications</p>
        </div>
      );
    }

    return (
      <ul className="space-y-4">{filtered.map(renderNotificationItem)}</ul>
    );
  };

  return (
    <>
      <div
        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
        onClick={onClose}
      />

      <div className="fixed inset-x-4 top-20 md:top-24 max-w-xl mx-auto z-50">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-medium text-gray-900">
                Notifications
              </h2>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                <svg
                  className="w-5 h-5 text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <p className="text-gray-600 text-sm mt-2">Recent alerts for you.</p>
          </div>

          <div className="border-b border-gray-100 flex">
            <button
              onClick={() => setActiveTab("requests")}
              className={`flex-1 py-4 px-6 text-sm font-medium transition-colors ${
                activeTab === "requests"
                  ? "text-purple-700 border-b-2 border-purple-700"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Schedule Requests
            </button>
            <button
              onClick={() => setActiveTab("chat")}
              className={`flex-1 py-4 px-6 text-sm font-medium transition-colors ${
                activeTab === "chat"
                  ? "text-purple-700 border-b-2 border-purple-700"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Chat Invites
            </button>
          </div>

          <div className="p-8">
            {loading ? (
              <p className="text-center text-gray-500">Loading...</p>
            ) : (
              renderNotifications(activeTab)
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default NotificationsModal;

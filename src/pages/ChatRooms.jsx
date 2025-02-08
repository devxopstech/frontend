import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const ChatRooms = () => {
  const [rooms, setRooms] = useState({ createdRooms: [], joinedRooms: [] });
  const [newRoomName, setNewRoomName] = useState("");
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchRooms();
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

  const createRoom = async () => {
    try {
      const response = await axios.post(
        "http://localhost:3000/api/chat/rooms",
        { name: newRoomName },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );
      setRooms((prevRooms) => ({
        createdRooms: [...(prevRooms.createdRooms || []), response.data],
        joinedRooms: prevRooms.joinedRooms || [],
      }));
      setShowModal(false);
      toast.success("Room created");
      setNewRoomName("");
    } catch (err) {
      console.error("Error creating room:", err);
      toast.error("Failed to create room, please try again");
    }
  };

  const deleteRoom = async (roomId) => {
    try {
      await axios.delete(`http://localhost:3000/api/chat/rooms/${roomId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });
      toast.success("Room deleted successfully");
      fetchRooms();
    } catch (err) {
      console.error("Error deleting room:", err);
      toast.error("Failed to delete room");
    }
  };

  const leaveRoom = async (roomId) => {
    try {
      await axios.post(
        `http://localhost:3000/api/chat/rooms/${roomId}/leave`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );
      toast.success("Left the room successfully");
      fetchRooms();
    } catch (err) {
      console.error("Error leaving room:", err);
      toast.error("Failed to leave room");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-purple-700 p-4 flex justify-between items-center">
        <h1 className="text-white text-xl font-medium">Your Chat Rooms</h1>
        <button
          onClick={() => setShowModal(true)}
          className="bg-white text-purple-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors"
        >
          Create Room
        </button>
      </header>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto p-6">
        {rooms.createdRooms.length === 0 && rooms.joinedRooms.length === 0 ? (
          <div className="text-center text-gray-600">
            <p>No rooms found.</p>
            <button
              onClick={() => setShowModal(true)}
              className="text-purple-700 underline mt-2"
            >
              Create one?
            </button>
          </div>
        ) : (
          <>
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">
              Created Rooms
            </h2>
            <ul className="space-y-4">
              {rooms.createdRooms.map((room) => (
                <li
                  key={room._id}
                  className="flex items-center justify-between p-4 bg-white rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer hover:bg-purple-50 border border-gray-200"
                >
                  <div
                    className="flex items-center space-x-3"
                    onClick={() => navigate(`/chat/${room._id}`)}
                  >
                    <div className="bg-purple-100 p-2 rounded-full">
                      <svg
                        className="w-6 h-6 text-purple-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 8h2a2 2 0 012 2v9a2 2 0 01-2 2h-2m-4-13h2a2 2 0 012 2v9a2 2 0 01-2 2h-2m-4-13h2a2 2 0 012 2v9a2 2 0 01-2 2H9m-4-13h2a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V10a2 2 0 012-2h2z"
                        />
                      </svg>
                    </div>
                    <span className="text-lg font-medium text-gray-900">
                      {room.name}
                    </span>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => deleteRoom(room._id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <svg
                        className="w-5 h-5"
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
                    <svg
                      className="w-5 h-5 text-purple-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </li>
              ))}
            </ul>

            <h2 className="text-2xl font-semibold mt-6 mb-4 text-gray-800">
              Joined Rooms
            </h2>
            <ul className="space-y-4">
              {rooms.joinedRooms.map((room) => (
                <li
                  key={room._id}
                  className="flex items-center justify-between p-4 bg-white rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer hover:bg-green-50 border border-gray-200"
                >
                  <div
                    className="flex items-center space-x-3"
                    onClick={() => navigate(`/chat/${room._id}`)}
                  >
                    <div className="bg-green-100 p-2 rounded-full">
                      <svg
                        className="w-6 h-6 text-green-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 20h5V8h-5M2 20h5V4H2m8 16h4V10h-4"
                        />
                      </svg>
                    </div>
                    <span className="text-lg font-medium text-gray-900">
                      {room.name}
                    </span>
                  </div>
                  <button
                    onClick={() => leaveRoom(room._id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <svg
                      className="w-5 h-5"
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
                </li>
              ))}
            </ul>
          </>
        )}
      </div>

      {/* Modal for Creating a Room */}
      {showModal && (
        <div className="fixed inset-0 backdrop-blur-md bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Create a New Room
            </h2>
            <input
              type="text"
              value={newRoomName}
              onChange={(e) => setNewRoomName(e.target.value)}
              placeholder="Room Name"
              className="border border-gray-300 rounded-lg p-2 w-full mb-4 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={createRoom}
                className="bg-purple-700 text-white px-4 py-2 rounded-lg hover:bg-purple-800 transition-colors"
              >
                Create
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatRooms;

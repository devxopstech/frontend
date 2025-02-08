import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { getAvailableUsers, createChatRoom } from "../services/api";

const UserItem = ({ user, isSelected, onToggle }) => (
  <div className="flex items-center justify-between p-3 hover:bg-gray-50">
    <div className="flex items-center gap-3">
      <div className="w-2 h-2 rounded-full bg-green-500" />
      {user.profilePicture ? (
        <img
          src={user.profilePicture}
          alt={user.name}
          className="w-12 h-12 rounded-lg object-cover"
        />
      ) : (
        <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center text-white text-xl">
          {user.name[0]}
        </div>
      )}
      <span className="font-medium">{user.name}</span>
    </div>
    <input
      type="checkbox"
      checked={isSelected}
      onChange={() => onToggle(user)}
      className="w-5 h-5 border-2 border-gray-300 rounded focus:ring-purple-500"
    />
  </div>
);

const InviteUsers = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUsers, setSelectedUsers] = useState(new Map());
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      const token = localStorage.getItem("authToken");
      if (!token) {
        setError("Please login to continue");
        navigate("/login");
        return;
      }

      try {
        setLoading(true);
        setError("");
        const response = await getAvailableUsers({
          search: searchQuery,
          page: 1,
        });
        if (response.success) {
          setUsers(response.data.users);
        } else {
          setError(response.message);
        }
      } catch (error) {
        console.error("Failed to fetch users:", error);
        setError(error.message || "Failed to fetch users");
        if (error.response?.status === 401) {
          navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [searchQuery, navigate]);

  const handleToggleUser = (user) => {
    const newSelected = new Map(selectedUsers);
    if (newSelected.has(user._id)) {
      newSelected.delete(user._id);
    } else {
      newSelected.set(user._id, user);
    }
    setSelectedUsers(newSelected);
  };

  const handleStartChat = async () => {
    if (selectedUsers.size === 0) return;

    try {
      setLoading(true);
      const participants = Array.from(selectedUsers.keys());

      // Create room data
      const roomData = {
        name:
          selectedUsers.size === 1
            ? Array.from(selectedUsers.values())[0].name
            : `Group Chat (${selectedUsers.size})`,
        participants,
      };

      const response = await createChatRoom(roomData);

      if (response.success) {
        navigate("/chat", {
          state: {
            roomId: response.data.room._id,
          },
          replace: true,
        });
      } else {
        setError(response.message || "Failed to create chat room");
      }
    } catch (error) {
      console.error("Failed to create chat room:", error);
      setError(error.message || "Failed to create chat room");
    } finally {
      setLoading(false);
    }
  };

  const { roomId, currentParticipants } = location.state || {};
  const handleSubmit = async () => {
    try {
      if (roomId) {
        // Add to existing room
        await addParticipants(roomId, Array.from(selectedUsers.keys()));
        navigate(`/chat`, {
          state: { roomId },
          replace: true,
        });
      } else {
        // Create new room
        const response = await createChatRoom({
          name: `Group (${selectedUsers.size + 1})`,
          participants: Array.from(selectedUsers.keys()),
        });
        navigate(`/chat`, {
          state: { roomId: response.data.room._id },
          replace: true,
        });
      }
    } catch (error) {
      toast.error("Failed to add participants");
    }
  };
  return (
    <div className="min-h-screen bg-white">
      <div className="p-4 space-y-4">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-xl font-medium">Invite Users</h1>
            <p className="text-sm text-gray-600">
              Select users to start a chat.
            </p>
          </div>
          <button onClick={() => navigate(-1)} className="p-2">
            <svg
              className="w-6 h-6"
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

        {/* Search Input */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-3 border-2 border-purple-700 rounded-lg focus:outline-none"
          />
        </div>

        {/* Error Message */}
        {error && <div className="text-red-500 text-sm">{error}</div>}

        {/* Users List */}
        <div className="flex justify-between items-center">
          <span className="font-medium">Available Users</span>
          <span className="text-gray-600">{selectedUsers.size} Selected</span>
        </div>

        {loading ? (
          <div className="flex justify-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-700"></div>
          </div>
        ) : (
          <div className="divide-y">
            {users.map((user) => (
              <UserItem
                key={user._id}
                user={user}
                isSelected={selectedUsers.has(user._id)}
                onToggle={handleToggleUser}
              />
            ))}
          </div>
        )}

        {/* Start Chat Button */}
        <button
          className={`w-full py-4 rounded-lg text-white
            ${selectedUsers.size > 0 ? "bg-purple-700" : "bg-purple-300"}
            transition-colors duration-200`}
          disabled={selectedUsers.size === 0 || loading}
          onClick={handleStartChat}
        >
          {loading
            ? "Creating Chat..."
            : `Start Chat (${selectedUsers.size} selected)`}
        </button>
      </div>
    </div>
  );
};
export default InviteUsers;

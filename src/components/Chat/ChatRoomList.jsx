// components/Chat/ChatRoomList.jsx
import React from "react";

const ChatRoomList = ({ rooms, selectedRoom, onRoomSelect, onCreateNew }) => {
  console.log(rooms);

  if (!Array.isArray(rooms)) {
    return <div>No chat rooms available.</div>;
  }

  return (
    <div className="w-80 border-r flex flex-col">
      <div className="p-4 border-b">
        <button
          onClick={onCreateNew}
          className="w-full bg-purple-600 text-white rounded-lg py-2 px-4 hover:bg-purple-700"
        >
          Create New Group
        </button>
      </div>
      <div className="flex-1 overflow-y-auto">
        {rooms.map((room) => (
          <div
            key={room._id}
            onClick={() => onRoomSelect(room)}
            className={`p-4 cursor-pointer hover:bg-gray-50 ${
              selectedRoom?._id === room._id ? "bg-purple-50" : ""
            }`}
          >
            <div className="flex items-center">
              <div className="w-12 h-12 bg-purple-200 rounded-full flex items-center justify-center">
                {room.name[0].toUpperCase()}
              </div>
              <div className="ml-3">
                <div className="font-medium">{room.name}</div>
                <div className="text-sm text-gray-500">
                  {room.participants.length} members
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChatRoomList;

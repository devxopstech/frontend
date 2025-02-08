import React from "react";
import { ArrowLeft, Users, UserPlus } from "lucide-react"; // Using lucide-react for icons

const ChatHeader = ({ room, onBack, onShowParticipants, onInvite }) => {
  return (
    <div className="bg-white border-b p-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <button onClick={onBack} className="text-gray-600">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h2 className="font-medium">{room.name}</h2>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={onShowParticipants}
          className="p-2 hover:bg-gray-100 rounded-full"
        >
          <Users className="w-5 h-5" />
        </button>

        <button
          onClick={onInvite}
          className="p-2 hover:bg-gray-100 rounded-full"
        >
          <UserPlus className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default ChatHeader;

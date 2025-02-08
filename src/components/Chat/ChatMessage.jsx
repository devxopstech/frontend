const ChatMessage = ({ content, sender, timestamp }) => {
  return (
    <div className="p-4 hover:bg-gray-50">
      <div className="flex items-start gap-3">
        {sender?.profilePicture ? (
          <img
            src={sender.profilePicture}
            alt={sender.name || "User"}
            className="w-10 h-10 rounded-full object-cover flex-shrink-0"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
            <span className="text-purple-700 font-medium">
              {(sender?.name?.[0] || "?").toUpperCase()}
            </span>
          </div>
        )}
        <div className="flex-1">
          <div className="text-sm text-gray-500 mb-1">
            {sender?.name || "Unknown User"}
          </div>
          <p className="text-gray-800">{content}</p>
          <div className="text-xs text-gray-400 mt-1">{timestamp}</div>
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;

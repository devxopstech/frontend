import { format } from "date-fns";

const MessageBubble = ({ message, isMine }) => {
  let formattedTime = "Invalid Date"; // Default fallback

  if (message.timestamp) {
    const date = new Date(message.timestamp);
    if (!isNaN(date)) {
      formattedTime = format(date, "hh:mm a");
    }
  }

  return (
    <div className={`message-bubble ${isMine ? "mine" : ""}`}>
      <p>{message.content}</p>
      <span className="text-sm text-gray-500">{formattedTime}</span>
    </div>
  );
};

export default MessageBubble;

const MessageList = ({ messages, user }) => {
  const formatTimestamp = (timestamp) => {
    if (!timestamp) return "";

    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);

    // If message is from today, show only time
    if (diffInHours < 24 && date.getDate() === now.getDate()) {
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    }

    // If message is from yesterday
    if (diffInHours < 48 && date.getDate() === now.getDate() - 1) {
      return `Yesterday ${date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })}`;
    }

    // For older messages, show date and time
    return date.toLocaleDateString([], {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };
  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-white">
      {messages?.map((msg, index) => (
        <div
          key={index}
          className={`flex ${
            msg.sender === user.username ? "justify-end" : "justify-start"
          }`}
        >
          <div
            className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
              msg.sender === user.username
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-800"
            }`}
          >
            <div
              className={`text-xs mb-1 ${
                msg.sender === user.username ? "text-blue-100" : "text-gray-600"
              }`}
            >
              {msg.sender}
            </div>
            <div className="text-sm">{msg.message}</div>
            <div
              className={`text-xs mt-1 ${
                msg.sender === user.username ? "text-blue-100" : "text-gray-500"
              }`}
            >
              {formatTimestamp(msg.createdAt)}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MessageList;

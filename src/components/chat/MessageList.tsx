import { Message } from "./types";

interface MessageListProps {
  messages: Message[];
  currentUserId?: string;
}

const MessageList = ({ messages, currentUserId }: MessageListProps) => {
  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.map((msg, idx) => (
        <div
          key={msg.id || idx}
          className={`flex ${msg.sender === currentUserId ? 'justify-end' : 'justify-start'}`}
        >
          <div
            className={`rounded-lg px-4 py-2 max-w-[80%] ${
              msg.sender === currentUserId
                ? 'bg-real-primary text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
            }`}
          >
            {msg.content}
          </div>
        </div>
      ))}
    </div>
  );
};

export default MessageList;
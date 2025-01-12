import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Message {
  id: number;
  sender: string;
  content: string;
  timestamp: Date;
}

const Messages = () => {
  const [messages] = useState<Message[]>([
    {
      id: 1,
      sender: "Agent ImmoHub",
      content: "Bonjour ! Comment puis-je vous aider ?",
      timestamp: new Date(),
    },
  ]);
  const [newMessage, setNewMessage] = useState("");

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Sending message:", newMessage);
    setNewMessage("");
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow">
        <div className="p-4 border-b">
          <h1 className="text-xl font-semibold">Messages</h1>
        </div>

        <div className="h-[400px] overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className="flex flex-col space-y-1"
            >
              <div className="flex items-center space-x-2">
                <span className="font-medium">{message.sender}</span>
                <span className="text-xs text-gray-500">
                  {message.timestamp.toLocaleTimeString()}
                </span>
              </div>
              <p className="text-gray-700">{message.content}</p>
            </div>
          ))}
        </div>

        <form onSubmit={handleSend} className="p-4 border-t">
          <div className="flex space-x-2">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Écrivez votre message..."
              className="flex-1"
            />
            <Button type="submit">Envoyer</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Messages;
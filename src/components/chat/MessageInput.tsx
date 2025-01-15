import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Phone } from "lucide-react";

interface MessageInputProps {
  newMessage: string;
  onMessageChange: (message: string) => void;
  onSend: () => void;
  onCall: () => void;
}

const MessageInput = ({ newMessage, onMessageChange, onSend, onCall }: MessageInputProps) => {
  return (
    <div className="p-4 border-t dark:border-gray-700">
      <div className="flex gap-2">
        <Input
          value={newMessage}
          onChange={(e) => onMessageChange(e.target.value)}
          placeholder="Écrivez votre message..."
          onKeyPress={(e) => e.key === 'Enter' && onSend()}
          className="flex-1"
        />
        <Button onClick={onSend} className="bg-real-primary hover:bg-real-primary/90">
          <Send className="h-4 w-4" />
        </Button>
      </div>
      <div className="mt-2 flex justify-center">
        <Button
          variant="outline"
          onClick={onCall}
          className="text-real-primary hover:text-real-primary/90"
        >
          <Phone className="h-4 w-4 mr-2" />
          Nous appeler
        </Button>
      </div>
    </div>
  );
};

export default MessageInput;
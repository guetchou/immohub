import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  created_at: string;
}

const Messages = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [selectedReceiver, setSelectedReceiver] = useState("");
  const [availableReceivers, setAvailableReceivers] = useState<Array<{id: string, full_name: string}>>([]);

  useEffect(() => {
    if (user) {
      fetchMessages();
      fetchAvailableReceivers();
    }
  }, [user]);

  const fetchMessages = async () => {
    try {
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .or(`sender_id.eq.${user?.id},receiver_id.eq.${user?.id}`)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      console.error("Error fetching messages:", error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les messages",
        variant: "destructive",
      });
    }
  };

  const fetchAvailableReceivers = async () => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, full_name")
        .neq("id", user?.id);

      if (error) throw error;
      setAvailableReceivers(data || []);
    } catch (error) {
      console.error("Error fetching receivers:", error);
    }
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedReceiver) return;

    try {
      const { error } = await supabase.from("messages").insert({
        content: newMessage,
        sender_id: user?.id,
        receiver_id: selectedReceiver,
      });

      if (error) throw error;

      setNewMessage("");
      fetchMessages();
      
      toast({
        title: "Succès",
        description: "Message envoyé avec succès",
      });
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Erreur",
        description: "Impossible d'envoyer le message",
        variant: "destructive",
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
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
              className={`flex flex-col space-y-1 ${
                message.sender_id === user?.id ? "items-end" : "items-start"
              }`}
            >
              <div
                className={`rounded-lg px-4 py-2 max-w-[80%] ${
                  message.sender_id === user?.id
                    ? "bg-real-primary text-white"
                    : "bg-gray-100"
                }`}
              >
                <p className="text-sm">{message.content}</p>
                <span className="text-xs opacity-75">
                  {formatDate(message.created_at)}
                </span>
              </div>
            </div>
          ))}
        </div>

        <form onSubmit={handleSend} className="p-4 border-t">
          <div className="flex flex-col space-y-2">
            <select
              value={selectedReceiver}
              onChange={(e) => setSelectedReceiver(e.target.value)}
              className="w-full p-2 border rounded mb-2"
              required
            >
              <option value="">Sélectionner un destinataire</option>
              {availableReceivers.map((receiver) => (
                <option key={receiver.id} value={receiver.id}>
                  {receiver.full_name || "Utilisateur"}
                </option>
              ))}
            </select>
            <div className="flex space-x-2">
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Écrivez votre message..."
                className="flex-1"
                required
              />
              <Button type="submit">Envoyer</Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Messages;
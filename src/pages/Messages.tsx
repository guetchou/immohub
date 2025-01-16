import { useEffect, useState } from "react";
import { NavBar } from "@/components/navigation/NavBar";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";

interface Message {
  id: string;
  content: string;
  sender_id: string;
  receiver_id: string;
  created_at: string;
}

const Messages = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (!user) return;

    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
        .order("created_at", { ascending: true });

      if (error) {
        console.error("Error fetching messages:", error);
        return;
      }

      setMessages(data || []);
    };

    fetchMessages();

    // Souscrire aux nouveaux messages
    const channel = supabase
      .channel("messages")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `sender_id=eq.${user.id},receiver_id=eq.${user.id}`,
        },
        (payload) => {
          console.log("Nouveau message reçu:", payload);
          setMessages((prev) => [...prev, payload.new as Message]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const sendMessage = async () => {
    if (!user || !newMessage.trim()) return;

    try {
      const { error } = await supabase.from("messages").insert([
        {
          content: newMessage,
          sender_id: user.id,
          receiver_id: "00000000-0000-0000-0000-000000000000", // ID de l'agent de support
        },
      ]);

      if (error) throw error;

      setNewMessage("");
      toast({
        title: "Message envoyé",
        description: "Votre message a été envoyé avec succès",
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

  return (
    <div className="min-h-screen bg-background">
      <NavBar />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-4 bg-primary text-white">
            <h1 className="text-xl font-bold">Messages</h1>
          </div>

          <div className="h-[500px] overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.sender_id === user?.id ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[70%] rounded-lg px-4 py-2 ${
                    message.sender_id === user?.id
                      ? "bg-primary text-white"
                      : "bg-gray-100"
                  }`}
                >
                  <p>{message.content}</p>
                  <span className="text-xs opacity-70">
                    {new Date(message.created_at).toLocaleString()}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 border-t">
            <div className="flex gap-2">
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Écrivez votre message..."
                onKeyPress={(e) => e.key === "Enter" && sendMessage()}
              />
              <Button onClick={sendMessage}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Messages;
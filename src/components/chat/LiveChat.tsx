import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { MessageSquare } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";
import { Message, SupabaseMessage } from "./types";

// Using a valid UUID for the support agent
const SUPPORT_AGENT_ID = '00000000-0000-0000-0000-000000000000';

const LiveChat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      console.log("User not authenticated, redirecting to login");
      navigate("/login");
      return;
    }

    console.log("Setting up chat subscription for user:", user.id);
    
    const channel = supabase
      .channel('messages')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `sender_id=eq.${user.id},receiver_id=eq.${SUPPORT_AGENT_ID}`
        },
        (payload: { new: SupabaseMessage }) => {
          console.log("Received new message:", payload.new);
          const formattedMessage: Message = {
            id: payload.new.id,
            content: payload.new.content,
            sender: payload.new.sender_id,
          };
          setMessages(prev => [...prev, formattedMessage]);
        }
      )
      .subscribe((status) => {
        console.log("Subscription status:", status);
      });

    const loadExistingMessages = async () => {
      try {
        const { data, error } = await supabase
          .from('messages')
          .select('*')
          .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
          .order('created_at', { ascending: true });

        if (error) {
          console.error("Error loading messages:", error);
          return;
        }

        if (data) {
          console.log("Loaded messages:", data);
          const formattedMessages: Message[] = data.map(msg => ({
            id: msg.id,
            content: msg.content,
            sender: msg.sender_id,
          }));
          setMessages(formattedMessages);
        }
      } catch (error) {
        console.error("Error in loadExistingMessages:", error);
      }
    };

    loadExistingMessages();

    return () => {
      console.log("Cleaning up chat subscription");
      supabase.removeChannel(channel);
    };
  }, [user, navigate]);

  const handleSend = async () => {
    if (!newMessage.trim() || !user) return;

    try {
      console.log("Sending message:", newMessage);
      const { error } = await supabase
        .from('messages')
        .insert([
          {
            content: newMessage,
            sender_id: user.id,
            receiver_id: SUPPORT_AGENT_ID
          }
        ]);

      if (error) throw error;
      setNewMessage("");
      
      toast({
        title: "Message envoyé",
        description: "Un agent vous répondra bientôt",
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

  const handleCall = () => {
    toast({
      title: "Appel en cours",
      description: "Un agent va vous contacter dans quelques instants",
    });
  };

  if (!user) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {isOpen ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-80 h-[500px] flex flex-col">
          <div className="bg-real-primary p-4 rounded-t-lg text-white flex justify-between items-center">
            <h3 className="font-semibold">Service Client</h3>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setIsOpen(false)}
              className="text-white hover:text-gray-200"
            >
              <span className="sr-only">Fermer</span>
              ×
            </Button>
          </div>
          
          <MessageList messages={messages} currentUserId={user.id} />
          <MessageInput 
            newMessage={newMessage}
            onMessageChange={setNewMessage}
            onSend={handleSend}
            onCall={handleCall}
          />
        </div>
      ) : (
        <Button
          onClick={() => setIsOpen(true)}
          className="rounded-full h-14 w-14 shadow-lg bg-real-primary hover:bg-real-primary/90"
        >
          <MessageSquare className="h-6 w-6" />
        </Button>
      )}
    </div>
  );
};

export default LiveChat;
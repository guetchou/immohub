import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Send, Phone, MessageSquare } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const LiveChat = () => {
  const [messages, setMessages] = useState<Array<{id: string; content: string; sender: string}>>([]);
  const [newMessage, setNewMessage] = useState("");
  const { user } = useAuth();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (user) {
      const subscription = supabase
        .channel('messages')
        .on('INSERT', payload => {
          setMessages(prev => [...prev, payload.new]);
        })
        .subscribe();

      return () => {
        subscription.unsubscribe();
      };
    }
  }, [user]);

  const handleSend = async () => {
    if (!newMessage.trim()) return;

    try {
      const { error } = await supabase
        .from('messages')
        .insert([
          {
            content: newMessage,
            sender_id: user?.id,
            receiver_id: 'SUPPORT_AGENT_ID' // Replace with actual support agent ID
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
          
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg, idx) => (
              <div
                key={msg.id || idx}
                className={`flex ${msg.sender === user?.id ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`rounded-lg px-4 py-2 max-w-[80%] ${
                    msg.sender === user?.id
                      ? 'bg-real-primary text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}
          </div>
          
          <div className="p-4 border-t dark:border-gray-700">
            <div className="flex gap-2">
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Écrivez votre message..."
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                className="flex-1"
              />
              <Button onClick={handleSend} className="bg-real-primary hover:bg-real-primary/90">
                <Send className="h-4 w-4" />
              </Button>
            </div>
            <div className="mt-2 flex justify-center">
              <Button
                variant="outline"
                onClick={handleCall}
                className="text-real-primary hover:text-real-primary/90"
              >
                <Phone className="h-4 w-4 mr-2" />
                Nous appeler
              </Button>
            </div>
          </div>
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
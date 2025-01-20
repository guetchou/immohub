import { useState, useEffect } from "react";
import { MessageSquare, Send, Phone, Bot } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useToast } from "./ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Array<{text: string; isUser: boolean}>>([
    { text: "Bonjour ! Je suis votre assistant virtuel ImmoHub. Comment puis-je vous aider ?", isUser: false },
    { text: "Je peux vous aider avec :", isUser: false },
    { text: "1. Recherche de propriétés", isUser: false },
    { text: "2. Planification de visites", isUser: false },
    { text: "3. Questions sur le marché immobilier", isUser: false }
  ]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSend = async () => {
    if (!newMessage.trim()) return;
    
    console.log("User sent message:", newMessage);
    
    setMessages(prev => [...prev, { text: newMessage, isUser: true }]);
    setNewMessage("");
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('get-ai-response', {
        body: { message: newMessage }
      });

      if (error) {
        console.error("Supabase function error:", error);
        throw error;
      }

      const aiResponse = data.response;
      console.log("AI Response:", aiResponse);

      setMessages(prev => [...prev, { text: aiResponse, isUser: false }]);
      
      toast({
        title: "Message reçu",
        description: "Notre assistant a répondu à votre demande",
      });
    } catch (error) {
      console.error("Error in chat:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la communication avec l'assistant",
        variant: "destructive",
      });
      setMessages(prev => [...prev, { 
        text: "Désolé, je rencontre des difficultés techniques. Un agent va vous contacter rapidement.", 
        isUser: false 
      }]);
    } finally {
      setIsLoading(false);
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
          <div className="bg-real-primary text-white p-4 rounded-t-lg flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Bot className="h-5 w-5" />
              <h3 className="font-semibold">Assistant ImmoHub</h3>
            </div>
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
                key={idx}
                className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`rounded-lg px-4 py-2 max-w-[80%] ${
                    msg.isUser
                      ? 'bg-real-primary text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-real-primary"></div>
              </div>
            )}
          </div>
          
          <div className="p-4 border-t dark:border-gray-700">
            <div className="flex gap-2">
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Écrivez votre message..."
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                className="flex-1"
                disabled={isLoading}
              />
              <Button 
                onClick={handleSend} 
                className="bg-real-primary hover:bg-real-primary/90"
                disabled={isLoading}
              >
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

export default ChatBot;
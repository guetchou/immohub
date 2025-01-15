import { useState } from "react";
import { MessageSquare, Send } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useToast } from "./ui/use-toast";

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Array<{text: string; isUser: boolean}>>([
    { text: "Bonjour ! Je suis votre assistant virtuel. Comment puis-je vous aider ?", isUser: false },
    { text: "Je peux vous aider à :", isUser: false },
    { text: "1. Trouver un bien immobilier", isUser: false },
    { text: "2. Planifier une visite", isUser: false },
    { text: "3. Contacter un agent", isUser: false }
  ]);
  const [newMessage, setNewMessage] = useState("");
  const { toast } = useToast();

  const handleSend = () => {
    if (!newMessage.trim()) return;
    
    // Ajouter le message de l'utilisateur
    setMessages(prev => [...prev, { text: newMessage, isUser: true }]);
    setNewMessage("");
    
    // Simuler une réponse intelligente du chatbot
    setTimeout(() => {
      let response = "Je vais vous mettre en relation avec un agent immobilier.";
      
      if (newMessage.toLowerCase().includes("visite")) {
        response = "Je peux vous aider à planifier une visite. Quel jour vous conviendrait le mieux ?";
      } else if (newMessage.toLowerCase().includes("prix")) {
        response = "Les prix varient selon la localisation et le type de bien. Pouvez-vous me préciser vos critères ?";
      } else if (newMessage.toLowerCase().includes("localisation")) {
        response = "Nous avons des biens disponibles dans plusieurs quartiers de Brazzaville et Pointe-Noire. Quelle zone vous intéresse ?";
      }

      setMessages(prev => [...prev, { text: response, isUser: false }]);
      
      toast({
        title: "Message reçu",
        description: "Notre assistant traite votre demande",
      });
    }, 1000);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {isOpen ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-80 h-[500px] flex flex-col">
          <div className="bg-real-primary text-white p-4 rounded-t-lg flex justify-between items-center">
            <h3 className="font-semibold">Assistant ImmoHub</h3>
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
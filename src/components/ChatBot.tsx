import { useState } from "react";
import { MessageSquare, Send, Phone, Mail, Video, MessageCircle, Facebook, Instagram, Linkedin, MapPin } from "lucide-react";
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
    { text: "2. Questions sur le marché immobilier", isUser: false },
    { text: "3. Planification de visites", isUser: false },
    { text: "4. Conseils d'investissement", isUser: false },
    { text: "5. Estimation de biens", isUser: false }
  ]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSend = async () => {
    if (!newMessage.trim()) return;
    
    const userMessage = newMessage.trim();
    setMessages(prev => [...prev, { text: userMessage, isUser: true }]);
    setNewMessage("");
    setIsLoading(true);
    
    try {
      console.log("Preparing to send message:", userMessage);
      
      const { data, error } = await supabase.functions.invoke('get-ai-response', {
        body: JSON.stringify({
          message: userMessage,
          timestamp: new Date().toISOString()
        })
      });

      console.log("Response received:", { data, error });

      if (error) {
        console.error("Supabase function error:", error);
        throw error;
      }

      if (!data || !data.response) {
        console.error("Invalid response format:", data);
        throw new Error("Invalid response format from AI");
      }

      const aiResponse = data.response;
      console.log("Processing AI response:", aiResponse);

      setMessages(prev => [...prev, { text: aiResponse, isUser: false }]);
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

  const handleContactOption = (method: string) => {
    switch (method) {
      case 'call':
        toast({
          title: "Appel en cours",
          description: "Un agent va vous contacter dans quelques instants",
        });
        break;
      case 'email':
        window.location.href = "mailto:contact@immohub.cg";
        break;
      case 'whatsapp':
        window.open("https://wa.me/242061234567", "_blank");
        break;
      case 'facebook':
        window.open("https://facebook.com/immohub.cg", "_blank");
        break;
      case 'instagram':
        window.open("https://instagram.com/immohub.cg", "_blank");
        break;
      case 'linkedin':
        window.open("https://linkedin.com/company/immohub-cg", "_blank");
        break;
      case 'office':
        window.open("https://maps.google.com/?q=ImmoHub+Congo", "_blank");
        break;
      case 'video':
        toast({
          title: "Appel vidéo",
          description: "Un lien pour l'appel vidéo va vous être envoyé par email",
        });
        break;
      default:
        break;
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {isOpen ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-[400px] h-[600px] flex flex-col">
          <div className="bg-real-primary text-white p-4 rounded-t-lg flex justify-between items-center">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
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
          
          <div className="p-4 border-t dark:border-gray-700 bg-gray-50 dark:bg-gray-800 rounded-b-lg">
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
            <div className="mt-4 grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                onClick={() => handleContactOption('call')}
                className="text-real-primary hover:text-real-primary/90"
              >
                <Phone className="h-4 w-4 mr-2" />
                Appeler
              </Button>
              <Button
                variant="outline"
                onClick={() => handleContactOption('video')}
                className="text-real-primary hover:text-real-primary/90"
              >
                <Video className="h-4 w-4 mr-2" />
                Visio
              </Button>
              <Button
                variant="outline"
                onClick={() => handleContactOption('whatsapp')}
                className="text-real-primary hover:text-real-primary/90"
              >
                <MessageCircle className="h-4 w-4 mr-2" />
                WhatsApp
              </Button>
              <Button
                variant="outline"
                onClick={() => handleContactOption('email')}
                className="text-real-primary hover:text-real-primary/90"
              >
                <Mail className="h-4 w-4 mr-2" />
                Email
              </Button>
            </div>
            <div className="mt-2 flex justify-center space-x-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleContactOption('facebook')}
                className="text-real-primary hover:text-real-primary/90"
              >
                <Facebook className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleContactOption('instagram')}
                className="text-real-primary hover:text-real-primary/90"
              >
                <Instagram className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleContactOption('linkedin')}
                className="text-real-primary hover:text-real-primary/90"
              >
                <Linkedin className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleContactOption('office')}
                className="text-real-primary hover:text-real-primary/90"
              >
                <MapPin className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <Button
          onClick={() => setIsOpen(true)}
          className="rounded-full h-14 w-14 shadow-lg bg-real-primary hover:bg-real-primary/90 animate-bounce"
        >
          <MessageSquare className="h-6 w-6" />
        </Button>
      )}
    </div>
  );
};

export default ChatBot;

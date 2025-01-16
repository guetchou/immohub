import { useState } from "react";
import { NavBar } from "@/components/navigation/NavBar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Card } from "@/components/ui/card";
import { MessageSquare, Phone, Mail } from "lucide-react";

const CustomerService = () => {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const { toast } = useToast();
  const { user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Erreur",
        description: "Vous devez être connecté pour soumettre un ticket",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from("support_tickets")
        .insert([
          {
            user_id: user.id,
            subject,
            message,
            status: "open",
          },
        ]);

      if (error) throw error;

      toast({
        title: "Ticket créé",
        description: "Nous vous répondrons dans les plus brefs délais",
      });

      setSubject("");
      setMessage("");
    } catch (error) {
      console.error("Error creating ticket:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la création du ticket",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <NavBar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-center bg-gradient-to-r from-real-primary to-real-accent bg-clip-text text-transparent">
          Service Client
        </h1>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <Card className="p-6">
            <div className="flex items-center gap-4 mb-4">
              <Phone className="h-8 w-8 text-real-primary" />
              <div>
                <h3 className="text-lg font-semibold">Assistance téléphonique</h3>
                <p className="text-gray-600">+242 06 123 4567</p>
              </div>
            </div>
            <p className="text-sm text-gray-500">
              Du lundi au vendredi, de 8h à 18h
            </p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-4 mb-4">
              <Mail className="h-8 w-8 text-real-primary" />
              <div>
                <h3 className="text-lg font-semibold">Email</h3>
                <p className="text-gray-600">support@immohubcongo.com</p>
              </div>
            </div>
            <p className="text-sm text-gray-500">
              Réponse sous 24h ouvrées
            </p>
          </Card>
        </div>

        <Card className="max-w-2xl mx-auto p-6">
          <div className="flex items-center gap-4 mb-6">
            <MessageSquare className="h-6 w-6 text-real-primary" />
            <h2 className="text-2xl font-semibold">Créer un ticket</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Input
                placeholder="Sujet"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                required
              />
            </div>

            <div>
              <Textarea
                placeholder="Votre message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="min-h-[150px]"
                required
              />
            </div>

            <Button type="submit" className="w-full">
              Envoyer
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default CustomerService;
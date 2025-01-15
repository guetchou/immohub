import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Phone, Mail, MessageSquare } from "lucide-react";

const CustomerService = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Implement your form submission logic here
      console.log("Form submitted:", formData);
      
      toast({
        title: "Message envoyé",
        description: "Nous vous répondrons dans les plus brefs délais",
      });
      
      setFormData({
        name: "",
        email: "",
        phone: "",
        message: "",
      });
    } catch (error) {
      console.error("Error submitting form:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'envoi du message",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-real-primary to-real-accent bg-clip-text text-transparent">
          Service Client
        </h1>

        <div className="grid md:grid-cols-2 gap-8">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Contactez-nous</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Input
                  placeholder="Votre nom"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div>
                <Input
                  type="email"
                  placeholder="Votre email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
              <div>
                <Input
                  type="tel"
                  placeholder="Votre téléphone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
              <div>
                <Textarea
                  placeholder="Votre message"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  required
                  className="min-h-[100px]"
                />
              </div>
              <Button type="submit" className="w-full bg-real-primary hover:bg-real-primary/90">
                Envoyer
              </Button>
            </form>
          </Card>

          <div className="space-y-6">
            <Card className="p-6">
              <div className="flex items-center gap-4">
                <div className="bg-real-primary/10 p-3 rounded-full">
                  <Phone className="h-6 w-6 text-real-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">Par téléphone</h3>
                  <p className="text-gray-600 dark:text-gray-400">+242 06 123 4567</p>
                  <p className="text-sm text-gray-500">Lun-Ven: 8h-18h</p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-4">
                <div className="bg-real-primary/10 p-3 rounded-full">
                  <Mail className="h-6 w-6 text-real-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">Par email</h3>
                  <p className="text-gray-600 dark:text-gray-400">contact@immohub.cg</p>
                  <p className="text-sm text-gray-500">Réponse sous 24h</p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-4">
                <div className="bg-real-primary/10 p-3 rounded-full">
                  <MessageSquare className="h-6 w-6 text-real-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">Chat en direct</h3>
                  <p className="text-gray-600 dark:text-gray-400">Disponible 24/7</p>
                  <Button 
                    variant="link" 
                    className="text-real-primary p-0 h-auto font-normal hover:text-real-primary/90"
                  >
                    Démarrer une conversation
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerService;
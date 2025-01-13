import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { NavBar } from "@/components/navigation/NavBar";
import { 
  FileText, 
  Scale, 
  MessageSquare,
  ChevronRight
} from "lucide-react";

type AssistanceType = "administrative" | "legal" | "consulting";

interface AssistanceRequest {
  type: AssistanceType;
  description: string;
  contact: string;
}

export default function AdministrativeAssistance() {
  const [request, setRequest] = useState<AssistanceRequest>({
    type: "administrative",
    description: "",
    contact: "",
  });

  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!request.description || !request.contact) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs",
        variant: "destructive",
      });
      return;
    }

    // Submit request
    toast({
      title: "Demande envoyée",
      description: "Nous vous contacterons bientôt",
    });
  };

  const services = [
    {
      type: "administrative" as AssistanceType,
      title: "Assistance Administrative",
      description: "Aide pour les documents et démarches administratives",
      icon: FileText,
    },
    {
      type: "legal" as AssistanceType,
      title: "Conseil Juridique",
      description: "Consultation et assistance juridique immobilière",
      icon: Scale,
    },
    {
      type: "consulting" as AssistanceType,
      title: "Conseil Immobilier",
      description: "Accompagnement dans vos projets immobiliers",
      icon: MessageSquare,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <NavBar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Assistance Administrative</h1>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {services.map((service) => (
            <button
              key={service.type}
              onClick={() => setRequest(prev => ({ ...prev, type: service.type }))}
              className={`p-6 rounded-lg border transition-colors ${
                request.type === service.type 
                  ? "border-primary bg-primary/5" 
                  : "border-border hover:border-primary"
              }`}
            >
              <service.icon className="h-8 w-8 mb-4" />
              <h3 className="font-semibold mb-2">{service.title}</h3>
              <p className="text-sm text-muted-foreground">{service.description}</p>
              <ChevronRight className="h-5 w-5 mt-4 mx-auto" />
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-6">
          <div>
            <Label htmlFor="description">Description de votre besoin</Label>
            <Input
              id="description"
              value={request.description}
              onChange={(e) => 
                setRequest(prev => ({ ...prev, description: e.target.value }))}
              className="mt-1"
              placeholder="Décrivez votre situation..."
            />
          </div>

          <div>
            <Label htmlFor="contact">Contact</Label>
            <Input
              id="contact"
              value={request.contact}
              onChange={(e) => 
                setRequest(prev => ({ ...prev, contact: e.target.value }))}
              className="mt-1"
              placeholder="Email ou numéro de téléphone"
            />
          </div>

          <Button type="submit" className="w-full">
            Envoyer la demande
          </Button>
        </form>
      </div>
    </div>
  );
}
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Scale, HelpCircle } from "lucide-react";

const AdministrativeAssistance = () => {
  const services = [
    {
      title: "Assistance Administrative",
      description: "Support pour vos démarches administratives immobilières",
      icon: FileText,
      items: [
        "Préparation des documents administratifs",
        "Suivi des dossiers",
        "Assistance aux formalités",
        "Relations avec les administrations"
      ]
    },
    {
      title: "Assistance Juridique",
      description: "Conseil et accompagnement juridique",
      icon: Scale,
      items: [
        "Analyse des contrats",
        "Conseil juridique personnalisé",
        "Médiation et résolution des litiges",
        "Vérification de conformité"
      ]
    },
    {
      title: "Conseil Immobilier",
      description: "Expertise et orientation dans vos projets",
      icon: HelpCircle,
      items: [
        "Étude de marché",
        "Optimisation fiscale",
        "Stratégie d'investissement",
        "Analyse de rentabilité"
      ]
    }
  ];

  return (
    <div className="container mx-auto p-4 space-y-6">
      <h2 className="text-2xl font-bold text-center mb-8">Services d'Assistance</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {services.map((service) => (
          <Card key={service.title} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-2">
                <service.icon className="h-6 w-6 text-primary" />
                <CardTitle className="text-xl">{service.title}</CardTitle>
              </div>
              <CardDescription>{service.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {service.items.map((item) => (
                  <li key={item} className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                    <span className="text-sm">{item}</span>
                  </li>
                ))}
              </ul>
              <Button className="w-full mt-4">
                Demander une consultation
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AdministrativeAssistance;
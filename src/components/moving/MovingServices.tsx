import { Package, Truck, Warehouse, Clock, Shield, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const MovingServices = () => {
  const services = [
    {
      icon: Truck,
      title: "Transport",
      description: "Transport sécurisé de vos biens avec des véhicules adaptés",
      price: "À partir de 50.000 FCFA",
    },
    {
      icon: Package,
      title: "Emballage",
      description: "Service d'emballage professionnel avec matériaux fournis",
      price: "À partir de 25.000 FCFA",
    },
    {
      icon: Warehouse,
      title: "Stockage",
      description: "Solutions de stockage temporaire sécurisées",
      price: "À partir de 50.000 FCFA/mois",
    },
    {
      icon: Clock,
      title: "Express",
      description: "Service de déménagement express sous 24h",
      price: "À partir de 100.000 FCFA",
    },
    {
      icon: Shield,
      title: "Assurance",
      description: "Assurance tous risques pour vos biens",
      price: "5% du montant total",
    },
    {
      icon: CheckCircle,
      title: "Premium",
      description: "Service complet clé en main",
      price: "Sur devis",
    },
  ];

  return (
    <div className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-real-primary text-center mb-12">
          Nos Services de Déménagement
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <div
              key={service.title}
              className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow"
            >
              <service.icon className="h-12 w-12 text-real-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
              <p className="text-gray-600 mb-4">{service.description}</p>
              <p className="text-real-primary font-semibold mb-4">{service.price}</p>
              <Button className="w-full bg-real-primary hover:bg-real-primary/90">
                Réserver
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MovingServices;
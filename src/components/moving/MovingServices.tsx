import { Truck, Package, Clock, Shield, Calendar, MapPin, Home, Wrench } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import MovingCalculator from "./MovingCalculator";

const services = [
  {
    icon: Truck,
    title: "Transport sécurisé",
    description: "Véhicules adaptés et équipés pour tous types de biens",
  },
  {
    icon: Package,
    title: "Emballage professionnel",
    description: "Matériel de qualité pour protéger vos biens",
  },
  {
    icon: Clock,
    title: "Ponctualité",
    description: "Respect des délais et des horaires convenus",
  },
  {
    icon: Shield,
    title: "Assurance incluse",
    description: "Vos biens sont assurés pendant le transport",
  },
  {
    icon: Calendar,
    title: "Planification flexible",
    description: "Dates et horaires adaptés à vos besoins",
  },
  {
    icon: MapPin,
    title: "Couverture nationale",
    description: "Service disponible dans tout le Congo",
  },
  {
    icon: Home,
    title: "Stockage sécurisé",
    description: "Espaces de stockage climatisés et surveillés",
  },
  {
    icon: Wrench,
    title: "Montage/Démontage",
    description: "Service complet pour vos meubles",
  },
];

const MovingServices = () => {
  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-real-primary mb-8">
          Services de Déménagement Professionnels
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {services.map((service, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6 text-center">
                <div className="flex justify-center mb-4">
                  <service.icon className="w-12 h-12 text-real-primary" />
                </div>
                <CardTitle className="mb-2">{service.title}</CardTitle>
                <p className="text-gray-600">{service.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="max-w-3xl mx-auto">
          <MovingCalculator />
        </div>
      </div>
    </section>
  );
};

export default MovingServices;
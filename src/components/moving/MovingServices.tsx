import { Truck, Package, Clock, Shield, Calendar, MapPin, Home, Wrench } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import MovingCalculator from "./MovingCalculator";

const MovingServices = () => {
  const services = [
    {
      icon: <Truck className="w-12 h-12 text-real-primary" />,
      title: "Transport Professionnel",
      description: "Véhicules adaptés à tous types de déménagements"
    },
    {
      icon: <Package className="w-12 h-12 text-real-primary" />,
      title: "Emballage Sécurisé",
      description: "Matériaux de qualité pour protéger vos biens"
    },
    {
      icon: <Clock className="w-12 h-12 text-real-primary" />,
      title: "Service Ponctuel",
      description: "Respect des délais et des horaires convenus"
    },
    {
      icon: <Shield className="w-12 h-12 text-real-primary" />,
      title: "Assurance Complète",
      description: "Protection totale de vos biens pendant le transport"
    },
    {
      icon: <Calendar className="w-12 h-12 text-real-primary" />,
      title: "Planification Flexible",
      description: "Dates et horaires adaptés à vos besoins"
    },
    {
      icon: <MapPin className="w-12 h-12 text-real-primary" />,
      title: "Couverture Nationale",
      description: "Service disponible dans tout le Congo"
    },
    {
      icon: <Home className="w-12 h-12 text-real-primary" />,
      title: "Installation Complète",
      description: "Aide au placement et à l'installation des meubles"
    },
    {
      icon: <Wrench className="w-12 h-12 text-real-primary" />,
      title: "Montage/Démontage",
      description: "Service de montage et démontage de meubles"
    }
  ];

  return (
    <div className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Nos Services de Déménagement
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Des solutions complètes pour un déménagement sans stress, adaptées à vos besoins spécifiques
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {services.map((service, index) => (
            <Card key={index} className="border-none shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="text-center pb-4">
                <div className="mx-auto mb-4">
                  {service.icon}
                </div>
                <CardTitle className="text-xl font-bold text-gray-900">
                  {service.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center text-gray-600">
                <p>{service.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="bg-white rounded-lg shadow-xl p-6 mt-12">
          <MovingCalculator />
        </div>
      </div>
    </div>
  );
};

export default MovingServices;
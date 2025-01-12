import { Shield, Clock, UserCheck, HeartHandshake } from "lucide-react";

const services = [
  {
    id: 1,
    title: "Sécurité garantie",
    description:
      "Toutes les transactions sont sécurisées et les biens sont vérifiés",
    icon: Shield,
  },
  {
    id: 2,
    title: "Disponibilité 24/7",
    description: "Notre équipe est disponible pour vous accompagner à tout moment",
    icon: Clock,
  },
  {
    id: 3,
    title: "Agents qualifiés",
    description:
      "Des professionnels expérimentés pour vous guider dans vos démarches",
    icon: UserCheck,
  },
  {
    id: 4,
    title: "Service personnalisé",
    description:
      "Une approche sur mesure pour répondre à vos besoins spécifiques",
    icon: HeartHandshake,
  },
];

const Services = () => {
  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-real-primary mb-8">
          Nos Services
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service) => (
            <div
              key={service.id}
              className="p-6 bg-white rounded-lg shadow-md text-center hover:shadow-lg transition-shadow"
            >
              <div className="flex justify-center mb-4">
                <service.icon className="w-12 h-12 text-real-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
              <p className="text-gray-600">{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
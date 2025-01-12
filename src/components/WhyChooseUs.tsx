import { Shield, Award, Clock, Users } from "lucide-react";

const features = [
  {
    icon: Shield,
    title: "Sécurité Garantie",
    description: "Transactions sécurisées et vérification complète des biens"
  },
  {
    icon: Award,
    title: "Service Premium",
    description: "Une équipe d'experts dédiée à votre satisfaction"
  },
  {
    icon: Clock,
    title: "Rapidité",
    description: "Processus optimisé pour des transactions rapides"
  },
  {
    icon: Users,
    title: "Accompagnement",
    description: "Support personnalisé tout au long de votre projet"
  }
];

const WhyChooseUs = () => {
  return (
    <section className="py-16 bg-gradient-to-br from-gray-50 to-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-real-primary mb-12">
          Pourquoi Nous Choisir ?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="flex flex-col items-center text-center p-6 rounded-lg hover:shadow-lg transition-shadow duration-300"
            >
              <div className="w-16 h-16 bg-real-primary/10 rounded-full flex items-center justify-center mb-4">
                <feature.icon className="w-8 h-8 text-real-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
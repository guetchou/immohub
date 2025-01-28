import { Shield, Clock, UserCheck, HeartHandshake, Search, Key, Home, Wrench } from "lucide-react";
import { motion } from "framer-motion";

const services = [
  {
    id: 1,
    title: "Sécurité garantie",
    description: "Transactions sécurisées et vérifiées. Protection des données et confidentialité assurée. Garantie satisfait ou remboursé.",
    icon: Shield,
    color: "bg-blue-500"
  },
  {
    id: 2,
    title: "Disponibilité 24/7",
    description: "Support client disponible jour et nuit. Assistance d'urgence et intervention rapide. Chat en direct avec nos experts.",
    icon: Clock,
    color: "bg-green-500"
  },
  {
    id: 3,
    title: "Agents qualifiés",
    description: "Équipe d'experts certifiés. Formation continue et mise à jour régulière. Connaissance approfondie du marché local.",
    icon: UserCheck,
    color: "bg-purple-500"
  },
  {
    id: 4,
    title: "Service personnalisé",
    description: "Accompagnement sur mesure. Conseils adaptés à vos besoins. Suivi personnalisé de votre projet.",
    icon: HeartHandshake,
    color: "bg-red-500"
  },
  {
    id: 5,
    title: "Recherche avancée",
    description: "Filtres intelligents et précis. Alertes personnalisées. Suggestions basées sur vos critères.",
    icon: Search,
    color: "bg-yellow-500"
  },
  {
    id: 6,
    title: "Gestion locative",
    description: "Gestion complète de vos biens. Sélection rigoureuse des locataires. Suivi des paiements et maintenance.",
    icon: Key,
    color: "bg-indigo-500"
  },
  {
    id: 7,
    title: "Estimation précise",
    description: "Évaluation professionnelle de votre bien. Analyse du marché en temps réel. Optimisation du prix de vente.",
    icon: Home,
    color: "bg-orange-500"
  },
  {
    id: 8,
    title: "Maintenance",
    description: "Service de réparation 24/7. Réseau d'artisans qualifiés. Suivi des interventions en temps réel.",
    icon: Wrench,
    color: "bg-teal-500"
  }
];

const Services = () => {
  return (
    <section className="py-12 bg-gradient-to-br from-gray-50 to-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-real-primary mb-12">
          Nos Services
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="p-6 bg-white/80 backdrop-blur-sm rounded-lg shadow-md hover:shadow-xl transition-all duration-300 group"
            >
              <div className="flex justify-center mb-4">
                <div className={`w-16 h-16 ${service.color} bg-opacity-10 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                  <service.icon className={`w-8 h-8 text-${service.color.split('-')[1]}-500`} />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-center mb-3 group-hover:text-real-primary transition-colors">
                {service.title}
              </h3>
              <p className="text-gray-600 text-center">
                {service.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
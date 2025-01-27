import { Search, CalendarCheck, Key, Shield, Award, HeartHandshake } from "lucide-react";

const steps = [
  {
    id: 1,
    title: "Recherchez",
    description: "Utilisez nos filtres avancés pour trouver le bien idéal : localisation, budget, surface, critères spécifiques. Notre algorithme de matching vous propose les meilleures correspondances.",
    icon: Search,
    color: "text-blue-500"
  },
  {
    id: 2,
    title: "Visitez",
    description: "Planifiez des visites physiques ou virtuelles en 3D. Nos agents qualifiés vous accompagnent et répondent à toutes vos questions. Documentation complète fournie sur place.",
    icon: CalendarCheck,
    color: "text-green-500"
  },
  {
    id: 3,
    title: "Sécurisez",
    description: "Vérification complète des documents et des parties. Accompagnement juridique pour une transaction en toute sérénité. Protection des paiements via notre plateforme sécurisée.",
    icon: Shield,
    color: "text-purple-500"
  },
  {
    id: 4,
    title: "Finalisez",
    description: "Signature électronique des contrats, état des lieux digital, remise des clés. Notre équipe reste à vos côtés jusqu'à votre installation complète.",
    icon: Key,
    color: "text-orange-500"
  },
  {
    id: 5,
    title: "Profitez",
    description: "Service après-vente premium, assistance 24/7, garantie satisfaction. Accédez à nos services exclusifs : conciergerie, maintenance, décoration.",
    icon: Award,
    color: "text-red-500"
  },
  {
    id: 6,
    title: "Recommandez",
    description: "Parrainez vos proches et gagnez des avantages exclusifs. Rejoignez notre communauté de propriétaires et locataires satisfaits.",
    icon: HeartHandshake,
    color: "text-indigo-500"
  }
];

const HowItWorks = () => {
  return (
    <section className="py-12 bg-gradient-to-br from-gray-50 to-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-real-primary mb-12">
          Comment ça marche ?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {steps.map((step) => (
            <div 
              key={step.id}
              className="flex flex-col items-center text-center p-6 rounded-lg hover:shadow-lg transition-all duration-300 bg-white/80 backdrop-blur-sm border border-gray-100"
            >
              <div className={`w-16 h-16 ${step.color} bg-opacity-10 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                <step.icon className={`w-8 h-8 ${step.color}`} />
              </div>
              <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
              <p className="text-gray-600">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
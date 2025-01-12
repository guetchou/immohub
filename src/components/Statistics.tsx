import { Users, Home, Building2, Trophy } from "lucide-react";

const stats = [
  {
    id: 1,
    label: "Clients satisfaits",
    value: "2,000+",
    icon: Users,
  },
  {
    id: 2,
    label: "Propriétés disponibles",
    value: "500+",
    icon: Home,
  },
  {
    id: 3,
    label: "Agences partenaires",
    value: "50+",
    icon: Building2,
  },
  {
    id: 4,
    label: "Années d'expérience",
    value: "10+",
    icon: Trophy,
  },
];

const Statistics = () => {
  return (
    <section className="py-12 bg-real-primary text-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat) => (
            <div key={stat.id} className="text-center">
              <div className="flex justify-center mb-4">
                <stat.icon className="w-8 h-8" />
              </div>
              <div className="text-3xl font-bold mb-2">{stat.value}</div>
              <div className="text-sm opacity-80">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Statistics;
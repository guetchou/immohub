import { motion } from "framer-motion";
import { TrendingUp, Home, Users, Activity } from "lucide-react";

const stats = [
  {
    id: 1,
    title: "Prix moyen au m²",
    value: "450,000 FCFA",
    change: "+5.2%",
    icon: TrendingUp,
    color: "text-green-500"
  },
  {
    id: 2,
    title: "Transactions en 2024",
    value: "1,250",
    change: "+12.3%",
    icon: Home,
    color: "text-blue-500"
  },
  {
    id: 3,
    title: "Nouveaux clients",
    value: "3,500",
    change: "+8.7%",
    icon: Users,
    color: "text-purple-500"
  },
  {
    id: 4,
    title: "Taux de satisfaction",
    value: "98%",
    change: "+2.1%",
    icon: Activity,
    color: "text-red-500"
  }
];

const MarketStats = () => {
  return (
    <section className="py-12 bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">
          Statistiques du Marché
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat) => (
            <motion.div
              key={stat.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="bg-white/10 backdrop-blur-sm rounded-lg p-6 hover:bg-white/20 transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-full ${stat.color} bg-opacity-20`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <span className={`text-sm font-semibold ${
                  stat.change.startsWith('+') ? 'text-green-400' : 'text-red-400'
                }`}>
                  {stat.change}
                </span>
              </div>
              <h3 className="text-lg font-semibold mb-1">{stat.title}</h3>
              <p className="text-2xl font-bold">{stat.value}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MarketStats;
import { Users, Home, Building2, Trophy } from "lucide-react";
import { useInView } from "react-intersection-observer";
import { useState, useEffect } from "react";

const stats = [
  {
    id: 1,
    label: "Clients satisfaits",
    value: 2000,
    suffix: "+",
    icon: Users,
    color: "from-blue-400 to-blue-600",
  },
  {
    id: 2,
    label: "Propriétés disponibles",
    value: 500,
    suffix: "+",
    icon: Home,
    color: "from-green-400 to-green-600",
  },
  {
    id: 3,
    label: "Agences partenaires",
    value: 50,
    suffix: "+",
    icon: Building2,
    color: "from-purple-400 to-purple-600",
  },
  {
    id: 4,
    label: "Années d'expérience",
    value: 10,
    suffix: "+",
    icon: Trophy,
    color: "from-yellow-400 to-yellow-600",
  },
];

const AnimatedValue = ({ value, suffix }: { value: number; suffix: string }) => {
  const [count, setCount] = useState(0);
  const { ref, inView } = useInView({
    threshold: 0.3,
    triggerOnce: true,
  });

  useEffect(() => {
    if (inView) {
      const duration = 2000;
      const steps = 50;
      const stepValue = value / steps;
      let current = 0;

      const timer = setInterval(() => {
        current += stepValue;
        if (current >= value) {
          setCount(value);
          clearInterval(timer);
        } else {
          setCount(Math.floor(current));
        }
      }, duration / steps);

      return () => clearInterval(timer);
    }
  }, [inView, value]);

  return (
    <div ref={ref} className="text-4xl font-bold mb-2 transition-all duration-500">
      {count}
      {suffix}
    </div>
  );
};

const Statistics = () => {
  return (
    <section className="py-12 text-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat) => (
            <div
              key={stat.id}
              className="relative group"
            >
              <div className="text-center p-6 rounded-lg bg-white/10 backdrop-blur-sm 
                            transform hover:scale-105 transition-all duration-300
                            hover:shadow-xl">
                <div className="flex justify-center mb-4">
                  <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${stat.color} 
                                p-4 flex items-center justify-center group-hover:rotate-12 
                                transition-transform duration-300`}>
                    <stat.icon className="w-8 h-8 text-white" />
                  </div>
                </div>
                <AnimatedValue value={stat.value} suffix={stat.suffix} />
                <div className="text-lg font-medium opacity-90">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Statistics;
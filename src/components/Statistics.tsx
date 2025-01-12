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
  },
  {
    id: 2,
    label: "Propriétés disponibles",
    value: 500,
    suffix: "+",
    icon: Home,
  },
  {
    id: 3,
    label: "Agences partenaires",
    value: 50,
    suffix: "+",
    icon: Building2,
  },
  {
    id: 4,
    label: "Années d'expérience",
    value: 10,
    suffix: "+",
    icon: Trophy,
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
    <div ref={ref} className="text-3xl font-bold mb-2">
      {count}
      {suffix}
    </div>
  );
};

const Statistics = () => {
  return (
    <section className="py-12 text-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat) => (
            <div
              key={stat.id}
              className="text-center transform hover:scale-105 transition-transform duration-300"
            >
              <div className="flex justify-center mb-4">
                <stat.icon className="w-8 h-8" />
              </div>
              <AnimatedValue value={stat.value} suffix={stat.suffix} />
              <div className="text-sm opacity-80">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Statistics;
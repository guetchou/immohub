import { useInView } from "react-intersection-observer";
import { useState, useEffect } from "react";
import { Home, Users, Building2, Trophy } from "lucide-react";

interface StatItemProps {
  icon: React.ReactNode;
  value: number;
  label: string;
  delay: number;
}

const StatItem = ({ icon, value, label, delay }: StatItemProps) => {
  const [count, setCount] = useState(0);
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (inView) {
      timeout = setTimeout(() => {
        const duration = 2000;
        const steps = 20;
        const increment = value / steps;
        let current = 0;
        
        const timer = setInterval(() => {
          current += increment;
          if (current >= value) {
            setCount(value);
            clearInterval(timer);
          } else {
            setCount(Math.floor(current));
          }
        }, duration / steps);

        return () => clearInterval(timer);
      }, delay);
    }
    return () => clearTimeout(timeout);
  }, [inView, value, delay]);

  return (
    <div
      ref={ref}
      className="text-center p-6 bg-white/10 rounded-lg backdrop-blur-sm 
                 transform transition-all duration-500 hover:scale-105"
    >
      <div className="flex justify-center mb-4">
        {icon}
      </div>
      <div className="text-4xl font-bold mb-2">{count.toLocaleString()}</div>
      <div className="text-sm opacity-80">{label}</div>
    </div>
  );
};

const AnimatedStats = () => {
  const stats = [
    {
      icon: <Home className="w-8 h-8" />,
      value: 1500,
      label: "Propriétés disponibles",
      delay: 0,
    },
    {
      icon: <Users className="w-8 h-8" />,
      value: 5000,
      label: "Clients satisfaits",
      delay: 200,
    },
    {
      icon: <Building2 className="w-8 h-8" />,
      value: 100,
      label: "Agences partenaires",
      delay: 400,
    },
    {
      icon: <Trophy className="w-8 h-8" />,
      value: 10,
      label: "Années d'expérience",
      delay: 600,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto px-4">
      {stats.map((stat, index) => (
        <StatItem key={index} {...stat} />
      ))}
    </div>
  );
};

export default AnimatedStats;
import { Search, CalendarCheck, Key } from "lucide-react";

const steps = [
  {
    id: 1,
    title: "Recherchez",
    description: "Trouvez le bien qui correspond à vos critères",
    icon: Search,
  },
  {
    id: 2,
    title: "Visitez",
    description: "Planifiez une visite virtuelle ou physique",
    icon: CalendarCheck,
  },
  {
    id: 3,
    title: "Emménagez",
    description: "Finalisez la location et récupérez les clés",
    icon: Key,
  },
];

const HowItWorks = () => {
  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-real-primary mb-8">
          Comment ça marche ?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step) => (
            <div
              key={step.id}
              className="flex flex-col items-center text-center"
            >
              <div className="w-16 h-16 bg-real-primary rounded-full flex items-center justify-center mb-4">
                <step.icon className="w-8 h-8 text-white" />
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
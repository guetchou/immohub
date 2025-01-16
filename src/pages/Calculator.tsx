import { NavBar } from "@/components/navigation/NavBar";
import MortgageCalculator from "@/components/calculators/MortgageCalculator";

const Calculator = () => {
  return (
    <div className="min-h-screen bg-background">
      <NavBar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8">
          Calculateur de Prêt Immobilier
        </h1>
        <MortgageCalculator />
      </div>
    </div>
  );
};

export default Calculator;
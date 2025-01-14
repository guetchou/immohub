import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Calculator } from "lucide-react";

const MortgageCalculator = () => {
  const [loanAmount, setLoanAmount] = useState("");
  const [interestRate, setInterestRate] = useState("");
  const [loanTerm, setLoanTerm] = useState("");
  const [monthlyPayment, setMonthlyPayment] = useState<number | null>(null);

  const calculateMortgage = () => {
    const principal = parseFloat(loanAmount);
    const rate = parseFloat(interestRate) / 100 / 12;
    const months = parseFloat(loanTerm) * 12;

    if (principal && rate && months) {
      const payment =
        (principal * rate * Math.pow(1 + rate, months)) /
        (Math.pow(1 + rate, months) - 1);
      setMonthlyPayment(payment);
    }
  };

  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Calculator className="h-6 w-6 text-real-primary" />
          <CardTitle>Calculateur de Prêt Immobilier</CardTitle>
        </div>
        <CardDescription>
          Estimez vos mensualités de remboursement
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Montant du prêt (FCFA)</label>
          <Input
            type="number"
            value={loanAmount}
            onChange={(e) => setLoanAmount(e.target.value)}
            placeholder="Ex: 50000000"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Taux d'intérêt annuel (%)</label>
          <Input
            type="number"
            value={interestRate}
            onChange={(e) => setInterestRate(e.target.value)}
            placeholder="Ex: 5.5"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Durée du prêt (années)</label>
          <Input
            type="number"
            value={loanTerm}
            onChange={(e) => setLoanTerm(e.target.value)}
            placeholder="Ex: 20"
          />
        </div>

        <Button onClick={calculateMortgage} className="w-full">
          Calculer
        </Button>

        {monthlyPayment && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <p className="text-center">
              <span className="block text-sm text-gray-600">Mensualité estimée:</span>
              <span className="text-2xl font-bold text-real-primary">
                {Math.round(monthlyPayment).toLocaleString()} FCFA
              </span>
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MortgageCalculator;
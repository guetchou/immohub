import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const MortgageSimulator = () => {
  const [propertyPrice, setPropertyPrice] = useState<string>("");
  const [downPayment, setDownPayment] = useState<string>("");
  const [loanTerm, setLoanTerm] = useState<string>("20");
  const [interestRate, setInterestRate] = useState<string>("");
  const [monthlyPayment, setMonthlyPayment] = useState<number | null>(null);
  const { toast } = useToast();

  const calculateMortgage = () => {
    const price = parseFloat(propertyPrice);
    const down = parseFloat(downPayment);
    const term = parseFloat(loanTerm);
    const rate = parseFloat(interestRate) / 100 / 12; // Monthly interest rate

    if (isNaN(price) || isNaN(down) || isNaN(term) || isNaN(rate)) {
      toast({
        title: "Erreur de calcul",
        description: "Veuillez remplir tous les champs avec des valeurs valides",
        variant: "destructive",
      });
      return;
    }

    const loanAmount = price - down;
    const numberOfPayments = term * 12;

    // Monthly mortgage payment formula: M = P[r(1 + r)^n]/[(1 + r)^n - 1]
    const monthlyPayment =
      (loanAmount * rate * Math.pow(1 + rate, numberOfPayments)) /
      (Math.pow(1 + rate, numberOfPayments) - 1);

    setMonthlyPayment(monthlyPayment);
  };

  return (
    <Card className="p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-real-primary mb-6">
        Simulateur de Prêt Immobilier
      </h2>
      
      <div className="space-y-4">
        <div>
          <Label htmlFor="propertyPrice">Prix du bien (FCFA)</Label>
          <Input
            id="propertyPrice"
            type="number"
            value={propertyPrice}
            onChange={(e) => setPropertyPrice(e.target.value)}
            placeholder="Ex: 50000000"
          />
        </div>

        <div>
          <Label htmlFor="downPayment">Apport initial (FCFA)</Label>
          <Input
            id="downPayment"
            type="number"
            value={downPayment}
            onChange={(e) => setDownPayment(e.target.value)}
            placeholder="Ex: 10000000"
          />
        </div>

        <div>
          <Label htmlFor="loanTerm">Durée du prêt (années)</Label>
          <Select value={loanTerm} onValueChange={setLoanTerm}>
            <SelectTrigger>
              <SelectValue placeholder="Sélectionnez la durée" />
            </SelectTrigger>
            <SelectContent>
              {[5, 10, 15, 20, 25, 30].map((years) => (
                <SelectItem key={years} value={years.toString()}>
                  {years} ans
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="interestRate">Taux d'intérêt annuel (%)</Label>
          <Input
            id="interestRate"
            type="number"
            step="0.1"
            value={interestRate}
            onChange={(e) => setInterestRate(e.target.value)}
            placeholder="Ex: 4.5"
          />
        </div>

        <Button 
          onClick={calculateMortgage}
          className="w-full"
        >
          Calculer
        </Button>

        {monthlyPayment && (
          <div className="mt-6 p-4 bg-real-primary/10 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Mensualité estimée:</h3>
            <p className="text-2xl font-bold text-real-primary">
              {new Intl.NumberFormat('fr-FR', {
                style: 'currency',
                currency: 'XAF',
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              }).format(monthlyPayment)}
            </p>
            <p className="text-sm text-gray-500 mt-2">
              *Cette estimation ne prend pas en compte les frais annexes (assurance, frais de dossier, etc.)
            </p>
          </div>
        )}
      </div>
    </Card>
  );
};

export default MortgageSimulator;
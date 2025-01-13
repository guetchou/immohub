import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { NavBar } from "@/components/navigation/NavBar";
import { Calculator, Info } from "lucide-react";

interface MortgageDetails {
  propertyPrice: number;
  downPayment: number;
  loanTerm: number;
  interestRate: number;
}

interface MortgageResults {
  monthlyPayment: number;
  totalInterest: number;
  totalAmount: number;
  additionalFees: {
    notaryFees: number;
    insuranceFees: number;
    registrationFees: number;
  };
}

export default function MortgageCalculator() {
  const [details, setDetails] = useState<MortgageDetails>({
    propertyPrice: 0,
    downPayment: 0,
    loanTerm: 20,
    interestRate: 4.5,
  });

  const [results, setResults] = useState<MortgageResults | null>(null);
  const { toast } = useToast();

  const calculateMortgage = () => {
    const loanAmount = details.propertyPrice - details.downPayment;
    const monthlyRate = details.interestRate / 100 / 12;
    const numberOfPayments = details.loanTerm * 12;

    // Calcul mensualité avec la formule: P = L[c(1 + c)^n]/[(1 + c)^n - 1]
    const monthlyPayment =
      (loanAmount *
        (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments))) /
      (Math.pow(1 + monthlyRate, numberOfPayments) - 1);

    // Calcul du coût total des intérêts
    const totalAmount = monthlyPayment * numberOfPayments;
    const totalInterest = totalAmount - loanAmount;

    // Estimation des frais annexes
    const notaryFees = details.propertyPrice * 0.07; // 7% du prix
    const insuranceFees = loanAmount * 0.0025; // 0.25% du montant emprunté
    const registrationFees = details.propertyPrice * 0.02; // 2% du prix

    setResults({
      monthlyPayment,
      totalInterest,
      totalAmount,
      additionalFees: {
        notaryFees,
        insuranceFees,
        registrationFees,
      },
    });

    toast({
      title: "Calcul effectué",
      description: "Le montant de vos mensualités a été calculé.",
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "XAF",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-background">
      <NavBar />
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-6">
          <Calculator className="h-8 w-8 text-real-primary" />
          <h1 className="text-2xl font-bold">Calculateur de Prêt Immobilier</h1>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div>
              <Label htmlFor="propertyPrice">Prix du bien</Label>
              <Input
                id="propertyPrice"
                type="number"
                value={details.propertyPrice}
                onChange={(e) =>
                  setDetails((prev) => ({
                    ...prev,
                    propertyPrice: Number(e.target.value),
                  }))
                }
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="downPayment">Apport initial</Label>
              <Input
                id="downPayment"
                type="number"
                value={details.downPayment}
                onChange={(e) =>
                  setDetails((prev) => ({
                    ...prev,
                    downPayment: Number(e.target.value),
                  }))
                }
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="loanTerm">Durée du prêt (années)</Label>
              <Input
                id="loanTerm"
                type="number"
                value={details.loanTerm}
                onChange={(e) =>
                  setDetails((prev) => ({
                    ...prev,
                    loanTerm: Number(e.target.value),
                  }))
                }
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="interestRate">Taux d'intérêt annuel (%)</Label>
              <Input
                id="interestRate"
                type="number"
                step="0.1"
                value={details.interestRate}
                onChange={(e) =>
                  setDetails((prev) => ({
                    ...prev,
                    interestRate: Number(e.target.value),
                  }))
                }
                className="mt-1"
              />
            </div>

            <Button onClick={calculateMortgage} className="w-full">
              Calculer
            </Button>
          </div>

          {results && (
            <div className="space-y-6 bg-card p-6 rounded-lg shadow-lg">
              <div>
                <h2 className="text-xl font-semibold mb-4">Résultats</h2>
                <div className="space-y-4">
                  <div>
                    <Label>Mensualité</Label>
                    <p className="text-2xl font-bold text-real-primary">
                      {formatCurrency(results.monthlyPayment)}
                    </p>
                  </div>
                  <div>
                    <Label>Coût total des intérêts</Label>
                    <p className="text-lg">
                      {formatCurrency(results.totalInterest)}
                    </p>
                  </div>
                  <div>
                    <Label>Coût total du crédit</Label>
                    <p className="text-lg">
                      {formatCurrency(results.totalAmount)}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <Info className="h-5 w-5" />
                  Frais annexes estimés
                </h3>
                <div className="space-y-2">
                  <div>
                    <Label>Frais de notaire</Label>
                    <p>{formatCurrency(results.additionalFees.notaryFees)}</p>
                  </div>
                  <div>
                    <Label>Assurance emprunteur (annuel)</Label>
                    <p>{formatCurrency(results.additionalFees.insuranceFees)}</p>
                  </div>
                  <div>
                    <Label>Frais d'enregistrement</Label>
                    <p>
                      {formatCurrency(results.additionalFees.registrationFees)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
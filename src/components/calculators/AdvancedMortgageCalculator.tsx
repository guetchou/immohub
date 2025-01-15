import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";

interface CalculationResult {
  monthlyPayment: number;
  totalInterest: number;
  totalAmount: number;
  riskLevel: string;
  debtToIncomeRatio: number;
  feasibility: string;
}

const AdvancedMortgageCalculator = () => {
  const [formData, setFormData] = useState({
    currentAge: "",
    retirementAge: "",
    monthlyIncome: "",
    monthlyExpenses: "",
    existingLoans: "",
    creditScore: "",
    propertyValue: "",
    downPayment: "",
    loanTerm: "25",
    interestRate: "",
  });

  const [result, setResult] = useState<CalculationResult | null>(null);
  const { toast } = useToast();

  const calculateMortgage = () => {
    const {
      monthlyIncome,
      monthlyExpenses,
      existingLoans,
      creditScore,
      propertyValue,
      downPayment,
      loanTerm,
      interestRate,
      currentAge,
      retirementAge,
    } = formData;

    try {
      // Convert string inputs to numbers
      const principal = Number(propertyValue) - Number(downPayment);
      const monthlyRate = Number(interestRate) / 100 / 12;
      const numberOfPayments = Number(loanTerm) * 12;
      
      // Calculate monthly mortgage payment
      const monthlyPayment =
        (principal * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) /
        (Math.pow(1 + monthlyRate, numberOfPayments) - 1);

      // Calculate total interest
      const totalAmount = monthlyPayment * numberOfPayments;
      const totalInterest = totalAmount - principal;

      // Calculate debt-to-income ratio
      const monthlyDebt = monthlyPayment + Number(existingLoans);
      const debtToIncomeRatio = (monthlyDebt / Number(monthlyIncome)) * 100;

      // Determine risk level based on various factors
      let riskLevel = "Faible";
      let feasibility = "Favorable";

      if (debtToIncomeRatio > 40) {
        riskLevel = "Élevé";
        feasibility = "Défavorable";
      } else if (debtToIncomeRatio > 30) {
        riskLevel = "Moyen";
        feasibility = "À considérer avec précaution";
      }

      // Check age-related risks
      const yearsUntilRetirement = Number(retirementAge) - Number(currentAge);
      if (yearsUntilRetirement < Number(loanTerm)) {
        riskLevel = "Élevé";
        feasibility = "À reconsidérer";
      }

      // Check credit score
      if (Number(creditScore) < 600) {
        riskLevel = "Élevé";
        feasibility = "Défavorable";
      }

      setResult({
        monthlyPayment,
        totalInterest,
        totalAmount,
        riskLevel,
        debtToIncomeRatio,
        feasibility,
      });

      toast({
        title: "Calcul effectué",
        description: "Les résultats ont été mis à jour",
      });
    } catch (error) {
      console.error("Calculation error:", error);
      toast({
        title: "Erreur de calcul",
        description: "Veuillez vérifier les valeurs entrées",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-4xl mx-auto p-6">
        <h2 className="text-2xl font-bold mb-6 text-center bg-gradient-to-r from-real-primary to-real-accent bg-clip-text text-transparent">
          Calculateur Hypothécaire Avancé
        </h2>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <Label>Âge actuel</Label>
              <Input
                type="number"
                value={formData.currentAge}
                onChange={(e) => setFormData({ ...formData, currentAge: e.target.value })}
                placeholder="Ex: 35"
              />
            </div>

            <div>
              <Label>Âge de départ à la retraite</Label>
              <Input
                type="number"
                value={formData.retirementAge}
                onChange={(e) => setFormData({ ...formData, retirementAge: e.target.value })}
                placeholder="Ex: 65"
              />
            </div>

            <div>
              <Label>Revenus mensuels (XAF)</Label>
              <Input
                type="number"
                value={formData.monthlyIncome}
                onChange={(e) => setFormData({ ...formData, monthlyIncome: e.target.value })}
                placeholder="Ex: 1500000"
              />
            </div>

            <div>
              <Label>Charges mensuelles (XAF)</Label>
              <Input
                type="number"
                value={formData.monthlyExpenses}
                onChange={(e) => setFormData({ ...formData, monthlyExpenses: e.target.value })}
                placeholder="Ex: 500000"
              />
            </div>

            <div>
              <Label>Prêts en cours (mensualités en XAF)</Label>
              <Input
                type="number"
                value={formData.existingLoans}
                onChange={(e) => setFormData({ ...formData, existingLoans: e.target.value })}
                placeholder="Ex: 200000"
              />
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <Label>Score de crédit</Label>
              <Input
                type="number"
                value={formData.creditScore}
                onChange={(e) => setFormData({ ...formData, creditScore: e.target.value })}
                placeholder="Ex: 700"
              />
            </div>

            <div>
              <Label>Valeur du bien (XAF)</Label>
              <Input
                type="number"
                value={formData.propertyValue}
                onChange={(e) => setFormData({ ...formData, propertyValue: e.target.value })}
                placeholder="Ex: 50000000"
              />
            </div>

            <div>
              <Label>Apport personnel (XAF)</Label>
              <Input
                type="number"
                value={formData.downPayment}
                onChange={(e) => setFormData({ ...formData, downPayment: e.target.value })}
                placeholder="Ex: 10000000"
              />
            </div>

            <div>
              <Label>Durée du prêt (années)</Label>
              <Select
                value={formData.loanTerm}
                onValueChange={(value) => setFormData({ ...formData, loanTerm: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez la durée" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10 ans</SelectItem>
                  <SelectItem value="15">15 ans</SelectItem>
                  <SelectItem value="20">20 ans</SelectItem>
                  <SelectItem value="25">25 ans</SelectItem>
                  <SelectItem value="30">30 ans</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Taux d'intérêt annuel (%)</Label>
              <Input
                type="number"
                value={formData.interestRate}
                onChange={(e) => setFormData({ ...formData, interestRate: e.target.value })}
                placeholder="Ex: 3.5"
                step="0.1"
              />
            </div>
          </div>
        </div>

        <Button
          onClick={calculateMortgage}
          className="w-full mt-6 bg-real-primary hover:bg-real-primary/90"
        >
          Calculer
        </Button>

        {result && (
          <div className="mt-8 space-y-4">
            <h3 className="text-xl font-semibold">Résultats</h3>
            
            <div className="grid md:grid-cols-2 gap-4">
              <Card className="p-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">Mensualité estimée</p>
                <p className="text-xl font-bold text-real-primary">
                  {result.monthlyPayment.toLocaleString()} XAF
                </p>
              </Card>
              
              <Card className="p-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">Coût total des intérêts</p>
                <p className="text-xl font-bold text-real-primary">
                  {result.totalInterest.toLocaleString()} XAF
                </p>
              </Card>
              
              <Card className="p-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">Ratio dette/revenus</p>
                <p className="text-xl font-bold text-real-primary">
                  {result.debtToIncomeRatio.toFixed(1)}%
                </p>
              </Card>
              
              <Card className="p-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">Niveau de risque</p>
                <p className={`text-xl font-bold ${
                  result.riskLevel === "Faible" 
                    ? "text-green-500" 
                    : result.riskLevel === "Moyen"
                    ? "text-yellow-500"
                    : "text-red-500"
                }`}>
                  {result.riskLevel}
                </p>
              </Card>
            </div>

            <Card className="p-4 mt-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">Faisabilité du projet</p>
              <p className="text-lg font-semibold mt-1">{result.feasibility}</p>
            </Card>
          </div>
        )}
      </Card>
    </div>
  );
};

export default AdvancedMortgageCalculator;
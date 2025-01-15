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
import { Calculator, Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const MortgageCalculator = () => {
  const [formData, setFormData] = useState({
    propertyPrice: "",
    currentAge: "",
    retirementAge: "",
    monthlyIncome: "",
    monthlyExpenses: "",
    existingLoans: "",
    creditScore: "",
    downPayment: "",
    loanTerm: "20",
    interestRate: "",
  });
  const [monthlyPayment, setMonthlyPayment] = useState<number | null>(null);
  const [riskAssessment, setRiskAssessment] = useState<string | null>(null);
  const { toast } = useToast();

  const calculateMortgage = () => {
    // Validation
    if (Object.values(formData).some(value => !value)) {
      toast({
        title: "Erreur de validation",
        description: "Veuillez remplir tous les champs",
        variant: "destructive",
      });
      return;
    }

    const {
      propertyPrice,
      downPayment,
      loanTerm,
      interestRate,
      monthlyIncome,
      monthlyExpenses,
      existingLoans,
      creditScore,
      currentAge,
      retirementAge,
    } = formData;

    // Calculate base monthly payment
    const principal = parseFloat(propertyPrice) - parseFloat(downPayment);
    const rate = parseFloat(interestRate) / 100 / 12;
    const months = parseFloat(loanTerm) * 12;
    
    const monthlyPayment = (principal * rate * Math.pow(1 + rate, months)) / (Math.pow(1 + rate, months) - 1);

    // Calculate debt-to-income ratio
    const monthlyDebt = parseFloat(existingLoans) + monthlyPayment;
    const dti = (monthlyDebt / parseFloat(monthlyIncome)) * 100;

    // Risk Assessment
    let risk = "Faible";
    if (dti > 40) risk = "Élevé";
    else if (dti > 30) risk = "Moyen";

    if (parseFloat(creditScore) < 650) risk = "Élevé";
    if ((parseFloat(retirementAge) - parseFloat(currentAge)) < parseFloat(loanTerm)) {
      risk = "Élevé";
    }

    setMonthlyPayment(monthlyPayment);
    setRiskAssessment(risk);

    toast({
      title: "Calcul effectué",
      description: `Mensualité estimée: ${Math.round(monthlyPayment).toLocaleString()} FCFA`,
    });
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Card className="p-6 max-w-2xl mx-auto">
      <div className="flex items-center gap-2 mb-6">
        <Calculator className="h-6 w-6 text-real-primary" />
        <h2 className="text-2xl font-bold text-real-primary">
          Simulateur de Prêt Immobilier Avancé
        </h2>
      </div>
      
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Prix du bien (FCFA)</Label>
            <Input
              type="number"
              value={formData.propertyPrice}
              onChange={(e) => handleInputChange("propertyPrice", e.target.value)}
              placeholder="Ex: 50000000"
            />
          </div>

          <div className="space-y-2">
            <Label>Apport initial (FCFA)</Label>
            <Input
              type="number"
              value={formData.downPayment}
              onChange={(e) => handleInputChange("downPayment", e.target.value)}
              placeholder="Ex: 10000000"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Âge actuel</Label>
            <Input
              type="number"
              value={formData.currentAge}
              onChange={(e) => handleInputChange("currentAge", e.target.value)}
              placeholder="Ex: 35"
            />
          </div>

          <div className="space-y-2">
            <Label>Âge de départ à la retraite</Label>
            <Input
              type="number"
              value={formData.retirementAge}
              onChange={(e) => handleInputChange("retirementAge", e.target.value)}
              placeholder="Ex: 65"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Revenus mensuels (FCFA)</Label>
            <Input
              type="number"
              value={formData.monthlyIncome}
              onChange={(e) => handleInputChange("monthlyIncome", e.target.value)}
              placeholder="Ex: 1000000"
            />
          </div>

          <div className="space-y-2">
            <Label>Charges mensuelles (FCFA)</Label>
            <Input
              type="number"
              value={formData.monthlyExpenses}
              onChange={(e) => handleInputChange("monthlyExpenses", e.target.value)}
              placeholder="Ex: 300000"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Prêts en cours (mensualités FCFA)</Label>
            <Input
              type="number"
              value={formData.existingLoans}
              onChange={(e) => handleInputChange("existingLoans", e.target.value)}
              placeholder="Ex: 200000"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Label>Score de crédit</Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="h-4 w-4 text-gray-400" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Score entre 300 et 850</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <Input
              type="number"
              value={formData.creditScore}
              onChange={(e) => handleInputChange("creditScore", e.target.value)}
              placeholder="Ex: 700"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Durée du prêt (années)</Label>
            <Select 
              value={formData.loanTerm}
              onValueChange={(value) => handleInputChange("loanTerm", value)}
            >
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

          <div className="space-y-2">
            <Label>Taux d'intérêt annuel (%)</Label>
            <Input
              type="number"
              step="0.1"
              value={formData.interestRate}
              onChange={(e) => handleInputChange("interestRate", e.target.value)}
              placeholder="Ex: 4.5"
            />
          </div>
        </div>

        <Button 
          onClick={calculateMortgage}
          className="w-full"
        >
          Calculer
        </Button>

        {monthlyPayment && (
          <div className="mt-6 space-y-4">
            <div className="p-4 bg-real-primary/10 rounded-lg">
              <h3 className="text-lg font-semibold mb-2">Mensualité estimée:</h3>
              <p className="text-2xl font-bold text-real-primary">
                {Math.round(monthlyPayment).toLocaleString()} FCFA
              </p>
            </div>
            
            {riskAssessment && (
              <div className={`p-4 rounded-lg ${
                riskAssessment === "Faible" ? "bg-green-100" :
                riskAssessment === "Moyen" ? "bg-yellow-100" :
                "bg-red-100"
              }`}>
                <h3 className="text-lg font-semibold mb-2">Niveau de risque:</h3>
                <p className="text-xl font-semibold">
                  {riskAssessment}
                </p>
              </div>
            )}
            
            <p className="text-sm text-gray-500">
              *Cette estimation ne prend pas en compte les frais annexes (assurance, frais de dossier, etc.)
            </p>
          </div>
        )}
      </div>
    </Card>
  );
};

export default MortgageCalculator;
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/components/ui/use-toast";
import { NavBar } from "@/components/navigation/NavBar";
import { Shield, Check } from "lucide-react";

type PropertyType = "house" | "apartment" | "commercial";
type CoverageLevel = "basic" | "standard" | "premium";

interface InsuranceDetails {
  type: PropertyType;
  value: number;
  surface: number;
  coverage: CoverageLevel;
}

interface InsuranceQuote {
  company: string;
  monthlyPrice: number;
  yearlyPrice: number;
  features: string[];
}

export default function InsuranceSimulator() {
  const [details, setDetails] = useState<InsuranceDetails>({
    type: "house",
    value: 0,
    surface: 0,
    coverage: "standard",
  });

  const [quotes, setQuotes] = useState<InsuranceQuote[]>([]);
  const { toast } = useToast();

  const calculateQuotes = () => {
    // Validation
    if (details.value <= 0 || details.surface <= 0) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs correctement",
        variant: "destructive",
      });
      return;
    }

    // Simulate different insurance companies quotes
    const baseRate = details.value * 0.001;
    const surfaceRate = details.surface * 0.5;

    const coverageMultiplier = {
      basic: 0.8,
      standard: 1,
      premium: 1.3,
    }[details.coverage];

    const typeMultiplier = {
      house: 1,
      apartment: 0.9,
      commercial: 1.2,
    }[details.type];

    // Generate quotes from different companies
    const simulatedQuotes: InsuranceQuote[] = [
      {
        company: "AssurCongo",
        monthlyPrice: (baseRate + surfaceRate) * coverageMultiplier * typeMultiplier,
        yearlyPrice: (baseRate + surfaceRate) * coverageMultiplier * typeMultiplier * 12 * 0.95,
        features: [
          "Couverture dégâts des eaux",
          "Responsabilité civile",
          "Assistance 24/7",
        ],
      },
      {
        company: "ImmoPro Assurance",
        monthlyPrice: (baseRate + surfaceRate) * coverageMultiplier * typeMultiplier * 1.1,
        yearlyPrice: (baseRate + surfaceRate) * coverageMultiplier * typeMultiplier * 12,
        features: [
          "Protection juridique",
          "Garantie vol",
          "Service d'urgence",
        ],
      },
      {
        company: "SecurImmo",
        monthlyPrice: (baseRate + surfaceRate) * coverageMultiplier * typeMultiplier * 0.95,
        yearlyPrice: (baseRate + surfaceRate) * coverageMultiplier * typeMultiplier * 11,
        features: [
          "Garantie catastrophes naturelles",
          "Protection incendie",
          "Assistance technique",
        ],
      },
    ];

    setQuotes(simulatedQuotes);
    
    toast({
      title: "Devis calculés",
      description: "Consultez les différentes offres ci-dessous",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <NavBar />
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-6">
          <Shield className="h-8 w-8" />
          <h1 className="text-2xl font-bold">Simulateur d'assurance</h1>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div>
              <Label>Type de bien</Label>
              <RadioGroup
                value={details.type}
                onValueChange={(value: PropertyType) => 
                  setDetails(prev => ({ ...prev, type: value }))}
                className="grid grid-cols-3 gap-4 mt-2"
              >
                <div>
                  <RadioGroupItem value="house" id="house" />
                  <Label htmlFor="house">Maison</Label>
                </div>
                <div>
                  <RadioGroupItem value="apartment" id="apartment" />
                  <Label htmlFor="apartment">Appartement</Label>
                </div>
                <div>
                  <RadioGroupItem value="commercial" id="commercial" />
                  <Label htmlFor="commercial">Commercial</Label>
                </div>
              </RadioGroup>
            </div>

            <div>
              <Label htmlFor="value">Valeur du bien (CFA)</Label>
              <Input
                id="value"
                type="number"
                value={details.value}
                onChange={(e) => 
                  setDetails(prev => ({ ...prev, value: Number(e.target.value) }))}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="surface">Surface (m²)</Label>
              <Input
                id="surface"
                type="number"
                value={details.surface}
                onChange={(e) => 
                  setDetails(prev => ({ ...prev, surface: Number(e.target.value) }))}
                className="mt-1"
              />
            </div>

            <div>
              <Label>Niveau de couverture</Label>
              <RadioGroup
                value={details.coverage}
                onValueChange={(value: CoverageLevel) => 
                  setDetails(prev => ({ ...prev, coverage: value }))}
                className="grid grid-cols-3 gap-4 mt-2"
              >
                <div>
                  <RadioGroupItem value="basic" id="basic" />
                  <Label htmlFor="basic">Basique</Label>
                </div>
                <div>
                  <RadioGroupItem value="standard" id="standard" />
                  <Label htmlFor="standard">Standard</Label>
                </div>
                <div>
                  <RadioGroupItem value="premium" id="premium" />
                  <Label htmlFor="premium">Premium</Label>
                </div>
              </RadioGroup>
            </div>

            <Button onClick={calculateQuotes} className="w-full">
              Calculer les devis
            </Button>
          </div>

          <div className="space-y-6">
            {quotes.map((quote, index) => (
              <div
                key={index}
                className="p-6 rounded-lg border border-border hover:border-primary transition-colors"
              >
                <h3 className="text-xl font-semibold mb-4">{quote.company}</h3>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Mensuel</p>
                    <p className="text-lg font-semibold">
                      {quote.monthlyPrice.toLocaleString()} CFA
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Annuel</p>
                    <p className="text-lg font-semibold">
                      {quote.yearlyPrice.toLocaleString()} CFA
                    </p>
                  </div>
                </div>
                <div className="space-y-2">
                  {quote.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-primary" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
                <Button className="w-full mt-4">
                  Souscrire
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
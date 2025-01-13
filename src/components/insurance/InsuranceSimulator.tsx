import { useState } from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Shield, Home, AlertTriangle } from "lucide-react";

const insuranceCompanies = [
  {
    name: "AssurImmo Plus",
    baseRate: 0.005,
    coverage: ["Dégâts des eaux", "Incendie", "Vol", "Catastrophes naturelles"],
  },
  {
    name: "Protecto Habitat",
    baseRate: 0.006,
    coverage: ["Dégâts des eaux", "Incendie", "Vol", "Responsabilité civile"],
  },
  {
    name: "SecuriLogis",
    baseRate: 0.0055,
    coverage: ["Dégâts des eaux", "Incendie", "Vol", "Bris de glace"],
  }
];

const InsuranceSimulator = () => {
  const [propertyValue, setPropertyValue] = useState("");
  const [propertyType, setPropertyType] = useState("house");
  const [showQuotes, setShowQuotes] = useState(false);
  const { toast } = useToast();

  const calculateInsurance = (baseRate: number) => {
    const value = Number(propertyValue);
    let multiplier = 1;

    switch (propertyType) {
      case "apartment":
        multiplier = 0.9;
        break;
      case "house":
        multiplier = 1;
        break;
      case "building":
        multiplier = 1.2;
        break;
    }

    return (value * baseRate * multiplier).toFixed(2);
  };

  const handleSimulate = () => {
    if (!propertyValue) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs",
        variant: "destructive",
      });
      return;
    }
    setShowQuotes(true);
  };

  return (
    <div className="container mx-auto p-4">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-6 w-6" />
            Simulateur d'Assurance Immobilière
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Type de bien</label>
              <select
                className="w-full p-2 border rounded-md"
                value={propertyType}
                onChange={(e) => setPropertyType(e.target.value)}
              >
                <option value="house">Maison</option>
                <option value="apartment">Appartement</option>
                <option value="building">Immeuble</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Valeur du bien (FCFA)</label>
              <Input
                type="number"
                value={propertyValue}
                onChange={(e) => setPropertyValue(e.target.value)}
                placeholder="Valeur du bien"
              />
            </div>
          </div>

          <Button onClick={handleSimulate} className="w-full">
            Simuler les tarifs
          </Button>

          {showQuotes && (
            <div className="space-y-4 mt-6">
              <h3 className="text-lg font-semibold">Devis des assureurs</h3>
              <div className="grid gap-4">
                {insuranceCompanies.map((company) => (
                  <Card key={company.name} className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-semibold">{company.name}</h4>
                        <p className="text-sm text-gray-600 mt-1">
                          Prime annuelle: {calculateInsurance(company.baseRate)} FCFA
                        </p>
                        <div className="mt-2">
                          <p className="text-sm font-medium">Garanties incluses:</p>
                          <ul className="text-sm text-gray-600">
                            {company.coverage.map((item) => (
                              <li key={item} className="flex items-center gap-1">
                                <div className="h-1.5 w-1.5 rounded-full bg-green-500" />
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                      <Button variant="outline" className="shrink-0">
                        Demander un devis
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default InsuranceSimulator;
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Zap, Droplets } from "lucide-react";

const EnergySimulator = ({ surfaceArea }: { surfaceArea: number }) => {
  const [occupants, setOccupants] = useState<number>(1);
  const [hasAirCon, setHasAirCon] = useState<boolean>(false);
  const { toast } = useToast();

  const calculateEnergyCosts = () => {
    // Estimation basique des coûts mensuels
    const baseElectricityPerM2 = 2000; // FCFA par m² par mois
    const baseWaterPerPerson = 5000; // FCFA par personne par mois
    const airConSurcharge = 15000; // FCFA par mois si climatisation

    const electricityCost = surfaceArea * baseElectricityPerM2 + (hasAirCon ? airConSurcharge : 0);
    const waterCost = occupants * baseWaterPerPerson;

    toast({
      title: "Estimation des coûts mensuels",
      description: `Électricité: ${electricityCost.toLocaleString()} FCFA\nEau: ${waterCost.toLocaleString()} FCFA`,
    });
  };

  return (
    <Card className="p-6 space-y-4">
      <h3 className="text-lg font-semibold">Simulateur de Coûts Énergétiques</h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">
            Nombre d'occupants
          </label>
          <Input
            type="number"
            min="1"
            value={occupants}
            onChange={(e) => setOccupants(parseInt(e.target.value) || 1)}
          />
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="aircon"
            checked={hasAirCon}
            onChange={(e) => setHasAirCon(e.target.checked)}
            className="rounded border-gray-300"
          />
          <label htmlFor="aircon" className="text-sm">
            Climatisation
          </label>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
            <Droplets className="h-5 w-5 text-blue-500" />
            <div className="text-sm">
              <p className="font-medium">Eau</p>
              <p className="text-gray-600">Par personne</p>
            </div>
          </div>

          <div className="flex items-center gap-2 p-3 bg-yellow-50 rounded-lg">
            <Zap className="h-5 w-5 text-yellow-500" />
            <div className="text-sm">
              <p className="font-medium">Électricité</p>
              <p className="text-gray-600">Par m²</p>
            </div>
          </div>
        </div>

        <Button 
          onClick={calculateEnergyCosts}
          className="w-full"
        >
          Calculer les coûts
        </Button>
      </div>
    </Card>
  );
};

export default EnergySimulator;
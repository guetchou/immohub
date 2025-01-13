import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/components/ui/use-toast";
import { NavBar } from "@/components/navigation/NavBar";

type PropertyType = "house" | "apartment" | "land";

interface PropertyDetails {
  type: PropertyType;
  surface: number;
  rooms?: number;
  yearBuilt?: number;
  condition: "new" | "good" | "renovate";
}

export default function PropertySaleCalculator() {
  const [details, setDetails] = useState<PropertyDetails>({
    type: "house",
    surface: 0,
    rooms: 0,
    yearBuilt: new Date().getFullYear(),
    condition: "good",
  });

  const { toast } = useToast();

  const calculatePrice = () => {
    let basePrice = 0;
    const currentYear = new Date().getFullYear();

    // Base price calculation by type and surface
    switch (details.type) {
      case "house":
        basePrice = details.surface * 1500;
        break;
      case "apartment":
        basePrice = details.surface * 2000;
        break;
      case "land":
        basePrice = details.surface * 500;
        break;
    }

    // Condition multiplier
    const conditionMultiplier = {
      new: 1.2,
      good: 1,
      renovate: 0.8,
    }[details.condition];

    // Age depreciation (for buildings only)
    let ageFactor = 1;
    if (details.type !== "land" && details.yearBuilt) {
      const age = currentYear - details.yearBuilt;
      ageFactor = Math.max(0.7, 1 - (age * 0.01));
    }

    const finalPrice = basePrice * conditionMultiplier * ageFactor;

    toast({
      title: "Estimation du prix",
      description: `Prix estimé: ${finalPrice.toLocaleString()} CFA`,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <NavBar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Calculateur de prix immobilier</h1>
        
        <div className="space-y-6 max-w-md">
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
                <RadioGroupItem value="land" id="land" />
                <Label htmlFor="land">Terrain</Label>
              </div>
            </RadioGroup>
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

          {details.type !== "land" && (
            <>
              <div>
                <Label htmlFor="rooms">Nombre de pièces</Label>
                <Input
                  id="rooms"
                  type="number"
                  value={details.rooms}
                  onChange={(e) => 
                    setDetails(prev => ({ ...prev, rooms: Number(e.target.value) }))}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="yearBuilt">Année de construction</Label>
                <Input
                  id="yearBuilt"
                  type="number"
                  value={details.yearBuilt}
                  onChange={(e) => 
                    setDetails(prev => ({ ...prev, yearBuilt: Number(e.target.value) }))}
                  className="mt-1"
                />
              </div>
            </>
          )}

          <div>
            <Label>État du bien</Label>
            <RadioGroup
              value={details.condition}
              onValueChange={(value: "new" | "good" | "renovate") => 
                setDetails(prev => ({ ...prev, condition: value }))}
              className="grid grid-cols-3 gap-4 mt-2"
            >
              <div>
                <RadioGroupItem value="new" id="new" />
                <Label htmlFor="new">Neuf</Label>
              </div>
              <div>
                <RadioGroupItem value="good" id="good" />
                <Label htmlFor="good">Bon état</Label>
              </div>
              <div>
                <RadioGroupItem value="renovate" id="renovate" />
                <Label htmlFor="renovate">À rénover</Label>
              </div>
            </RadioGroup>
          </div>

          <Button onClick={calculatePrice} className="w-full">
            Calculer le prix
          </Button>
        </div>
      </div>
    </div>
  );
}
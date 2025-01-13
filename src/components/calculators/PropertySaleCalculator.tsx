import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Building2, Home, Trees } from "lucide-react";

const PropertySaleCalculator = () => {
  const [propertyDetails, setPropertyDetails] = useState({
    type: "house",
    surface: "",
    rooms: "",
    location: "",
    condition: "good",
    yearBuilt: "",
  });

  const { toast } = useToast();

  const calculateEstimatedPrice = () => {
    let basePrice = 0;
    const surfaceValue = Number(propertyDetails.surface);
    
    switch (propertyDetails.type) {
      case "house":
        basePrice = surfaceValue * 500000;
        break;
      case "apartment":
        basePrice = surfaceValue * 450000;
        break;
      case "land":
        basePrice = surfaceValue * 100000;
        break;
    }

    // Ajustements selon l'état et l'année
    const age = new Date().getFullYear() - Number(propertyDetails.yearBuilt);
    const conditionMultiplier = propertyDetails.condition === "good" ? 1.1 : 0.9;
    const ageDeduction = Math.max(0.7, 1 - (age * 0.01));

    const finalPrice = basePrice * conditionMultiplier * ageDeduction;

    toast({
      title: "Estimation de prix",
      description: `Prix estimé: ${finalPrice.toLocaleString()} FCFA`,
    });
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Home className="h-6 w-6" />
          Calculateur de Prix Immobilier
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Type de bien</label>
            <select
              className="w-full p-2 border rounded-md"
              value={propertyDetails.type}
              onChange={(e) => setPropertyDetails({ ...propertyDetails, type: e.target.value })}
            >
              <option value="house">Maison</option>
              <option value="apartment">Appartement</option>
              <option value="land">Terrain</option>
            </select>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Surface (m²)</label>
            <Input
              type="number"
              value={propertyDetails.surface}
              onChange={(e) => setPropertyDetails({ ...propertyDetails, surface: e.target.value })}
              placeholder="Surface en m²"
            />
          </div>

          {propertyDetails.type !== "land" && (
            <div className="space-y-2">
              <label className="text-sm font-medium">Nombre de pièces</label>
              <Input
                type="number"
                value={propertyDetails.rooms}
                onChange={(e) => setPropertyDetails({ ...propertyDetails, rooms: e.target.value })}
                placeholder="Nombre de pièces"
              />
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-medium">État du bien</label>
            <select
              className="w-full p-2 border rounded-md"
              value={propertyDetails.condition}
              onChange={(e) => setPropertyDetails({ ...propertyDetails, condition: e.target.value })}
            >
              <option value="good">Bon état</option>
              <option value="needs_work">Travaux nécessaires</option>
            </select>
          </div>

          {propertyDetails.type !== "land" && (
            <div className="space-y-2">
              <label className="text-sm font-medium">Année de construction</label>
              <Input
                type="number"
                value={propertyDetails.yearBuilt}
                onChange={(e) => setPropertyDetails({ ...propertyDetails, yearBuilt: e.target.value })}
                placeholder="Année de construction"
              />
            </div>
          )}
        </div>

        <Button 
          onClick={calculateEstimatedPrice}
          className="w-full mt-4"
        >
          Calculer l'estimation
        </Button>
      </CardContent>
    </Card>
  );
};

export default PropertySaleCalculator;
import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Select } from "./ui/select";
import { useToast } from "@/components/ui/use-toast";

const PriceSimulator = () => {
  const [propertyDetails, setPropertyDetails] = useState({
    surface: "",
    rooms: "",
    location: "",
    type: "sale", // or "rent"
    propertyType: "apartment", // or "house", "land"
  });
  const { toast } = useToast();

  const calculateEstimatedPrice = () => {
    // Algorithme simplifié de calcul de prix
    const basePrice = propertyDetails.type === "sale" ? 500000 : 1000;
    const surfaceMultiplier = Number(propertyDetails.surface) * (propertyDetails.type === "sale" ? 10000 : 50);
    const roomsMultiplier = Number(propertyDetails.rooms) * (propertyDetails.type === "sale" ? 50000 : 200);
    
    let locationMultiplier = 1;
    switch (propertyDetails.location) {
      case "brazzaville":
        locationMultiplier = 1.2;
        break;
      case "pointe-noire":
        locationMultiplier = 1.1;
        break;
      default:
        locationMultiplier = 1;
    }

    const estimatedPrice = (basePrice + surfaceMultiplier + roomsMultiplier) * locationMultiplier;

    toast({
      title: "Estimation de prix",
      description: `Prix estimé: ${estimatedPrice.toLocaleString()} FCFA`,
    });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-real-primary mb-6">Simulateur de Prix</h2>
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Type de transaction</label>
            <select
              className="w-full p-2 border rounded"
              value={propertyDetails.type}
              onChange={(e) => setPropertyDetails({ ...propertyDetails, type: e.target.value })}
            >
              <option value="sale">Vente</option>
              <option value="rent">Location</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Type de bien</label>
            <select
              className="w-full p-2 border rounded"
              value={propertyDetails.propertyType}
              onChange={(e) => setPropertyDetails({ ...propertyDetails, propertyType: e.target.value })}
            >
              <option value="apartment">Appartement</option>
              <option value="house">Maison</option>
              <option value="land">Terrain</option>
            </select>
          </div>
        </div>

        <Input
          type="number"
          placeholder="Surface (m²)"
          value={propertyDetails.surface}
          onChange={(e) => setPropertyDetails({ ...propertyDetails, surface: e.target.value })}
        />

        <Input
          type="number"
          placeholder="Nombre de pièces"
          value={propertyDetails.rooms}
          onChange={(e) => setPropertyDetails({ ...propertyDetails, rooms: e.target.value })}
        />

        <select
          className="w-full p-2 border rounded"
          value={propertyDetails.location}
          onChange={(e) => setPropertyDetails({ ...propertyDetails, location: e.target.value })}
        >
          <option value="">Sélectionnez une ville</option>
          <option value="brazzaville">Brazzaville</option>
          <option value="pointe-noire">Pointe-Noire</option>
          <option value="dolisie">Dolisie</option>
        </select>

        <Button 
          onClick={calculateEstimatedPrice}
          className="w-full bg-real-primary hover:bg-real-primary/90"
        >
          Calculer l'estimation
        </Button>
      </div>
    </div>
  );
};

export default PriceSimulator;
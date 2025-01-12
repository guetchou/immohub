import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Checkbox } from "@/components/ui/checkbox";
import { Box, Truck, Package, Warehouse } from "lucide-react";

const MovingCalculator = () => {
  const [details, setDetails] = useState({
    fromAddress: "",
    toAddress: "",
    moveDate: "",
    rooms: "1",
    floor: "0",
    hasElevator: false,
    needsPacking: false,
    needsStorage: false,
    distance: "",
  });
  const { toast } = useToast();

  const calculatePrice = () => {
    // Base price calculation
    let basePrice = 50000; // Prix de base en FCFA
    
    // Add per room
    basePrice += Number(details.rooms) * 25000;
    
    // Add for floors without elevator
    if (!details.hasElevator && Number(details.floor) > 0) {
      basePrice += Number(details.floor) * 15000;
    }
    
    // Add for packing service
    if (details.needsPacking) {
      basePrice += Number(details.rooms) * 20000;
    }
    
    // Add for storage service
    if (details.needsStorage) {
      basePrice += 50000;
    }
    
    // Add distance fee
    if (details.distance) {
      basePrice += Number(details.distance) * 1000;
    }

    return basePrice;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const estimatedPrice = calculatePrice();
    
    toast({
      title: "Estimation du déménagement",
      description: `Prix estimé: ${estimatedPrice.toLocaleString()} FCFA`,
    });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-real-primary mb-6">Calculateur de Déménagement</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            placeholder="Adresse de départ"
            value={details.fromAddress}
            onChange={(e) => setDetails({ ...details, fromAddress: e.target.value })}
            required
          />
          <Input
            placeholder="Adresse d'arrivée"
            value={details.toAddress}
            onChange={(e) => setDetails({ ...details, toAddress: e.target.value })}
            required
          />
        </div>

        <Input
          type="date"
          value={details.moveDate}
          onChange={(e) => setDetails({ ...details, moveDate: e.target.value })}
          required
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Nombre de pièces</label>
            <Input
              type="number"
              min="1"
              value={details.rooms}
              onChange={(e) => setDetails({ ...details, rooms: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Étage</label>
            <Input
              type="number"
              min="0"
              value={details.floor}
              onChange={(e) => setDetails({ ...details, floor: e.target.value })}
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="flex items-center space-x-2">
            <Checkbox
              checked={details.hasElevator}
              onCheckedChange={(checked) => 
                setDetails({ ...details, hasElevator: checked as boolean })
              }
            />
            <span>Ascenseur disponible</span>
          </label>

          <label className="flex items-center space-x-2">
            <Checkbox
              checked={details.needsPacking}
              onCheckedChange={(checked) => 
                setDetails({ ...details, needsPacking: checked as boolean })
              }
            />
            <span>Service d'emballage</span>
          </label>

          <label className="flex items-center space-x-2">
            <Checkbox
              checked={details.needsStorage}
              onCheckedChange={(checked) => 
                setDetails({ ...details, needsStorage: checked as boolean })
              }
            />
            <span>Stockage temporaire</span>
          </label>
        </div>

        <Input
          type="number"
          placeholder="Distance approximative (km)"
          value={details.distance}
          onChange={(e) => setDetails({ ...details, distance: e.target.value })}
          required
        />

        <Button type="submit" className="w-full bg-real-primary hover:bg-real-primary/90">
          <Truck className="mr-2 h-4 w-4" />
          Calculer l'estimation
        </Button>
      </form>
    </div>
  );
};

export default MovingCalculator;
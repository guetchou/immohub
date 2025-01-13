import { useState } from "react";
import { useForm } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

interface MovingCalculatorForm {
  distance: number;
  rooms: number;
  date: string;
}

const MovingCalculator = () => {
  const [estimatedPrice, setEstimatedPrice] = useState<number | null>(null);
  const { register, handleSubmit } = useForm<MovingCalculatorForm>();
  const { toast } = useToast();

  const calculatePrice = (data: MovingCalculatorForm) => {
    // Logique de calcul simplifiée
    const basePrice = 50000; // Prix de base en FCFA
    const distancePrice = data.distance * 1000; // 1000 FCFA par km
    const roomsPrice = data.rooms * 25000; // 25000 FCFA par pièce
    
    return basePrice + distancePrice + roomsPrice;
  };

  const onSubmit = (data: MovingCalculatorForm) => {
    console.log("Calculating moving cost:", data);
    const price = calculatePrice(data);
    setEstimatedPrice(price);
    
    toast({
      title: "Estimation calculée",
      description: `Le coût estimé de votre déménagement est de ${price.toLocaleString()} FCFA`,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Calculateur de Déménagement</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="distance">Distance (km)</Label>
            <Input
              id="distance"
              type="number"
              {...register("distance", { valueAsNumber: true })}
              placeholder="Distance en kilomètres"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="rooms">Nombre de pièces</Label>
            <Input
              id="rooms"
              type="number"
              {...register("rooms", { valueAsNumber: true })}
              placeholder="Nombre de pièces à déménager"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="date">Date de déménagement</Label>
            <Input
              id="date"
              type="date"
              {...register("date")}
            />
          </div>

          <Button type="submit" className="w-full">
            Calculer le coût
          </Button>

          {estimatedPrice && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg text-center">
              <p className="text-lg font-semibold">
                Coût estimé: {estimatedPrice.toLocaleString()} FCFA
              </p>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
};

export default MovingCalculator;
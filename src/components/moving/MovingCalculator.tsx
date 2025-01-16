import { useState } from "react";
import { useForm } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

interface MovingCalculatorForm {
  distance: number;
  rooms: number;
  date: string;
  floor: number;
  hasElevator: boolean;
  hasParking: boolean;
  fragileItems: boolean;
  needPacking: boolean;
  needUnpacking: boolean;
  needStorage: boolean;
  storageDuration: number;
  vehicleType: 'small' | 'medium' | 'large';
  weekendMove: boolean;
  urgentMove: boolean;
}

const MovingCalculator = () => {
  const [estimatedPrice, setEstimatedPrice] = useState<number | null>(null);
  const [estimatedDuration, setEstimatedDuration] = useState<number | null>(null);
  const { register, handleSubmit, watch } = useForm<MovingCalculatorForm>();
  const { toast } = useToast();

  const needStorage = watch('needStorage');

  const calculatePrice = (data: MovingCalculatorForm) => {
    console.log("Calculating moving cost with data:", data);
    
    // Prix de base selon le type de véhicule
    let basePrice = {
      small: 75000,
      medium: 150000,
      large: 250000
    }[data.vehicleType];

    // Prix par kilomètre
    const distancePrice = data.distance * 1000;

    // Prix par pièce (incluant la complexité du déménagement)
    const roomPrice = data.rooms * 25000;

    // Supplément pour les étages (si pas d'ascenseur)
    const floorPrice = data.hasElevator ? 
      data.floor * 5000 : 
      data.floor * 15000;

    // Supplément pour les objets fragiles
    const fragilePrice = data.fragileItems ? basePrice * 0.15 : 0;

    // Services d'emballage/déballage
    const packingPrice = data.needPacking ? (data.rooms * 35000) : 0;
    const unpackingPrice = data.needUnpacking ? (data.rooms * 25000) : 0;

    // Stockage
    const storagePrice = data.needStorage ? 
      (data.storageDuration * 50000) : 0;

    // Suppléments weekend et urgence
    const weekendSurcharge = data.weekendMove ? basePrice * 0.2 : 0;
    const urgencySurcharge = data.urgentMove ? basePrice * 0.3 : 0;

    // Calcul du temps estimé (en heures)
    const estimatedHours = Math.ceil(
      (data.rooms * 1.5) + 
      (data.distance / 50) + 
      (data.floor * 0.5) +
      (data.fragileItems ? 2 : 0) +
      (data.needPacking ? data.rooms * 2 : 0) +
      (data.needUnpacking ? data.rooms * 1.5 : 0)
    );
    setEstimatedDuration(estimatedHours);

    // Prix total
    return basePrice + 
           distancePrice + 
           roomPrice + 
           floorPrice + 
           fragilePrice + 
           packingPrice + 
           unpackingPrice + 
           storagePrice + 
           weekendSurcharge + 
           urgencySurcharge;
  };

  const onSubmit = (data: MovingCalculatorForm) => {
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
        <CardTitle>Calculateur de Déménagement Avancé</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
              <Label htmlFor="floor">Étage</Label>
              <Input
                id="floor"
                type="number"
                {...register("floor", { valueAsNumber: true })}
                placeholder="Étage de l'appartement"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="vehicleType">Type de véhicule</Label>
              <Select onValueChange={(value) => register("vehicleType").onChange({ target: { value } })}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez le type de véhicule" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="small">Petit (Studio - 2 pièces)</SelectItem>
                  <SelectItem value="medium">Moyen (3-4 pièces)</SelectItem>
                  <SelectItem value="large">Grand (5+ pièces)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="date">Date de déménagement</Label>
              <Input
                id="date"
                type="date"
                {...register("date")}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <Checkbox {...register("hasElevator")} id="hasElevator" />
              <Label htmlFor="hasElevator">Ascenseur disponible</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox {...register("hasParking")} id="hasParking" />
              <Label htmlFor="hasParking">Parking facile d'accès</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox {...register("fragileItems")} id="fragileItems" />
              <Label htmlFor="fragileItems">Objets fragiles</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox {...register("needPacking")} id="needPacking" />
              <Label htmlFor="needPacking">Service d'emballage</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox {...register("needUnpacking")} id="needUnpacking" />
              <Label htmlFor="needUnpacking">Service de déballage</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox {...register("needStorage")} id="needStorage" />
              <Label htmlFor="needStorage">Besoin de stockage</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox {...register("weekendMove")} id="weekendMove" />
              <Label htmlFor="weekendMove">Déménagement le weekend</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox {...register("urgentMove")} id="urgentMove" />
              <Label htmlFor="urgentMove">Déménagement urgent</Label>
            </div>
          </div>

          {needStorage && (
            <div className="space-y-2">
              <Label htmlFor="storageDuration">Durée de stockage (mois)</Label>
              <Input
                id="storageDuration"
                type="number"
                {...register("storageDuration", { valueAsNumber: true })}
                placeholder="Nombre de mois de stockage"
              />
            </div>
          )}

          <Button type="submit" className="w-full">
            Calculer le coût
          </Button>

          {estimatedPrice && (
            <div className="mt-4 space-y-4">
              <div className="p-4 bg-primary/10 rounded-lg">
                <h3 className="font-semibold mb-2">Estimation détaillée :</h3>
                <p className="text-2xl font-bold text-primary">
                  {estimatedPrice.toLocaleString()} FCFA
                </p>
              </div>
              
              {estimatedDuration && (
                <div className="p-4 bg-secondary/10 rounded-lg">
                  <h3 className="font-semibold mb-2">Durée estimée :</h3>
                  <p className="text-xl">
                    {estimatedDuration} heures
                  </p>
                </div>
              )}
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
};

export default MovingCalculator;
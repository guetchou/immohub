import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Home, DollarSign } from "lucide-react";
import FavoriteButton from "./FavoriteButton";
import EnergySimulator from "./simulators/EnergySimulator";
import { useState } from "react";

interface PropertyCardProps {
  id: string;
  title: string;
  price: number;
  location: string;
  type: string;
  surface: number;
  imageUrl: string;
}

const PropertyCard = ({
  id,
  title,
  price,
  location,
  type,
  surface,
  imageUrl
}: PropertyCardProps) => {
  const [showEnergySimulator, setShowEnergySimulator] = useState(false);

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative">
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-2 right-2 flex gap-2">
          <FavoriteButton propertyId={id} />
          <Badge variant="secondary">{type}</Badge>
        </div>
      </div>
      
      <CardContent className="p-4 space-y-4">
        <div>
          <h3 className="font-semibold text-lg mb-2">{title}</h3>
          <div className="flex items-center gap-2 text-gray-600">
            <MapPin className="h-4 w-4" />
            <span className="text-sm">{location}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <Home className="h-4 w-4 text-real-primary" />
            <span className="text-sm">{surface} m²</span>
          </div>
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-real-primary" />
            <span className="text-sm font-bold">
              {price.toLocaleString()} FCFA
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowEnergySimulator(!showEnergySimulator)}
          >
            {showEnergySimulator ? "Masquer" : "Simuler les coûts énergétiques"}
          </Button>

          {showEnergySimulator && (
            <EnergySimulator surfaceArea={surface} />
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PropertyCard;
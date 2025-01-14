import { MapPin, Info, Star, TrendingUp } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const NeighborhoodInfo = ({ neighborhood }: { neighborhood: string }) => {
  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center gap-2">
          <MapPin className="h-5 w-5 text-real-primary" />
          <CardTitle>Information sur le Quartier</CardTitle>
        </div>
        <CardDescription>
          Découvrez les caractéristiques du quartier {neighborhood}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-start gap-3">
            <Info className="h-5 w-5 text-real-primary mt-1" />
            <div>
              <h4 className="font-medium">Commodités</h4>
              <ul className="text-sm text-gray-600 space-y-1 mt-1">
                <li>Écoles à proximité</li>
                <li>Centres commerciaux</li>
                <li>Transports en commun</li>
                <li>Espaces verts</li>
              </ul>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <Star className="h-5 w-5 text-real-primary mt-1" />
            <div>
              <h4 className="font-medium">Points d'Intérêt</h4>
              <ul className="text-sm text-gray-600 space-y-1 mt-1">
                <li>Restaurants</li>
                <li>Pharmacies</li>
                <li>Banques</li>
                <li>Lieux de culte</li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="border-t pt-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-real-primary" />
            <h4 className="font-medium">Tendances du Marché</h4>
          </div>
          <p className="text-sm text-gray-600 mt-2">
            Ce quartier connaît une croissance stable des prix immobiliers avec une
            augmentation moyenne de 5% par an. La demande locative est
            particulièrement forte dans ce secteur.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default NeighborhoodInfo;
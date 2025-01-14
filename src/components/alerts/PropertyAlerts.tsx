import { Bell, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const PropertyAlerts = () => {
  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-2xl font-bold">Alertes Immobilières</CardTitle>
        <Button variant="ghost" size="icon">
          <Settings className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardDescription className="px-6">
        Restez informé des nouvelles propriétés correspondant à vos critères
      </CardDescription>
      <CardContent className="space-y-4">
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              <Bell className="h-5 w-5 text-real-primary" />
              <div>
                <p className="font-medium">Appartement à Brazzaville</p>
                <p className="text-sm text-gray-500">2-3 chambres, max 250,000 FCFA/mois</p>
              </div>
            </div>
            <Badge>Active</Badge>
          </div>
          
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              <Bell className="h-5 w-5 text-real-primary" />
              <div>
                <p className="font-medium">Villa à Pointe-Noire</p>
                <p className="text-sm text-gray-500">4+ chambres, piscine</p>
              </div>
            </div>
            <Badge variant="outline">En pause</Badge>
          </div>
        </div>
        
        <Button className="w-full">
          Créer une nouvelle alerte
        </Button>
      </CardContent>
    </Card>
  );
};

export default PropertyAlerts;
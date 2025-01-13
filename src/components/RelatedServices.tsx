import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Truck, Shield, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

interface RelatedServicesProps {
  propertyId: string;
}

const RelatedServices = ({ propertyId }: RelatedServicesProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Services Connexes</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4">
          <Button 
            variant="outline" 
            className="flex items-center justify-start gap-2"
            asChild
          >
            <Link to="/moving-services">
              <Truck className="w-4 h-4" />
              Services de déménagement
            </Link>
          </Button>

          <Button 
            variant="outline" 
            className="flex items-center justify-start gap-2"
            asChild
          >
            <Link to="/insurance">
              <Shield className="w-4 h-4" />
              Assurance habitation
            </Link>
          </Button>

          <Button 
            variant="outline" 
            className="flex items-center justify-start gap-2"
            asChild
          >
            <Link to="/cleaning-services">
              <Sparkles className="w-4 h-4" />
              Services de nettoyage
            </Link>
          </Button>
        </div>

        <p className="text-sm text-gray-500 mt-4">
          Des services de qualité pour faciliter votre installation
        </p>
      </CardContent>
    </Card>
  );
};

export default RelatedServices;
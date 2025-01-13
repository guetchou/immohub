import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { ArrowLeftRight, X } from "lucide-react";

interface Property {
  id: string;
  title: string;
  price: number;
  surface_area: number;
  bedrooms: number;
  bathrooms: number;
  city: string;
  address: string;
}

const PropertyComparison = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [selectedProperties, setSelectedProperties] = useState<Property[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      const { data, error } = await supabase
        .from("properties")
        .select("*")
        .eq("status", "available");

      if (error) throw error;
      setProperties(data || []);
    } catch (error) {
      console.error("Error fetching properties:", error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les propriétés",
        variant: "destructive",
      });
    }
  };

  const addToComparison = (property: Property) => {
    if (selectedProperties.length < 3) {
      setSelectedProperties([...selectedProperties, property]);
    } else {
      toast({
        title: "Maximum atteint",
        description: "Vous pouvez comparer jusqu'à 3 propriétés",
      });
    }
  };

  const removeFromComparison = (propertyId: string) => {
    setSelectedProperties(
      selectedProperties.filter((p) => p.id !== propertyId)
    );
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "XAF",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-real-primary mb-8">
          Comparer les Propriétés
        </h2>

        {selectedProperties.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {selectedProperties.map((property) => (
              <Card key={property.id} className="relative">
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2"
                  onClick={() => removeFromComparison(property.id)}
                >
                  <X className="h-4 w-4" />
                </Button>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg mb-4">{property.title}</h3>
                  <div className="space-y-2">
                    <p className="text-real-primary font-bold">
                      {formatPrice(property.price)}
                    </p>
                    <p className="text-gray-600">
                      {property.city}, {property.address}
                    </p>
                    <div className="flex gap-2 flex-wrap">
                      <Badge variant="secondary">
                        {property.surface_area} m²
                      </Badge>
                      <Badge variant="secondary">
                        {property.bedrooms} chambres
                      </Badge>
                      <Badge variant="secondary">
                        {property.bathrooms} SDB
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties
            .filter((p) => !selectedProperties.find((sp) => sp.id === p.id))
            .map((property) => (
              <Card key={property.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg mb-4">{property.title}</h3>
                  <div className="space-y-2">
                    <p className="text-real-primary font-bold">
                      {formatPrice(property.price)}
                    </p>
                    <p className="text-gray-600">
                      {property.city}, {property.address}
                    </p>
                    <div className="flex gap-2 flex-wrap">
                      <Badge variant="secondary">
                        {property.surface_area} m²
                      </Badge>
                      <Badge variant="secondary">
                        {property.bedrooms} chambres
                      </Badge>
                      <Badge variant="secondary">
                        {property.bathrooms} SDB
                      </Badge>
                    </div>
                    <Button
                      className="w-full mt-4"
                      onClick={() => addToComparison(property)}
                    >
                      <ArrowLeftRight className="mr-2 h-4 w-4" />
                      Comparer
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
        </div>
      </div>
    </section>
  );
};

export default PropertyComparison;
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { ArrowLeftRight, X, MapPin, Home, Bath, Bed, Ruler } from "lucide-react";

interface Property {
  id: string;
  title: string;
  price: number;
  surface_area: number;
  bedrooms: number;
  bathrooms: number;
  city: string;
  address: string;
  image_url?: string;
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
      console.log("Fetching properties for comparison");
      const { data: propertiesData, error: propertiesError } = await supabase
        .from("properties")
        .select(`
          id,
          title,
          surface_area,
          bedrooms,
          bathrooms,
          city,
          address,
          property_prices!inner (
            price
          )
        `)
        .eq("status", "available");

      if (propertiesError) throw propertiesError;

      const transformedProperties = propertiesData.map(property => ({
        id: property.id,
        title: property.title,
        price: property.property_prices[0]?.price || 0,
        surface_area: property.surface_area || 0,
        bedrooms: property.bedrooms || 0,
        bathrooms: property.bathrooms || 0,
        city: property.city,
        address: property.address,
      }));

      console.log("Transformed properties:", transformedProperties);
      setProperties(transformedProperties);
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
      toast({
        title: "Propriété ajoutée",
        description: "La propriété a été ajoutée à la comparaison",
      });
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
    toast({
      title: "Propriété retirée",
      description: "La propriété a été retirée de la comparaison",
    });
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
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-gray-500" />
                      <p className="text-gray-600">
                        {property.city}, {property.address}
                      </p>
                    </div>
                    <p className="text-real-primary font-bold text-xl">
                      {formatPrice(property.price)}
                    </p>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center gap-2">
                        <Ruler className="h-4 w-4 text-gray-500" />
                        <span>{property.surface_area} m²</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Bed className="h-4 w-4 text-gray-500" />
                        <span>{property.bedrooms} chambres</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Bath className="h-4 w-4 text-gray-500" />
                        <span>{property.bathrooms} SDB</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Home className="h-4 w-4 text-gray-500" />
                        <span>{Math.round(property.price / property.surface_area).toLocaleString()} FCFA/m²</span>
                      </div>
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
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-gray-500" />
                      <p className="text-gray-600">
                        {property.city}, {property.address}
                      </p>
                    </div>
                    <p className="text-real-primary font-bold text-xl">
                      {formatPrice(property.price)}
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
                      className="w-full"
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
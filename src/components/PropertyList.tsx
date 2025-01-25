import { useEffect, useState } from "react";
import PropertyCard from "./PropertyCard";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Loader } from "lucide-react";

const PropertyList = () => {
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('properties')
        .select(`
          *,
          property_types(name),
          property_prices(
            price,
            currency,
            price_type,
            period
          )
        `)
        .eq('status', 'available')
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Error fetching properties:", error);
        setError("Impossible de charger les propriétés");
        toast({
          title: "Erreur",
          description: "Impossible de charger les propriétés",
          variant: "destructive",
        });
        return;
      }

      console.log("Fetched properties:", data);
      setProperties(data || []);
    } catch (error) {
      console.error("Error in fetchProperties:", error);
      setError("Une erreur inattendue s'est produite");
      toast({
        title: "Erreur",
        description: "Une erreur inattendue s'est produite",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader className="h-8 w-8 animate-spin text-real-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8 text-red-600">
        <p>{error}</p>
      </div>
    );
  }

  if (properties.length === 0) {
    return (
      <div className="text-center p-8 text-gray-600">
        Aucune propriété disponible pour le moment
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {properties.map((property) => (
        <PropertyCard
          key={property.id}
          id={property.id}
          title={property.title}
          price={property.property_prices?.[0]?.price || 0}
          location={`${property.city}, ${property.address}`}
          type={property.property_types?.name || ""}
          surface={property.surface_area || 0}
          imageUrl={property.image_url || "https://images.unsplash.com/photo-1512917774080-9991f1c4c750"}
        />
      ))}
    </div>
  );
};

export default PropertyList;
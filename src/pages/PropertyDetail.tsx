import { useParams } from "react-router-dom";
import { Calendar, MapPin, Home, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import ContactForm from "@/components/ContactForm";
import PropertyMap from "@/components/PropertyMap";
import RelatedServices from "@/components/RelatedServices";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface Property {
  id: string;
  title: string;
  price: number;
  location: string;
  type: string;
  surface: number;
  bedrooms: number;
  bathrooms: number;
  description: string;
  imageUrl: string;
  latitude?: number;
  longitude?: number;
}

const PropertyDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [property, setProperty] = useState<Property | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProperty = async () => {
      if (!id) {
        setError("Property ID not found");
        return;
      }

      console.log("Fetching property with ID:", id);
      
      try {
        const { data, error } = await supabase
          .from('properties')
          .select(`
            *,
            property_types (
              name
            ),
            property_prices (
              price,
              currency,
              price_type,
              period
            )
          `)
          .eq('id', id)
          .maybeSingle();

        if (error) {
          console.error("Error fetching property:", error);
          setError("Failed to load property details");
          return;
        }

        if (!data) {
          setError("Property not found");
          return;
        }

        console.log("Fetched property data:", data);

        setProperty({
          id: data.id,
          title: data.title,
          price: data.property_prices?.[0]?.price || 0,
          location: `${data.city}, ${data.address}`,
          type: data.property_types?.name || 'Non spécifié',
          surface: data.surface_area || 0,
          bedrooms: data.bedrooms || 0,
          bathrooms: data.bathrooms || 0,
          description: data.description || '',
          imageUrl: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750", // Default image
          latitude: data.latitude,
          longitude: data.longitude
        });
      } catch (err) {
        console.error("Error in fetchProperty:", err);
        setError("An unexpected error occurred");
      }
    };

    fetchProperty();
  }, [id]);

  if (error) {
    return <div className="container mx-auto px-4 py-8 text-center text-red-600">{error}</div>;
  }

  if (!property) {
    return <div className="container mx-auto px-4 py-8 text-center">Chargement...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <img
            src={property.imageUrl}
            alt={property.title}
            className="w-full h-[400px] object-cover rounded-lg"
          />
          <div className="mt-8 space-y-6">
            <h1 className="text-3xl font-bold text-real-primary">
              {property.title}
            </h1>
            <div className="flex items-center gap-4 text-gray-600">
              <MapPin className="w-5 h-5" />
              <span>{property.location}</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="flex items-center gap-2">
                <Home className="w-5 h-5 text-real-primary" />
                <span>{property.surface} m²</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-real-primary" />
                <span>{property.bedrooms} chambres</span>
              </div>
              <div className="flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-real-primary" />
                <span>{property.price.toLocaleString()} FCFA</span>
              </div>
            </div>
            <div className="prose max-w-none">
              <h2 className="text-xl font-semibold mb-4">Description</h2>
              <p>{property.description}</p>
            </div>

            {property.latitude && property.longitude && (
              <div className="h-[300px] rounded-lg overflow-hidden">
                <PropertyMap 
                  latitude={property.latitude} 
                  longitude={property.longitude}
                  title={property.title}
                />
              </div>
            )}
          </div>
        </div>
        <div className="lg:pl-8">
          <div className="sticky top-8 space-y-8">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h2 className="text-xl font-semibold mb-6">
                Intéressé par ce bien ?
              </h2>
              <ContactForm />
            </div>

            <RelatedServices propertyId={property.id} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetail;
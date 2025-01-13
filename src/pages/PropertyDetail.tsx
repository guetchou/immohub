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
  const { id } = useParams();
  const [property, setProperty] = useState<Property | null>(null);

  useEffect(() => {
    const fetchProperty = async () => {
      const { data, error } = await supabase
        .from('properties')
        .select(`
          *,
          property_prices (
            price,
            currency,
            price_type,
            period
          )
        `)
        .eq('id', id)
        .single();

      if (error) {
        console.error("Error fetching property:", error);
        return;
      }

      if (data) {
        setProperty({
          id: data.id,
          title: data.title,
          price: data.property_prices?.[0]?.price || 0,
          location: `${data.city}, ${data.address}`,
          type: data.type,
          surface: data.surface_area,
          bedrooms: data.bedrooms,
          bathrooms: data.bathrooms,
          description: data.description,
          imageUrl: data.image_url || "https://images.unsplash.com/photo-1512917774080-9991f1c4c750",
          latitude: data.latitude,
          longitude: data.longitude
        });
      }
    };

    fetchProperty();
  }, [id]);

  if (!property) {
    return <div>Loading...</div>;
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
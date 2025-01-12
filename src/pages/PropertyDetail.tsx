import { useParams } from "react-router-dom";
import { Calendar, MapPin, Home, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import ContactForm from "@/components/ContactForm";

const PropertyDetail = () => {
  const { id } = useParams();

  // Simulons des données pour la démo
  const property = {
    id,
    title: "Villa moderne avec piscine",
    price: 450000000,
    location: "Brazzaville, Centre-ville",
    type: "Villa",
    surface: 250,
    bedrooms: 4,
    bathrooms: 3,
    description: "Magnifique villa moderne avec piscine et jardin paysager...",
    imageUrl: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750",
  };

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
          </div>
        </div>
        <div className="lg:pl-8">
          <div className="sticky top-8 bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-6">
              Intéressé par ce bien ?
            </h2>
            <ContactForm />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetail;
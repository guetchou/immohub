import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { calculatePropertyRecommendations } from "@/utils/propertyAlgorithms";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { useToast } from "./ui/use-toast";
import { Building2, Heart } from "lucide-react";

interface Property {
  id: string;
  title: string;
  description: string;
  image_url?: string;
  city: string;
}

const RecommendedProperties = () => {
  const { user } = useAuth();
  const [recommendations, setRecommendations] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const loadRecommendations = async () => {
      if (!user) return;

      try {
        const recommendedIds = await calculatePropertyRecommendations(user.id, {
          location: "Brazzaville",
          minPrice: 100000000,
          maxPrice: 500000000,
        });

        const { data: properties } = await supabase
          .from("properties")
          .select("*")
          .in("id", recommendedIds);

        if (properties) {
          setRecommendations(properties);
        }
      } catch (error) {
        console.error("Error loading recommendations:", error);
        toast({
          title: "Erreur",
          description: "Impossible de charger les recommandations",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadRecommendations();
  }, [user]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-48">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-real-primary" />
      </div>
    );
  }

  return (
    <section className="py-12 relative overflow-hidden">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8 bg-clip-text text-transparent bg-gradient-to-r from-real-primary to-real-accent">
          Recommandations Personnalisées
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recommendations.map((property) => (
            <Card key={property.id} className="group hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-sm border-real-primary/10">
              <div className="relative overflow-hidden aspect-video">
                <img
                  src={property.image_url || "https://images.unsplash.com/photo-1512917774080-9991f1c4c750"}
                  alt={property.title}
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <Button
                  size="icon"
                  variant="ghost"
                  className="absolute top-2 right-2 text-white hover:text-real-primary"
                >
                  <Heart className="h-5 w-5" />
                </Button>
              </div>
              
              <CardContent className="p-4">
                <h3 className="text-lg font-semibold mb-2 line-clamp-1">
                  {property.title}
                </h3>
                <div className="flex items-center text-gray-600 mb-2">
                  <Building2 className="h-4 w-4 mr-1" />
                  <span className="text-sm">{property.city}</span>
                </div>
                <p className="text-gray-600 text-sm line-clamp-2">
                  {property.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RecommendedProperties;
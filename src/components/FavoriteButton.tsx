
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import api from "@/services/api";

const FavoriteButton = ({ propertyId }: { propertyId: string }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      checkIfFavorite();
    }
  }, [user, propertyId]);

  const checkIfFavorite = async () => {
    try {
      const { data } = await api.get(`/favorites/check/${propertyId}`);
      setIsFavorite(data.isFavorite);
    } catch (error) {
      console.error("Error checking favorite:", error);
    }
  };

  const toggleFavorite = async () => {
    if (!user) {
      toast({
        title: "Connexion requise",
        description: "Veuillez vous connecter pour ajouter des favoris",
        variant: "destructive",
      });
      return;
    }

    try {
      if (isFavorite) {
        await api.delete(`/favorites/${propertyId}`);
      } else {
        await api.post('/favorites', { property_id: propertyId });
      }

      setIsFavorite(!isFavorite);
      toast({
        title: isFavorite ? "Retiré des favoris" : "Ajouté aux favoris",
        duration: 2000,
      });
    } catch (error) {
      console.error("Error toggling favorite:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue",
        variant: "destructive",
      });
    }
  };

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggleFavorite}
      className={`${
        isFavorite ? "text-red-500 hover:text-red-600" : "text-gray-500 hover:text-gray-600"
      }`}
    >
      <Heart className={`h-5 w-5 ${isFavorite ? "fill-current" : ""}`} />
    </Button>
  );
};

export default FavoriteButton;

import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

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
      const { data, error } = await supabase
        .from("favorites")
        .select("*")
        .eq("user_id", user?.id)
        .eq("property_id", propertyId)
        .single();

      if (error && error.code !== "PGRST116") {
        console.error("Error checking favorite:", error);
        return;
      }

      setIsFavorite(!!data);
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
        const { error } = await supabase
          .from("favorites")
          .delete()
          .eq("user_id", user.id)
          .eq("property_id", propertyId);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("favorites")
          .insert([{ user_id: user.id, property_id: propertyId }]);

        if (error) throw error;
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
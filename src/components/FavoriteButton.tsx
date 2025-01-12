import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";

const FavoriteButton = ({ propertyId }: { propertyId: string }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const { toast } = useToast();

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
    toast({
      title: isFavorite ? "Retiré des favoris" : "Ajouté aux favoris",
      duration: 2000,
    });
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
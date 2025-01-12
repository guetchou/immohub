import { Heart } from "lucide-react";
import PropertyList from "@/components/PropertyList";

const Favorites = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-4 mb-8">
        <Heart className="w-8 h-8 text-real-primary" />
        <h1 className="text-3xl font-bold text-real-primary">Mes Favoris</h1>
      </div>
      <PropertyList />
    </div>
  );
};

export default Favorites;
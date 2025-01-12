import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";

const HeroBanner = () => {
  return (
    <div className="relative h-[600px] flex items-center justify-center">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=1920&h=600&fit=crop')",
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50" />
      </div>
      
      <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in">
          Votre Partenaire Immobilier au Congo
        </h1>
        <p className="text-xl md:text-2xl mb-8 opacity-90">
          Découvrez les meilleures opportunités immobilières à Brazzaville, 
          Pointe-Noire et dans tout le Congo
        </p>
        
        <div className="bg-white rounded-lg p-4 max-w-2xl mx-auto">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Rechercher une propriété..."
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-real-primary text-gray-800"
              />
            </div>
            <Button className="bg-real-primary hover:bg-real-primary/90">
              <Search className="w-4 h-4 mr-2" />
              Rechercher
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroBanner;
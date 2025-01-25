import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, MapPin, Home, DollarSign } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const SearchBar = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams, setSearchParams] = useState({
    query: "",
    location: "",
    propertyType: "",
    priceRange: "",
  });

  console.log("Search params updated:", searchParams);

  const handleSearch = () => {
    if (!searchParams.query && !searchParams.location && !searchParams.propertyType && !searchParams.priceRange) {
      toast({
        title: "Attention",
        description: "Veuillez remplir au moins un critère de recherche",
        variant: "destructive",
      });
      return;
    }

    console.log("Performing search with params:", searchParams);
    const queryParams = new URLSearchParams();
    Object.entries(searchParams).forEach(([key, value]) => {
      if (value) queryParams.append(key, value);
    });
    navigate(`/properties?${queryParams.toString()}`);
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="relative">
          <Input
            type="text"
            placeholder="Que recherchez-vous ?"
            value={searchParams.query}
            onChange={(e) => setSearchParams({ ...searchParams, query: e.target.value })}
            className="pl-10"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        </div>

        <Select
          value={searchParams.location}
          onValueChange={(value) => setSearchParams({ ...searchParams, location: value })}
        >
          <SelectTrigger>
            <MapPin className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Localisation" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="brazzaville">Brazzaville</SelectItem>
            <SelectItem value="pointe-noire">Pointe-Noire</SelectItem>
            <SelectItem value="dolisie">Dolisie</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={searchParams.propertyType}
          onValueChange={(value) => setSearchParams({ ...searchParams, propertyType: value })}
        >
          <SelectTrigger>
            <Home className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Type de bien" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="house">Maison</SelectItem>
            <SelectItem value="apartment">Appartement</SelectItem>
            <SelectItem value="land">Terrain</SelectItem>
            <SelectItem value="commercial">Local commercial</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={searchParams.priceRange}
          onValueChange={(value) => setSearchParams({ ...searchParams, priceRange: value })}
        >
          <SelectTrigger>
            <DollarSign className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Budget" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="0-500000">0 - 500,000 FCFA</SelectItem>
            <SelectItem value="500000-1000000">500,000 - 1M FCFA</SelectItem>
            <SelectItem value="1000000-2000000">1M - 2M FCFA</SelectItem>
            <SelectItem value="2000000+">2M+ FCFA</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="mt-4 flex justify-center">
        <Button onClick={handleSearch} className="bg-real-primary hover:bg-real-primary/90">
          <Search className="h-4 w-4 mr-2" />
          Rechercher
        </Button>
      </div>
    </div>
  );
};

export default SearchBar;
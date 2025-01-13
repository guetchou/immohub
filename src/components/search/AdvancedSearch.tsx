import { useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export const AdvancedSearch = () => {
  const [searchParams, setSearchParams] = useState({
    query: "",
    type: "",
    priceMin: "",
    priceMax: "",
    location: "",
  });

  console.log("Search params updated:", searchParams);

  const handleSearch = () => {
    console.log("Performing search with params:", searchParams);
    // Implement search logic here
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="flex gap-2">
        <div className="flex-1">
          <Input
            placeholder="Rechercher une propriété..."
            value={searchParams.query}
            onChange={(e) => setSearchParams({ ...searchParams, query: e.target.value })}
            className="w-full"
          />
        </div>
        
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon">
              <SlidersHorizontal className="h-4 w-4" />
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Recherche avancée</SheetTitle>
              <SheetDescription>
                Affinez votre recherche de propriété
              </SheetDescription>
            </SheetHeader>
            
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Type de bien</label>
                <Select
                  value={searchParams.type}
                  onValueChange={(value) => 
                    setSearchParams({ ...searchParams, type: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="house">Maison</SelectItem>
                    <SelectItem value="apartment">Appartement</SelectItem>
                    <SelectItem value="land">Terrain</SelectItem>
                    <SelectItem value="commercial">Local commercial</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Prix minimum (FCFA)</label>
                <Input
                  type="number"
                  value={searchParams.priceMin}
                  onChange={(e) => 
                    setSearchParams({ ...searchParams, priceMin: e.target.value })}
                  placeholder="Prix minimum"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Prix maximum (FCFA)</label>
                <Input
                  type="number"
                  value={searchParams.priceMax}
                  onChange={(e) => 
                    setSearchParams({ ...searchParams, priceMax: e.target.value })}
                  placeholder="Prix maximum"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Localisation</label>
                <Select
                  value={searchParams.location}
                  onValueChange={(value) => 
                    setSearchParams({ ...searchParams, location: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner une ville" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="brazzaville">Brazzaville</SelectItem>
                    <SelectItem value="pointe-noire">Pointe-Noire</SelectItem>
                    <SelectItem value="dolisie">Dolisie</SelectItem>
                    <SelectItem value="nkayi">Nkayi</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button onClick={handleSearch} className="w-full">
              <Search className="h-4 w-4 mr-2" />
              Rechercher
            </Button>
          </SheetContent>
        </Sheet>

        <Button onClick={handleSearch}>
          <Search className="h-4 w-4 mr-2" />
          Rechercher
        </Button>
      </div>
    </div>
  );
};
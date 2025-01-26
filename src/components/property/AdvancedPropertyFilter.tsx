import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Filter, SlidersHorizontal } from "lucide-react";

interface FilterParams {
  priceRange: [number, number];
  surfaceRange: [number, number];
  bedrooms: number | null;
  bathrooms: number | null;
  propertyType: string | null;
  city: string | null;
}

const AdvancedPropertyFilter = ({ onFilterChange }: { onFilterChange: (filters: FilterParams) => void }) => {
  const [propertyTypes, setPropertyTypes] = useState<Array<{ id: string; name: string }>>([]);
  const { toast } = useToast();
  const [filters, setFilters] = useState<FilterParams>({
    priceRange: [0, 1000000000],
    surfaceRange: [0, 1000],
    bedrooms: null,
    bathrooms: null,
    propertyType: null,
    city: null,
  });

  useEffect(() => {
    fetchPropertyTypes();
  }, []);

  const fetchPropertyTypes = async () => {
    try {
      const { data, error } = await supabase
        .from("property_types")
        .select("id, name");

      if (error) throw error;
      setPropertyTypes(data || []);
    } catch (error) {
      console.error("Error fetching property types:", error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les types de propriétés",
        variant: "destructive",
      });
    }
  };

  const handleFilterChange = (key: keyof FilterParams, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <Filter className="h-5 w-5 text-real-primary" />
        <h2 className="text-lg font-semibold">Filtres avancés</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-medium">Prix (FCFA)</label>
          <Slider
            defaultValue={[0, 1000000000]}
            max={1000000000}
            step={1000000}
            onValueChange={(value) => handleFilterChange("priceRange", value)}
          />
          <div className="flex justify-between text-sm text-gray-500">
            <span>{filters.priceRange[0].toLocaleString()} FCFA</span>
            <span>{filters.priceRange[1].toLocaleString()} FCFA</span>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Surface (m²)</label>
          <Slider
            defaultValue={[0, 1000]}
            max={1000}
            step={10}
            onValueChange={(value) => handleFilterChange("surfaceRange", value)}
          />
          <div className="flex justify-between text-sm text-gray-500">
            <span>{filters.surfaceRange[0]} m²</span>
            <span>{filters.surfaceRange[1]} m²</span>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Type de propriété</label>
          <Select
            value={filters.propertyType || undefined}
            onValueChange={(value) => handleFilterChange("propertyType", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner un type" />
            </SelectTrigger>
            <SelectContent>
              {propertyTypes.map((type) => (
                <SelectItem key={type.id} value={type.id}>
                  {type.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Ville</label>
          <Select
            value={filters.city || undefined}
            onValueChange={(value) => handleFilterChange("city", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner une ville" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="brazzaville">Brazzaville</SelectItem>
              <SelectItem value="pointe-noire">Pointe-Noire</SelectItem>
              <SelectItem value="dolisie">Dolisie</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Chambres</label>
          <Input
            type="number"
            min={0}
            value={filters.bedrooms || ""}
            onChange={(e) => handleFilterChange("bedrooms", e.target.value ? parseInt(e.target.value) : null)}
            placeholder="Nombre de chambres"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Salles de bain</label>
          <Input
            type="number"
            min={0}
            value={filters.bathrooms || ""}
            onChange={(e) => handleFilterChange("bathrooms", e.target.value ? parseInt(e.target.value) : null)}
            placeholder="Nombre de salles de bain"
          />
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button
          variant="outline"
          onClick={() => {
            setFilters({
              priceRange: [0, 1000000000],
              surfaceRange: [0, 1000],
              bedrooms: null,
              bathrooms: null,
              propertyType: null,
              city: null,
            });
          }}
        >
          Réinitialiser
        </Button>
        <Button onClick={() => onFilterChange(filters)}>
          <SlidersHorizontal className="mr-2 h-4 w-4" />
          Appliquer les filtres
        </Button>
      </div>
    </div>
  );
};

export default AdvancedPropertyFilter;
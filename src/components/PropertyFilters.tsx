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
import { supabase } from "@/integrations/supabase/client";

interface PropertyFiltersProps {
  onFilterChange: (filters: any) => void;
}

const PropertyFilters = ({ onFilterChange }: PropertyFiltersProps) => {
  const [propertyTypes, setPropertyTypes] = useState<any[]>([]);
  const [filters, setFilters] = useState({
    minPrice: "",
    maxPrice: "",
    location: "",
    type_id: "",
    minSurface: "",
    maxSurface: "",
    bedrooms: "",
  });

  useEffect(() => {
    fetchPropertyTypes();
  }, []);

  const fetchPropertyTypes = async () => {
    const { data } = await supabase.from('property_types').select('*');
    setPropertyTypes(data || []);
  };

  const handleChange = (field: string, value: string) => {
    const newFilters = { ...filters, [field]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleReset = () => {
    const resetFilters = {
      minPrice: "",
      maxPrice: "",
      location: "",
      type_id: "",
      minSurface: "",
      maxSurface: "",
      bedrooms: "",
    };
    setFilters(resetFilters);
    onFilterChange(resetFilters);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm mb-6 space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Select
          value={filters.type_id}
          onValueChange={(value) => handleChange("type_id", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Type de bien" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les types</SelectItem>
            {propertyTypes.map((type) => (
              <SelectItem key={type.id} value={type.id}>
                {type.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filters.location}
          onValueChange={(value) => handleChange("location", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Ville" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes les villes</SelectItem>
            <SelectItem value="brazzaville">Brazzaville</SelectItem>
            <SelectItem value="pointe-noire">Pointe-Noire</SelectItem>
            <SelectItem value="dolisie">Dolisie</SelectItem>
          </SelectContent>
        </Select>

        <div className="grid grid-cols-2 gap-2">
          <Input
            type="number"
            placeholder="Prix min"
            value={filters.minPrice}
            onChange={(e) => handleChange("minPrice", e.target.value)}
          />
          <Input
            type="number"
            placeholder="Prix max"
            value={filters.maxPrice}
            onChange={(e) => handleChange("maxPrice", e.target.value)}
          />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <Input
            type="number"
            placeholder="Surface min (m²)"
            value={filters.minSurface}
            onChange={(e) => handleChange("minSurface", e.target.value)}
          />
          <Input
            type="number"
            placeholder="Surface max (m²)"
            value={filters.maxSurface}
            onChange={(e) => handleChange("maxSurface", e.target.value)}
          />
        </div>

        <Input
          type="number"
          placeholder="Nombre de chambres min"
          value={filters.bedrooms}
          onChange={(e) => handleChange("bedrooms", e.target.value)}
        />
      </div>

      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={handleReset}>
          Réinitialiser
        </Button>
        <Button onClick={() => onFilterChange(filters)}>
          Appliquer les filtres
        </Button>
      </div>
    </div>
  );
};

export default PropertyFilters;
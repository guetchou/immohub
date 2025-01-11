import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";

interface PropertyFiltersProps {
  onFilterChange: (filters: any) => void;
}

const PropertyFilters = ({ onFilterChange }: PropertyFiltersProps) => {
  const [filters, setFilters] = useState({
    minPrice: "",
    maxPrice: "",
    location: "",
    type: "",
  });

  const handleChange = (field: string, value: string) => {
    const newFilters = { ...filters, [field]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Input
          type="number"
          placeholder="Prix minimum"
          value={filters.minPrice}
          onChange={(e) => handleChange("minPrice", e.target.value)}
          className="w-full"
        />
        <Input
          type="number"
          placeholder="Prix maximum"
          value={filters.maxPrice}
          onChange={(e) => handleChange("maxPrice", e.target.value)}
          className="w-full"
        />
        <Input
          type="text"
          placeholder="Localisation"
          value={filters.location}
          onChange={(e) => handleChange("location", e.target.value)}
          className="w-full"
        />
        <select
          value={filters.type}
          onChange={(e) => handleChange("type", e.target.value)}
          className="w-full rounded-md border border-gray-300 p-2"
        >
          <option value="">Type de bien</option>
          <option value="apartment">Appartement</option>
          <option value="house">Maison</option>
          <option value="office">Bureau</option>
        </select>
      </div>
    </div>
  );
};

export default PropertyFilters;
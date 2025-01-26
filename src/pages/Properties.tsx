import AdvancedPropertyFilter from "@/components/property/AdvancedPropertyFilter";
import PropertyList from "@/components/PropertyList";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const Properties = () => {
  const [activeFilters, setActiveFilters] = useState({
    priceRange: [0, 1000000000],
    surfaceRange: [0, 1000],
    bedrooms: null,
    bathrooms: null,
    propertyType: null,
    city: null,
  });

  const handleFilterChange = (filters: any) => {
    console.log("Filters applied:", filters);
    setActiveFilters(filters);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-real-primary mb-8">
        Nos Propriétés
      </h1>
      <AdvancedPropertyFilter onFilterChange={handleFilterChange} />
      <div className="mb-6 flex justify-between items-center">
        <div className="text-gray-600">
          Résultats trouvés: <span className="font-semibold">15</span>
        </div>
        <div className="flex gap-4">
          <Button variant="outline">Trier par prix</Button>
          <Button variant="outline">Trier par date</Button>
        </div>
      </div>
      <PropertyList />
    </div>
  );
};

export default Properties;
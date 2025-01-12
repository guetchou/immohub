import PropertyFilters from "@/components/PropertyFilters";
import PropertyList from "@/components/PropertyList";
import { Button } from "@/components/ui/button";

const Properties = () => {
  const handleFilterChange = (filters: any) => {
    console.log("Filters applied:", filters);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-real-primary mb-8">
        Nos Propriétés
      </h1>
      <PropertyFilters onFilterChange={handleFilterChange} />
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
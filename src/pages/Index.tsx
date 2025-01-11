import Header from "@/components/Header";
import PropertyFilters from "@/components/PropertyFilters";
import PropertyList from "@/components/PropertyList";

const Index = () => {
  const handleFilterChange = (filters: any) => {
    console.log("Filters changed:", filters);
    // Implémentation du filtrage à venir
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-real-primary mb-8">
          Trouvez votre bien immobilier idéal
        </h1>
        <PropertyFilters onFilterChange={handleFilterChange} />
        <PropertyList />
      </main>
    </div>
  );
};

export default Index;
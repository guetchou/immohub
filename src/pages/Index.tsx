import Header from "@/components/Header";
import PropertyFilters from "@/components/PropertyFilters";
import PropertyList from "@/components/PropertyList";
import SearchBar from "@/components/SearchBar";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

const Index = () => {
  const { toast } = useToast();

  const handleFilterChange = (filters: any) => {
    console.log("Filters changed:", filters);
    toast({
      title: "Filtres mis à jour",
      description: "Les résultats ont été actualisés.",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold text-real-primary">
              Trouvez votre bien immobilier idéal au Congo
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Découvrez les meilleures opportunités immobilières à Brazzaville, Pointe-Noire et dans tout le Congo
            </p>
            <SearchBar />
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <PropertyFilters onFilterChange={handleFilterChange} />
          </div>

          <section>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-real-primary">
                Propriétés disponibles
              </h2>
              <Button variant="outline">
                Voir toutes les propriétés
              </Button>
            </div>
            <PropertyList />
          </section>
        </div>
      </main>
    </div>
  );
};

export default Index;
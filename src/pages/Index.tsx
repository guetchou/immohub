import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ChatBot from "@/components/ChatBot";
import PropertyFilters from "@/components/PropertyFilters";
import PropertyList from "@/components/PropertyList";
import SearchBar from "@/components/SearchBar";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import Testimonials from "@/components/Testimonials";
import Statistics from "@/components/Statistics";
import Partners from "@/components/Partners";
import FAQ from "@/components/FAQ";
import NewsSection from "@/components/NewsSection";
import Services from "@/components/Services";
import HowItWorks from "@/components/HowItWorks";
import PriceSimulator from "@/components/PriceSimulator";

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
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      
      <main className="flex-grow">
        <div className="space-y-8">
          <div className="bg-real-primary text-white py-16">
            <div className="container mx-auto px-4 text-center space-y-4">
              <h1 className="text-4xl md:text-5xl font-bold">
                Trouvez votre bien immobilier idéal au Congo
              </h1>
              <p className="text-xl opacity-90 max-w-2xl mx-auto">
                Découvrez les meilleures opportunités immobilières à Brazzaville, Pointe-Noire et dans tout le Congo
              </p>
              <SearchBar />
            </div>
          </div>
          
          <div className="container mx-auto px-4">
            <PropertyFilters onFilterChange={handleFilterChange} />
          </div>

          <div className="container mx-auto px-4">
            <PriceSimulator />
          </div>

          <Statistics />
          
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-real-primary">
                Propriétés disponibles
              </h2>
              <Button variant="outline">
                Voir toutes les propriétés
              </Button>
            </div>
            <PropertyList />
          </div>

          <HowItWorks />
          <Services />
          <Testimonials />
          <Partners />
          <NewsSection />
          <FAQ />
        </div>
      </main>

      <ChatBot />
      <Footer />
    </div>
  );
};

export default Index;
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
import AppointmentSystem from "@/components/AppointmentSystem";
import MovingCalculator from "@/components/moving/MovingCalculator";
import MovingServices from "@/components/moving/MovingServices";

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
            <h2 className="text-2xl font-semibold text-real-primary mb-6">
              Services de Déménagement
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <MovingCalculator />
              <div className="space-y-4">
                <h3 className="text-xl font-semibold">Pourquoi choisir notre service ?</h3>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Équipe professionnelle et expérimentée</li>
                  <li>Matériel adapté et de qualité</li>
                  <li>Assurance tous risques incluse</li>
                  <li>Devis gratuit et sans engagement</li>
                  <li>Service client disponible 7j/7</li>
                </ul>
              </div>
            </div>
          </div>

          <MovingServices />

          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-semibold text-real-primary mb-6">
              Planifier une visite
            </h2>
            <AppointmentSystem />
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

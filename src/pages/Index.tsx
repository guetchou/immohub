import HeroBanner from "@/components/HeroBanner";
import FeaturedProperties from "@/components/FeaturedProperties";
import Partners from "@/components/Partners";
import Services from "@/components/Services";
import HowItWorks from "@/components/HowItWorks";
import Testimonials from "@/components/Testimonials";
import NewsSection from "@/components/NewsSection";
import WhyChooseUs from "@/components/WhyChooseUs";
import ImageCarousel from "@/components/ImageCarousel";
import FAQ from "@/components/FAQ";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import PropertyMap from "@/components/location/PropertyMap";
import SocialShare from "@/components/social/SocialShare";
import MortgageSimulator from "@/components/calculators/MortgageSimulator";
import PropertySaleCalculator from "@/components/calculators/PropertySaleCalculator";
import AppointmentSystem from "@/components/AppointmentSystem";
import PriceSimulator from "@/components/PriceSimulator";
import ChatBot from "@/components/ChatBot";
import PropertyCategories from "@/components/categories/PropertyCategories";
import FuturisticBackground from "@/components/ui/futuristic-background";
import RecommendedProperties from "@/components/RecommendedProperties";
import { useAuth } from "@/contexts/AuthContext";
import MarketStats from "@/components/MarketStats";
import VideoTestimonials from "@/components/VideoTestimonials";

const Index = () => {
  const [properties, setProperties] = useState([]);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const fetchProperties = async () => {
      console.log("Fetching properties for map...");
      const { data, error } = await supabase
        .from('properties')
        .select('id, title, latitude, longitude')
        .not('latitude', 'is', null)
        .not('longitude', 'is', null)
        .limit(10);
      
      if (error) {
        console.error('Error fetching properties:', error);
        return;
      }
      
      console.log("Fetched properties:", data);
      setProperties(data);
    };

    fetchProperties();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <FuturisticBackground />
      
      <main className="relative">
        <HeroBanner />
        
        <div className="container mx-auto px-4 py-12">
          <ImageCarousel />
        </div>
        
        <div className="space-y-16">
          <PropertyCategories />

          {isAuthenticated && <RecommendedProperties />}

          <FeaturedProperties />
          
          <MarketStats />
          
          <PropertyMap properties={properties} />
          
          <WhyChooseUs />
          
          <Services />
          
          <HowItWorks />
          
          <VideoTestimonials />
          
          <Testimonials />
          
          <Partners />
          
          <div className="bg-white py-16">
            <div className="container mx-auto px-4">
              <h2 className="text-3xl font-bold text-real-primary mb-8 text-center">
                Nos Outils
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="card-modern p-6">
                  <h3 className="text-xl font-semibold mb-4">Simulateur de Prêt</h3>
                  <MortgageSimulator />
                </div>
                <div className="card-modern p-6">
                  <h3 className="text-xl font-semibold mb-4">Calculateur de Vente</h3>
                  <PropertySaleCalculator />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-gray-900 to-gray-800 py-16">
            <div className="container mx-auto px-4">
              <h2 className="text-3xl font-bold text-white mb-8 text-center">
                Estimation de Prix
              </h2>
              <div className="card-modern p-6">
                <PriceSimulator />
              </div>
            </div>
          </div>

          <div className="container mx-auto px-4 py-16">
            <h2 className="text-3xl font-bold text-real-primary mb-8 text-center">
              Planifier une Visite
            </h2>
            <div className="card-modern p-6">
              <AppointmentSystem />
            </div>
          </div>
          
          <NewsSection />
          
          <FAQ />
          
          <div className="bg-white py-16">
            <div className="container mx-auto px-4">
              <h2 className="text-3xl font-bold text-real-primary mb-8 text-center">
                Partager ImmoHub
              </h2>
              <SocialShare 
                title="Découvrez ImmoHub - Votre partenaire immobilier au Congo" 
                url={window.location.href} 
              />
            </div>
          </div>
        </div>
      </main>

      <ChatBot />
    </div>
  );
};

export default Index;
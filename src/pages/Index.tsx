import HeroBanner from "@/components/HeroBanner";
import FeaturedProperties from "@/components/FeaturedProperties";
import AnimatedStats from "@/components/stats/AnimatedStats";
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

const Index = () => {
  const [properties, setProperties] = useState([]);

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
    <div className="min-h-screen bg-gray-50">
      <main>
        <HeroBanner />
        
        <div className="py-12">
          <ImageCarousel />
        </div>
        
        <div className="space-y-16">
          <FeaturedProperties />
          
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold mb-6 text-real-primary">
              Découvrez nos propriétés sur la carte
            </h2>
            <PropertyMap properties={properties} />
          </div>
          
          <WhyChooseUs />
          
          <div className="bg-gradient-to-r from-real-primary to-blue-800 py-16 text-white">
            <AnimatedStats />
          </div>
          
          <HowItWorks />
          
          <Services />

          <div className="container mx-auto px-4 py-8">
            <h2 className="text-2xl font-bold mb-6 text-real-primary">
              Nos Outils
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <MortgageSimulator />
              <PropertySaleCalculator />
            </div>
          </div>

          <div className="container mx-auto px-4 py-8">
            <h2 className="text-2xl font-bold mb-6 text-real-primary">
              Simulateur de Prix
            </h2>
            <PriceSimulator />
          </div>

          <div className="container mx-auto px-4 py-8">
            <h2 className="text-2xl font-bold mb-6 text-real-primary">
              Planifier une Visite
            </h2>
            <AppointmentSystem />
          </div>
          
          <div className="bg-gray-50">
            <Testimonials />
          </div>
          
          <Partners />
          
          <NewsSection />
          
          <FAQ />
          
          <div className="container mx-auto px-4 py-8">
            <h2 className="text-2xl font-bold mb-6 text-real-primary">
              Partagez ImmoHub
            </h2>
            <SocialShare 
              title="Découvrez ImmoHub - Votre partenaire immobilier au Congo" 
              url={window.location.href} 
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
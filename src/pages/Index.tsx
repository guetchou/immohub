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
import MovingServices from "@/components/moving/MovingServices";
import PropertyComparison from "@/components/PropertyComparison";
import MarketTrends from "@/components/market/MarketTrends";
import ChatBot from "@/components/ChatBot";
import PropertyMap from "@/components/location/PropertyMap";
import SocialShare from "@/components/social/SocialShare";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const Index = () => {
  const [properties, setProperties] = useState([]);

  useEffect(() => {
    const fetchProperties = async () => {
      const { data, error } = await supabase
        .from('properties')
        .select('id, title, latitude, longitude')
        .not('latitude', 'is', null)
        .not('longitude', 'is', null);
      
      if (error) {
        console.error('Error fetching properties:', error);
        return;
      }
      
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
          <div className="container mx-auto px-4">
            <MarketTrends />
          </div>

          <FeaturedProperties />
          
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold mb-6">Découvrez nos propriétés sur la carte</h2>
            <PropertyMap properties={properties} />
          </div>
          
          <PropertyComparison />
          
          <WhyChooseUs />
          <HowItWorks />
          <Services />
          
          <div className="bg-gradient-to-r from-real-primary to-blue-800 py-16 text-white">
            <AnimatedStats />
          </div>
          
          <div className="container mx-auto px-4">
            <MovingServices />
          </div>
          
          <div className="bg-gray-50">
            <Testimonials />
          </div>
          
          <div className="container mx-auto px-4 py-8">
            <h2 className="text-2xl font-bold mb-6">Partagez ImmoHub</h2>
            <SocialShare 
              title="Découvrez ImmoHub - Votre partenaire immobilier au Congo" 
              url={window.location.href} 
            />
          </div>
          
          <Partners />
          <NewsSection />
        </div>
      </main>
      
      <ChatBot />
    </div>
  );
};

export default Index;
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
import ChatBot from "@/components/ChatBot";
import PropertyCategories from "@/components/categories/PropertyCategories";

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
        
        <div className="container mx-auto px-4 py-12">
          <ImageCarousel />
        </div>
        
        <div className="space-y-16">
          <section className="container mx-auto px-4">
            <PropertyCategories />
          </section>

          <section className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-real-primary mb-8 text-center">
              Propriétés en Vedette
            </h2>
            <FeaturedProperties />
          </section>
          
          <section className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-real-primary mb-8 text-center">
              Découvrez nos propriétés sur la carte
            </h2>
            <PropertyMap properties={properties} />
          </section>
          
          <section className="bg-white py-16">
            <div className="container mx-auto px-4">
              <h2 className="text-3xl font-bold text-real-primary mb-8 text-center">
                Pourquoi nous choisir
              </h2>
              <WhyChooseUs />
            </div>
          </section>
          
          <section className="bg-gradient-to-r from-real-primary to-real-dark py-16 text-white">
            <div className="container mx-auto px-4">
              <h2 className="text-3xl font-bold mb-8 text-center">
                Nos Statistiques
              </h2>
              <AnimatedStats />
            </div>
          </section>
          
          <section className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-real-primary mb-8 text-center">
              Comment ça marche
            </h2>
            <HowItWorks />
          </section>
          
          <section className="bg-white py-16">
            <div className="container mx-auto px-4">
              <h2 className="text-3xl font-bold text-real-primary mb-8 text-center">
                Nos Services
              </h2>
              <Services />
            </div>
          </section>

          <section className="container mx-auto px-4 py-16">
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
          </section>

          <section className="bg-white py-16">
            <div className="container mx-auto px-4">
              <h2 className="text-3xl font-bold text-real-primary mb-8 text-center">
                Estimation de Prix
              </h2>
              <div className="card-modern p-6">
                <PriceSimulator />
              </div>
            </div>
          </section>

          <section className="container mx-auto px-4 py-16">
            <h2 className="text-3xl font-bold text-real-primary mb-8 text-center">
              Planifier une Visite
            </h2>
            <div className="card-modern p-6">
              <AppointmentSystem />
            </div>
          </section>
          
          <section className="bg-white py-16">
            <div className="container mx-auto px-4">
              <h2 className="text-3xl font-bold text-real-primary mb-8 text-center">
                Témoignages
              </h2>
              <Testimonials />
            </div>
          </section>
          
          <section className="container mx-auto px-4 py-16">
            <h2 className="text-3xl font-bold text-real-primary mb-8 text-center">
              Nos Partenaires
            </h2>
            <Partners />
          </section>
          
          <section className="bg-white py-16">
            <div className="container mx-auto px-4">
              <h2 className="text-3xl font-bold text-real-primary mb-8 text-center">
                Actualités Immobilières
              </h2>
              <NewsSection />
            </div>
          </section>
          
          <section className="container mx-auto px-4 py-16">
            <h2 className="text-3xl font-bold text-real-primary mb-8 text-center">
              Questions Fréquentes
            </h2>
            <FAQ />
          </section>
          
          <section className="bg-white py-16">
            <div className="container mx-auto px-4">
              <h2 className="text-3xl font-bold text-real-primary mb-8 text-center">
                Partager ImmoHub
              </h2>
              <SocialShare 
                title="Découvrez ImmoHub - Votre partenaire immobilier au Congo" 
                url={window.location.href} 
              />
            </div>
          </section>
        </div>
      </main>

      <ChatBot />
    </div>
  );
};

export default Index;
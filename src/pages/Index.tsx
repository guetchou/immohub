
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
import { propertiesAPI } from "@/services/api";
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
import MarketInsights from "@/components/market/MarketInsights";
import SmartRecommendations from "@/components/recommendations/SmartRecommendations";
import { motion } from "framer-motion";
import RentCollection from "@/components/rent/RentCollection";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Home, Key, ArrowRight, UserPlus, FileCheck, Bell } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  const [properties, setProperties] = useState([]);
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const { data } = await propertiesAPI.getAll();
        setProperties(data?.slice(0, 10) || []);
      } catch {
        setProperties([]);
      }
    };
    fetchProperties();
  }, []);

  // Détermine si l'utilisateur est un locataire ou un propriétaire
  const isTenant = user?.role === 'TENANT';
  const isLandlord = user?.role === 'LANDLORD' || user?.role === 'ADMIN';

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800"
    >
      <FuturisticBackground />
      
      <main className="relative">
        <HeroBanner />
        
        <div className="container mx-auto px-4 py-12">
          <ImageCarousel />
        </div>
        
        {isAuthenticated && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="container mx-auto px-4 py-8"
          >
            <h2 className="text-3xl font-bold text-center mb-8">
              Bienvenue {user?.name ? user.name : "sur votre espace"}
            </h2>
            
            {/* Panneau d'accès rapide */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              {(isTenant || isLandlord) && (
                <Card className="hover:shadow-lg transition-all">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xl flex items-center gap-2">
                      <Home className="h-5 w-5 text-primary" />
                      Gestion de Loyer
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">
                      {isTenant ? "Payez votre loyer et suivez vos paiements" : "Gérez les paiements de vos locataires"}
                    </p>
                    <Button asChild>
                      <Link to="/rent-management">
                        Accéder <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              )}

              {(isTenant || isLandlord) && (
                <Card className="hover:shadow-lg transition-all">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xl flex items-center gap-2">
                      <FileCheck className="h-5 w-5 text-primary" />
                      Contrats de Location
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">
                      {isTenant ? "Consultez vos contrats de location" : "Gérez les contrats de vos locataires"}
                    </p>
                    <Button asChild>
                      <Link to="/leases">
                        Accéder <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              )}

              {isLandlord && (
                <Card className="hover:shadow-lg transition-all">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xl flex items-center gap-2">
                      <UserPlus className="h-5 w-5 text-primary" />
                      Gestion des Locataires
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">
                      Ajoutez et gérez les profils de vos locataires
                    </p>
                    <Button asChild>
                      <Link to="/tenants">
                        Accéder <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              )}

              {isTenant && (
                <Card className="hover:shadow-lg transition-all">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xl flex items-center gap-2">
                      <Bell className="h-5 w-5 text-primary" />
                      Demandes de Maintenance
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">
                      Signalez des problèmes et suivez les interventions
                    </p>
                    <Button asChild>
                      <Link to="/maintenance">
                        Accéder <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </motion.section>
        )}
        
        <div className="space-y-16">
          <PropertyCategories />

          {isAuthenticated && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <SmartRecommendations />
              <RecommendedProperties />
            </motion.div>
          )}

          <section className="container mx-auto px-4">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-3xl font-bold text-center mb-8"
            >
              Aperçu du Marché
            </motion.h2>
            <MarketInsights />
          </section>

          <FeaturedProperties />
          
          <MarketStats />
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <PropertyMap properties={properties} />
          </motion.div>
          
          <WhyChooseUs />
          
          <Services />
          
          <HowItWorks />
          
          <VideoTestimonials />
          
          <Testimonials />
          
          <Partners />
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white py-16"
          >
            <div className="container mx-auto px-4">
              <h2 className="text-3xl font-bold text-real-primary mb-8 text-center">
                Nos Outils
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="card-modern p-6 hover:shadow-xl transition-all duration-300">
                  <h3 className="text-xl font-semibold mb-4">Simulateur de Prêt</h3>
                  <MortgageSimulator />
                </div>
                <div className="card-modern p-6 hover:shadow-xl transition-all duration-300">
                  <h3 className="text-xl font-semibold mb-4">Calculateur de Vente</h3>
                  <PropertySaleCalculator />
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-gradient-to-br from-gray-900 to-gray-800 py-16"
          >
            <div className="container mx-auto px-4">
              <h2 className="text-3xl font-bold text-white mb-8 text-center">
                Estimation de Prix
              </h2>
              <div className="card-modern p-6 backdrop-blur-sm bg-white/10">
                <PriceSimulator />
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="container mx-auto px-4 py-16"
          >
            <h2 className="text-3xl font-bold text-real-primary mb-8 text-center">
              Planifier une Visite
            </h2>
            <div className="card-modern p-6">
              <AppointmentSystem />
            </div>
          </motion.div>
          
          <NewsSection />
          
          <FAQ />
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white py-16"
          >
            <div className="container mx-auto px-4">
              <h2 className="text-3xl font-bold text-real-primary mb-8 text-center">
                Partager ImmoHub
              </h2>
              <SocialShare 
                title="ImmoHub Congo — Portail national des meublés touristiques"
                url={window.location.href} 
              />
            </div>
          </motion.div>
        </div>
      </main>

      <ChatBot />
    </motion.div>
  );
};

export default Index;

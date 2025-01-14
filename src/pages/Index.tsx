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
import MortgageCalculator from "@/components/calculators/MortgageCalculator";
import PropertyAlerts from "@/components/alerts/PropertyAlerts";
import FloatingChatButton from "@/components/chat/FloatingChatButton";

const Index = () => {
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <PropertyAlerts />
              <MortgageCalculator />
            </div>
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
          
          <Partners />
          <NewsSection />
        </div>
      </main>
      
      <FloatingChatButton />
    </div>
  );
};

export default Index;
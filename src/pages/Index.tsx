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
import AIAssistant from "@/components/ai/AIAssistant";
import MortgageSimulator from "@/components/calculators/MortgageSimulator";

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <main>
        <HeroBanner />
        
        <div className="py-12">
          <ImageCarousel />
        </div>
        
        <div className="space-y-16">
          <FeaturedProperties />
          <WhyChooseUs />
          <HowItWorks />
          <Services />
          
          <div className="container mx-auto px-4 py-12">
            <MortgageSimulator />
          </div>
          
          <div className="bg-gradient-to-r from-real-primary to-blue-800 py-16 text-white">
            <AnimatedStats />
          </div>
          
          <div className="container mx-auto px-4">
            <MovingServices />
          </div>

          <div className="container mx-auto px-4">
            <AIAssistant />
          </div>
          
          <div className="bg-gray-50">
            <Testimonials />
          </div>
          
          <Partners />
          <NewsSection />
        </div>
      </main>
    </div>
  );
};

export default Index;
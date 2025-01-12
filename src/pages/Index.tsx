import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ChatBot from "@/components/ChatBot";
import HeroBanner from "@/components/HeroBanner";
import FeaturedProperties from "@/components/FeaturedProperties";
import Statistics from "@/components/Statistics";
import Partners from "@/components/Partners";
import Services from "@/components/Services";
import HowItWorks from "@/components/HowItWorks";
import Testimonials from "@/components/Testimonials";
import NewsSection from "@/components/NewsSection";
import MovingServices from "@/components/moving/MovingServices";

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      
      <main className="flex-grow">
        <HeroBanner />
        
        <div className="space-y-12">
          <FeaturedProperties />
          <HowItWorks />
          <Services />
          
          <div className="bg-gradient-to-r from-real-primary to-blue-800 py-16">
            <Statistics />
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

      <ChatBot />
      <Footer />
    </div>
  );
};

export default Index;
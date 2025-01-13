import { AdvancedSearch } from "@/components/search/AdvancedSearch";
import { motion } from "framer-motion";

const HeroBanner = () => {
  return (
    <div className="relative h-[600px] flex items-center justify-center">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=1920&h=600&fit=crop')",
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50" />
      </div>
      
      <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-6xl font-bold mb-6"
        >
          Votre Partenaire Immobilier au Congo
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-xl md:text-2xl mb-8 opacity-90"
        >
          Découvrez les meilleures opportunités immobilières à Brazzaville, 
          Pointe-Noire et dans tout le Congo
        </motion.p>
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.4 }}
          className="bg-white/90 backdrop-blur-sm rounded-lg p-4"
        >
          <AdvancedSearch />
        </motion.div>
      </div>
    </div>
  );
};

export default HeroBanner;
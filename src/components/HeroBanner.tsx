import { AdvancedSearch } from "@/components/search/AdvancedSearch";

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
        <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in">
          Votre Partenaire Immobilier au Congo
        </h1>
        <p className="text-xl md:text-2xl mb-8 opacity-90">
          Découvrez les meilleures opportunités immobilières à Brazzaville, 
          Pointe-Noire et dans tout le Congo
        </p>
        
        <div className="bg-white/90 backdrop-blur-sm rounded-lg p-4 animate-scale-in">
          <AdvancedSearch />
        </div>
      </div>
    </div>
  );
};

export default HeroBanner;
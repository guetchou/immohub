import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

const featuredProperties = [
  {
    id: 1,
    title: "Villa Présidentielle avec Vue Panoramique",
    location: "Brazzaville - Plateau des 15 ans",
    price: "850,000,000 FCFA",
    type: "Vente",
    image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&h=600&fit=crop",
    features: ["6 chambres", "Piscine à débordement", "Jardin tropical", "Salle de sport", "Cave à vin"],
    description: "Magnifique villa de prestige avec vue imprenable sur le fleuve Congo. Architecture contemporaine, matériaux nobles, domotique intégrée.",
    energyClass: "A",
    yearBuilt: "2022",
    availability: "Immédiate"
  },
  {
    id: 2,
    title: "Appartement de Standing - Le Millénium",
    location: "Pointe-Noire - Centre-ville",
    price: "450,000 FCFA/mois",
    type: "Location",
    image: "https://images.unsplash.com/photo-1560448204-603b3fc33ddc?w=800&h=600&fit=crop",
    features: ["3 chambres", "Entièrement meublé", "Parking sécurisé", "Ascenseur", "Concierge 24/7"],
    description: "Appartement haut de gamme dans une résidence sécurisée avec services premium et vue sur l'océan.",
    energyClass: "B",
    yearBuilt: "2021",
    availability: "Sous 1 mois"
  },
  {
    id: 3,
    title: "Centre d'Affaires Moderne - Tour Mayombe",
    location: "Brazzaville - Centre-ville",
    price: "550,000 FCFA/mois",
    type: "Location",
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=600&fit=crop",
    features: ["200m²", "Climatisation centrale", "Fibre optique", "Salle de conférence", "Parking privé"],
    description: "Espace professionnel premium dans le quartier des affaires, idéal pour siège social ou bureau de représentation.",
    energyClass: "A",
    yearBuilt: "2023",
    availability: "Immédiate"
  },
  {
    id: 4,
    title: "Résidence Les Flamboyants",
    location: "Brazzaville - Bacongo",
    price: "380,000,000 FCFA",
    type: "Vente",
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&h=600&fit=crop",
    features: ["4 chambres", "Terrasse panoramique", "Jardin", "Smart home", "Quartier prisé"],
    description: "Villa moderne dans un quartier recherché, alliance parfaite entre tradition et modernité.",
    energyClass: "B",
    yearBuilt: "2020",
    availability: "Sous 2 mois"
  },
  {
    id: 5,
    title: "Penthouse Exclusif - Les Sommets",
    location: "Pointe-Noire - Front de mer",
    price: "950,000,000 FCFA",
    type: "Vente",
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop",
    features: ["5 chambres", "Terrasse 360°", "Piscine privée", "Héliport", "Spa privé"],
    description: "Penthouse d'exception offrant une vue imprenable sur l'océan. Le summum du luxe et du raffinement.",
    energyClass: "A+",
    yearBuilt: "2024",
    availability: "Sur plan"
  }
];

const FeaturedProperties = () => {
  return (
    <section className="py-12 bg-gradient-to-r from-gray-50 to-gray-100">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-real-primary mb-8">
          Propriétés en Vedette
        </h2>
        <Carousel className="w-full max-w-6xl mx-auto">
          <CarouselContent>
            {featuredProperties.map((property) => (
              <CarouselItem key={property.id} className="md:basis-1/2 lg:basis-1/3">
                <motion.div 
                  className="p-1"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                >
                  <Card className="overflow-hidden hover:shadow-xl transition-shadow bg-white/80 backdrop-blur-sm border border-gray-200">
                    <div className="relative">
                      <img
                        src={property.image}
                        alt={property.title}
                        className="w-full h-48 object-cover"
                      />
                      <Badge
                        className="absolute top-2 right-2"
                        variant={property.type === "Vente" ? "destructive" : "default"}
                      >
                        {property.type}
                      </Badge>
                      <div className="absolute bottom-2 right-2">
                        <Badge variant="secondary" className="mr-2">
                          {property.energyClass}
                        </Badge>
                        <Badge variant="outline">
                          {property.yearBuilt}
                        </Badge>
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-lg mb-2 line-clamp-1">{property.title}</h3>
                      <p className="text-gray-600 text-sm mb-2">{property.location}</p>
                      <p className="text-real-primary font-bold mb-2">{property.price}</p>
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">{property.description}</p>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {property.features.map((feature, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {feature}
                          </Badge>
                        ))}
                      </div>
                      <p className="text-sm text-real-primary mt-2">
                        Disponibilité : {property.availability}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden md:flex" />
          <CarouselNext className="hidden md:flex" />
        </Carousel>
      </div>
    </section>
  );
};

export default FeaturedProperties;
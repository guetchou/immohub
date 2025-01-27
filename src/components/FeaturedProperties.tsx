import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const featuredProperties = [
  {
    id: 1,
    title: "Villa Présidentielle avec Vue Panoramique",
    location: "Brazzaville - Plateau des 15 ans",
    price: "850,000,000 FCFA",
    type: "Vente",
    image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&h=600&fit=crop",
    features: ["6 chambres", "Piscine à débordement", "Jardin tropical", "Salle de sport", "Cave à vin"],
    description: "Magnifique villa de prestige avec vue imprenable sur le fleuve Congo. Architecture contemporaine, matériaux nobles, domotique intégrée."
  },
  {
    id: 2,
    title: "Appartement de Standing - Le Millénium",
    location: "Pointe-Noire - Centre-ville",
    price: "450,000 FCFA/mois",
    type: "Location",
    image: "https://images.unsplash.com/photo-1560448204-603b3fc33ddc?w=800&h=600&fit=crop",
    features: ["3 chambres", "Entièrement meublé", "Parking sécurisé", "Ascenseur", "Concierge 24/7"],
    description: "Appartement haut de gamme dans une résidence sécurisée avec services premium et vue sur l'océan."
  },
  {
    id: 3,
    title: "Centre d'Affaires Moderne - Tour Mayombe",
    location: "Brazzaville - Centre-ville",
    price: "550,000 FCFA/mois",
    type: "Location",
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=600&fit=crop",
    features: ["200m²", "Climatisation centrale", "Fibre optique", "Salle de conférence", "Parking privé"],
    description: "Espace professionnel premium dans le quartier des affaires, idéal pour siège social ou bureau de représentation."
  },
  {
    id: 4,
    title: "Résidence Les Flamboyants",
    location: "Brazzaville - Bacongo",
    price: "380,000,000 FCFA",
    type: "Vente",
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&h=600&fit=crop",
    features: ["4 chambres", "Terrasse panoramique", "Jardin", "Smart home", "Quartier prisé"],
    description: "Villa moderne dans un quartier recherché, alliance parfaite entre tradition et modernité."
  }
];

const FeaturedProperties = () => {
  return (
    <section className="py-12 bg-gradient-to-r from-gray-50 to-gray-100">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-real-primary mb-8">
          Propriétés en Vedette
        </h2>
        <Carousel className="w-full max-w-5xl mx-auto">
          <CarouselContent>
            {featuredProperties.map((property) => (
              <CarouselItem key={property.id} className="md:basis-1/2 lg:basis-1/3">
                <div className="p-1">
                  <Card className="overflow-hidden hover:shadow-lg transition-shadow">
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
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-lg mb-2">{property.title}</h3>
                      <p className="text-gray-600 text-sm mb-2">{property.location}</p>
                      <p className="text-real-primary font-bold mb-2">{property.price}</p>
                      <div className="flex flex-wrap gap-2">
                        {property.features.map((feature, index) => (
                          <Badge key={index} variant="secondary">
                            {feature}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
    </section>
  );
};

export default FeaturedProperties;
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const partners = [
  {
    id: 1,
    name: "Banque Atlantique",
    logo: "https://placehold.co/200x100",
    description: "Partenaire financier principal pour vos projets immobiliers",
    link: "https://banqueatlantique.net"
  },
  {
    id: 2,
    name: "BGFI Bank",
    logo: "https://placehold.co/200x100",
    description: "Solutions de financement adaptées à vos besoins",
    link: "https://bgfi.com"
  },
  {
    id: 3,
    name: "Ecobank",
    logo: "https://placehold.co/200x100",
    description: "Accompagnement personnalisé pour votre investissement",
    link: "https://ecobank.com"
  },
  {
    id: 4,
    name: "MTN Congo",
    logo: "https://placehold.co/200x100",
    description: "Solutions de paiement mobile pour vos transactions",
    link: "https://mtn.cg"
  },
  {
    id: 5,
    name: "Airtel Congo",
    logo: "https://placehold.co/200x100",
    description: "Facilitez vos paiements avec Airtel Money",
    link: "https://airtel.cg"
  },
  {
    id: 6,
    name: "Assurances NSIA",
    logo: "https://placehold.co/200x100",
    description: "Protection et assurance de vos biens immobiliers",
    link: "https://nsia-assurances.com"
  }
];

const Partners = () => {
  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-real-primary mb-8">
          Nos Partenaires de Confiance
        </h2>
        <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
          Nous collaborons avec les meilleures institutions financières et entreprises 
          pour vous offrir des services immobiliers complets et de qualité.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {partners.map((partner) => (
            <Card key={partner.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center space-y-4">
                  <img
                    src={partner.logo}
                    alt={partner.name}
                    className="h-20 object-contain grayscale hover:grayscale-0 transition-all duration-300"
                  />
                  <h3 className="text-xl font-semibold">{partner.name}</h3>
                  <p className="text-gray-600">{partner.description}</p>
                  <Button variant="outline" asChild>
                    <a href={partner.link} target="_blank" rel="noopener noreferrer">
                      En savoir plus
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Partners;
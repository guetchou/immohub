import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const partners = [
  {
    id: 1,
    name: "Banque Congolaise de l'Habitat BCH",
    logo: "/partners/bch-logo.png",
    description: "Premier partenaire financier immobilier au Congo. Taux préférentiels exclusifs pour les clients ImmoHub. Financement jusqu'à 80% sur 25 ans.",
    link: "https://bch.cg",
    type: "Financement"
  },
  {
    id: 2,
    name: "BGFI Bank",
    logo: "/partners/bgfi-logo.png",
    description: "Solutions de financement sur mesure pour particuliers et professionnels. Accompagnement personnalisé par des experts en crédit immobilier.",
    link: "https://bgfi.com",
    type: "Financement"
  },
  {
    id: 3,
    name: "Assurances NSIA",
    logo: "/partners/nsia-logo.png",
    description: "Leader de l'assurance immobilière au Congo. Offres exclusives multirisque habitation et garantie loyers impayés pour les clients ImmoHub.",
    link: "https://nsia-assurances.com",
    type: "Assurance"
  },
  {
    id: 4,
    name: "MTN Mobile Money",
    logo: "/partners/mtn-logo.png",
    description: "Paiements sécurisés pour loyers et cautions. Transferts instantanés et suivi en temps réel de vos transactions immobilières.",
    link: "https://mtn.cg",
    type: "Paiement"
  },
  {
    id: 5,
    name: "Notaires Associés du Congo",
    logo: "/partners/notaires-logo.png",
    description: "Réseau de notaires certifiés pour sécuriser vos transactions. Expertise juridique et accompagnement personnalisé tout au long du processus.",
    link: "https://notaires.cg",
    type: "Juridique"
  },
  {
    id: 6,
    name: "Congo Expertise Immobilière",
    logo: "/partners/expertise-logo.png",
    description: "Cabinet d'expertise pour évaluations et diagnostics immobiliers. Rapports détaillés et certifiés pour ventes et locations.",
    link: "https://cei.cg",
    type: "Expertise"
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
                  <div className="w-full h-48 relative overflow-hidden rounded-lg mb-4">
                    <img
                      src={partner.logo}
                      alt={partner.name}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
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
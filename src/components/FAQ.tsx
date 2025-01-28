import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "Comment fonctionne le système de recommandation personnalisée ?",
    answer: "Notre algorithme analyse vos préférences, historique de recherche et critères spécifiques pour vous proposer les biens les plus pertinents. Plus vous interagissez avec la plateforme, plus les recommandations s'affinent."
  },
  {
    question: "Quelles sont les garanties de sécurité pour les transactions ?",
    answer: "Nous utilisons un protocole de vérification en 3 étapes : authentification forte des parties, validation des documents par nos experts, et paiement sécurisé via notre plateforme partenaire. Un notaire partenaire peut être recommandé."
  },
  {
    question: "Comment est calculé le prix optimal d'un bien ?",
    answer: "Notre algorithme d'estimation prend en compte plusieurs facteurs : les prix du marché local, l'historique des transactions, les caractéristiques du bien, la demande actuelle et les tendances du secteur pour proposer un prix juste et compétitif."
  },
  {
    question: "Quels sont les avantages du programme de fidélité ImmoHub+ ?",
    answer: "Les membres ImmoHub+ bénéficient d'avantages exclusifs : accès prioritaire aux nouvelles annonces, visites virtuelles illimitées, conseils personnalisés d'experts, et remises sur les frais de service. Le programme est gratuit pour les clients réguliers."
  },
  {
    question: "Comment se déroule une visite virtuelle 3D ?",
    answer: "Nos visites virtuelles utilisent la technologie de pointe Matterport pour une expérience immersive. Naviguez dans chaque pièce, prenez des mesures en temps réel, et visualisez différents aménagements possibles. Disponible 24/7 depuis votre appareil."
  },
  {
    question: "Quels sont les critères de sélection des agents partenaires ?",
    answer: "Nos agents sont rigoureusement sélectionnés selon plusieurs critères : expérience minimum de 5 ans, certification professionnelle, excellentes références clients, et engagement qualité ImmoHub. Formation continue obligatoire."
  },
  {
    question: "Comment fonctionne la garantie satisfaction ImmoHub ?",
    answer: "Notre garantie couvre les 3 premiers mois après la transaction. Si le bien ne correspond pas aux critères annoncés, nous prenons en charge les modifications nécessaires ou proposons une solution alternative. Conditions détaillées dans nos CGV."
  }
];

const FAQ = () => {
  return (
    <section className="py-12 bg-gradient-to-br from-gray-50 to-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-real-primary mb-8">
          Questions Fréquentes
        </h2>
        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem 
                key={index} 
                value={`item-${index}`}
                className="bg-white/80 backdrop-blur-sm rounded-lg border border-gray-200 hover:border-real-primary/50 transition-all duration-300"
              >
                <AccordionTrigger className="px-4 py-2 text-left hover:text-real-primary">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4 text-gray-600">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
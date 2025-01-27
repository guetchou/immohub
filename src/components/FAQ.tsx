import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "Comment puis-je publier une annonce immobilière ?",
    answer: "Pour publier une annonce, créez un compte propriétaire et suivez ces étapes : 1) Remplissez les informations détaillées du bien, 2) Ajoutez des photos de qualité professionnelle, 3) Précisez les conditions de vente/location. Notre équipe validera votre annonce sous 24h pour garantir sa qualité."
  },
  {
    question: "Quels sont les frais de service d'ImmoHub ?",
    answer: "Nos frais varient selon le type de bien et la durée d'engagement. Pour une vente : commission de 3% du prix de vente. Pour une location : 50% du premier loyer mensuel. Des forfaits premium avec services additionnels sont disponibles pour les professionnels."
  },
  {
    question: "Comment se déroule une visite de bien ?",
    answer: "Vous pouvez programmer une visite en ligne ou par téléphone. Nous proposons des visites physiques et virtuelles. Pour les visites physiques, un agent vous accompagne et répond à vos questions. Pour les visites virtuelles, profitez d'une expérience immersive en 3D depuis chez vous."
  },
  {
    question: "Quels documents sont nécessaires pour louer ?",
    answer: "Les documents requis incluent : pièce d'identité, 3 derniers bulletins de salaire, attestation de travail récente, justificatif de domicile, relevés bancaires des 3 derniers mois. Pour les professions libérales : les 2 derniers bilans comptables."
  },
  {
    question: "Comment est garantie la sécurité des transactions ?",
    answer: "Nous sécurisons chaque transaction via notre protocole de vérification en 3 étapes : 1) Vérification d'identité des parties, 2) Authentification des documents, 3) Paiement sécurisé via notre plateforme partenaire. Un notaire partenaire peut être recommandé."
  },
  {
    question: "Proposez-vous une assurance habitation ?",
    answer: "Oui, nous collaborons avec les meilleures compagnies d'assurance pour offrir des couvertures adaptées : multirisque habitation, protection juridique, garantie loyers impayés. Nos conseillers vous aident à choisir la formule idéale."
  },
  {
    question: "Quel est le délai moyen pour vendre un bien ?",
    answer: "Le délai moyen est de 3 mois, variable selon le type de bien et sa localisation. Nos statistiques montrent que les biens avec photos professionnelles et prix du marché se vendent 40% plus rapidement. Notre équipe vous conseille pour optimiser votre annonce."
  }
];

const FAQ = () => {
  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-real-primary mb-8">
          Questions Fréquentes
        </h2>
        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible>
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger>{faq.question}</AccordionTrigger>
                <AccordionContent>{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
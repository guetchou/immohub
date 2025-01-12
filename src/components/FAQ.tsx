import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "Comment puis-je publier une annonce ?",
    answer:
      "Pour publier une annonce, créez un compte propriétaire, remplissez les informations de votre bien et ajoutez des photos de qualité. Notre équipe validera votre annonce sous 24h.",
  },
  {
    question: "Quels sont les frais de service ?",
    answer:
      "Nos frais de service varient selon le type de bien et la durée de l'engagement. Contactez-nous pour obtenir un devis personnalisé.",
  },
  {
    question: "Comment se déroule une visite ?",
    answer:
      "Vous pouvez programmer une visite directement depuis l'annonce. Choisissez entre une visite virtuelle ou physique, et sélectionnez un créneau qui vous convient.",
  },
  {
    question: "Quels sont les documents nécessaires pour louer ?",
    answer:
      "Les documents requis incluent une pièce d'identité, les 3 derniers bulletins de salaire, un justificatif de domicile et une attestation d'emploi.",
  },
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
import ContactForm from "@/components/ContactForm";
import { MessageSquare, Phone, MapPin } from "lucide-react";

const Contact = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-real-primary mb-8 text-center">
        Contactez-nous
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-6">Nos coordonnées</h2>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Phone className="w-5 h-5 text-real-primary" />
                <span>Contact administratif à configurer</span>
              </div>
              <div className="flex items-center gap-4">
                <MessageSquare className="w-5 h-5 text-real-primary" />
                <span>Contact administratif à configurer</span>
              </div>
              <div className="flex items-center gap-4">
                <MapPin className="w-5 h-5 text-real-primary" />
                <span>Brazzaville, Congo-Brazzaville</span>
              </div>
            </div>
          </div>
        </div>
        <div>
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-6">Envoyez-nous un message</h2>
            <ContactForm />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
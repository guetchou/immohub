import { Facebook, Instagram, Twitter, MessageSquare, Mail, Phone, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Footer = () => {
  return (
    <footer className="bg-real-dark text-white py-12 mt-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-real-light">ImmoHub Congo</h3>
            <p className="text-sm text-gray-300">
              Immobilier, appartements meublés et conformité au Congo-Brazzaville.
            </p>
          </div>
          
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-real-light">Liens rapides</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link to="/properties" className="text-gray-300 hover:text-real-accent transition-colors duration-200 flex items-center gap-2">
                  <MapPin className="w-4 h-4" /> Propriétés
                </Link>
              </li>
              <li>
                <Link to="/furnished" className="text-gray-300 hover:text-real-accent transition-colors duration-200 flex items-center gap-2">
                  <MapPin className="w-4 h-4" /> Appartements meublés
                </Link>
              </li>
              <li>
                <Link to="/market-observatory" className="text-gray-300 hover:text-real-accent transition-colors duration-200 flex items-center gap-2">
                  <MessageSquare className="w-4 h-4" /> Observatoire du marché
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-300 hover:text-real-accent transition-colors duration-200 flex items-center gap-2">
                  <Mail className="w-4 h-4" /> Contact
                </Link>
              </li>
            </ul>
          </div>
          
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-real-light">Contact</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2 text-gray-300">
                <MapPin className="w-4 h-4 text-real-accent" />
                Brazzaville, Congo-Brazzaville
              </li>
              <li className="flex items-center gap-2 text-gray-300">
                <Phone className="w-4 h-4 text-real-accent" />
                Contact administratif à configurer
              </li>
              <li className="flex items-center gap-2 text-gray-300">
                <Mail className="w-4 h-4 text-real-accent" />
                Contact administratif à configurer
              </li>
            </ul>
          </div>
          
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-real-light">Suivez-nous</h4>
            <div className="flex space-x-4">
              <Button variant="ghost" size="icon" className="hover:text-real-accent text-gray-300">
                <Facebook className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="hover:text-real-accent text-gray-300">
                <Instagram className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="hover:text-real-accent text-gray-300">
                <Twitter className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="hover:text-real-accent text-gray-300">
                <MessageSquare className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-sm text-gray-400">
          <p>&copy; {new Date().getFullYear()} ImmoHub Congo. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
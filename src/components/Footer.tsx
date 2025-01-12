import { Facebook, Instagram, Twitter, MessageSquare } from "lucide-react";
import { Button } from "./ui/button";

const Footer = () => {
  return (
    <footer className="bg-real-primary text-white py-8 mt-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">ImmoHub Congo</h3>
            <p className="text-sm">
              Votre partenaire immobilier de confiance au Congo
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Liens Rapides</h4>
            <ul className="space-y-2">
              <li><a href="/properties" className="hover:text-real-accent">Propriétés</a></li>
              <li><a href="/contact" className="hover:text-real-accent">Contact</a></li>
              <li><a href="/about" className="hover:text-real-accent">À propos</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <ul className="space-y-2 text-sm">
              <li>Brazzaville, Congo</li>
              <li>+242 06 123 4567</li>
              <li>contact@immohub.cg</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Suivez-nous</h4>
            <div className="flex space-x-4">
              <Button variant="ghost" size="icon" className="hover:text-real-accent">
                <Facebook className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="hover:text-real-accent">
                <Instagram className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="hover:text-real-accent">
                <Twitter className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="hover:text-real-accent">
                <MessageSquare className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} ImmoHub Congo. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
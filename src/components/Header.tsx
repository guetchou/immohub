import { Link } from "react-router-dom";
import { Heart, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";

const Header = () => {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold text-real-primary">
            ImmoHub Congo
          </Link>
          
          <div className="flex items-center gap-6">
            <div className="hidden md:flex gap-4">
              <Link to="/" className="text-gray-600 hover:text-real-accent">
                Accueil
              </Link>
              <Link to="/properties" className="text-gray-600 hover:text-real-accent">
                Propriétés
              </Link>
              <Link to="/contact" className="text-gray-600 hover:text-real-accent">
                Contact
              </Link>
            </div>
            
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" asChild>
                <Link to="/favorites">
                  <Heart className="h-5 w-5" />
                </Link>
              </Button>
              <Button variant="ghost" size="icon" asChild>
                <Link to="/messages">
                  <MessageSquare className="h-5 w-5" />
                </Link>
              </Button>
              <Button variant="default" asChild>
                <Link to="/login">
                  Connexion
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
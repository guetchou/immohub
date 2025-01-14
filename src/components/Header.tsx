import { Link } from "react-router-dom";
import { Menu, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import MainNav from "./navigation/MainNav";
import { useAuth } from "@/contexts/AuthContext";
import ChatBot from "./ChatBot";

const Header = () => {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold text-real-primary">
            ImmoHub Congo
          </Link>
          
          <MainNav />
          
          <div className="flex items-center gap-2">
            <div className="md:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-64">
                  <nav className="flex flex-col gap-4 mt-8">
                    <Link to="/" className="text-gray-600 hover:text-real-accent">
                      Accueil
                    </Link>
                    <Link to="/properties" className="text-gray-600 hover:text-real-accent">
                      Propriétés
                    </Link>
                    <Link to="/contact" className="text-gray-600 hover:text-real-accent">
                      Contact
                    </Link>
                    {isAuthenticated ? (
                      <>
                        <Link to="/favorites" className="text-gray-600 hover:text-real-accent">
                          Favoris
                        </Link>
                        <Link to="/messages" className="text-gray-600 hover:text-real-accent">
                          Messages
                        </Link>
                        <Link to="/dashboard" className="text-gray-600 hover:text-real-accent">
                          Tableau de bord
                        </Link>
                        <button
                          onClick={() => logout()}
                          className="text-gray-600 hover:text-real-accent text-left"
                        >
                          Déconnexion
                        </button>
                      </>
                    ) : (
                      <>
                        <Link to="/login" className="text-gray-600 hover:text-real-accent">
                          Connexion
                        </Link>
                        <Link to="/register" className="text-gray-600 hover:text-real-accent">
                          Inscription
                        </Link>
                      </>
                    )}
                  </nav>
                </SheetContent>
              </Sheet>
            </div>
            
            <div className="hidden md:flex items-center gap-2">
              {isAuthenticated ? (
                <>
                  <Button variant="outline" asChild>
                    <Link to="/dashboard">
                      Tableau de bord
                    </Link>
                  </Button>
                  <Button variant="default" onClick={() => logout()}>
                    Déconnexion
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="outline" asChild>
                    <Link to="/register">
                      Inscription
                    </Link>
                  </Button>
                  <Button variant="default" asChild>
                    <Link to="/login">
                      Connexion
                    </Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      <ChatBot />
    </header>
  );
};

export default Header;
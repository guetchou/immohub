import { Link } from "react-router-dom";
import { Menu, MessageSquare, Sun, Moon, Calculator, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import MainNav from "./navigation/MainNav";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "next-themes";
import LiveChat from "./chat/LiveChat";

const Header = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { theme, setTheme } = useTheme();

  return (
    <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm shadow-sm sticky top-0 z-50 border-b border-gray-200 dark:border-gray-800">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-real-primary to-real-accent bg-clip-text text-transparent">
            ImmoHub Congo
          </Link>
          
          <MainNav />
          
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="text-gray-700 dark:text-gray-300"
            >
              {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>

            <Link to="/calculator">
              <Button variant="ghost" size="icon" className="text-gray-700 dark:text-gray-300">
                <Calculator className="h-5 w-5" />
              </Button>
            </Link>

            <Link to="/customer-service">
              <Button variant="ghost" size="icon" className="text-gray-700 dark:text-gray-300">
                <Phone className="h-5 w-5" />
              </Button>
            </Link>

            <div className="md:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="text-gray-700 dark:text-gray-300">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-64 bg-white dark:bg-gray-900">
                  <nav className="flex flex-col gap-4 mt-8">
                    <Link to="/" className="text-gray-700 dark:text-gray-300 hover:text-real-primary dark:hover:text-real-accent transition-colors">
                      Accueil
                    </Link>
                    <Link to="/properties" className="text-gray-700 dark:text-gray-300 hover:text-real-primary dark:hover:text-real-accent transition-colors">
                      Propriétés
                    </Link>
                    <Link to="/contact" className="text-gray-700 dark:text-gray-300 hover:text-real-primary dark:hover:text-real-accent transition-colors">
                      Contact
                    </Link>
                    <Link to="/calculator" className="text-gray-700 dark:text-gray-300 hover:text-real-primary dark:hover:text-real-accent transition-colors">
                      Calculateur
                    </Link>
                    <Link to="/customer-service" className="text-gray-700 dark:text-gray-300 hover:text-real-primary dark:hover:text-real-accent transition-colors">
                      Service Client
                    </Link>
                    {isAuthenticated ? (
                      <>
                        <Link to="/favorites" className="text-gray-700 dark:text-gray-300 hover:text-real-primary dark:hover:text-real-accent transition-colors">
                          Favoris
                        </Link>
                        <Link to="/messages" className="text-gray-700 dark:text-gray-300 hover:text-real-primary dark:hover:text-real-accent transition-colors">
                          Messages
                        </Link>
                        <Link to="/dashboard" className="text-gray-700 dark:text-gray-300 hover:text-real-primary dark:hover:text-real-accent transition-colors">
                          Tableau de bord
                        </Link>
                        <button
                          onClick={() => logout()}
                          className="text-gray-700 dark:text-gray-300 hover:text-real-primary dark:hover:text-real-accent transition-colors text-left"
                        >
                          Déconnexion
                        </button>
                      </>
                    ) : (
                      <>
                        <Link to="/login" className="text-gray-700 dark:text-gray-300 hover:text-real-primary dark:hover:text-real-accent transition-colors">
                          Connexion
                        </Link>
                        <Link to="/register" className="text-gray-700 dark:text-gray-300 hover:text-real-primary dark:hover:text-real-accent transition-colors">
                          Inscription
                        </Link>
                      </>
                    )}
                  </nav>
                </SheetContent>
              </Sheet>
            </div>
            
            <div className="hidden md:flex items-center gap-4">
              {isAuthenticated ? (
                <>
                  <Button variant="outline" asChild className="btn-modern">
                    <Link to="/dashboard">
                      Tableau de bord
                    </Link>
                  </Button>
                  <Button variant="default" onClick={() => logout()} className="bg-real-primary hover:bg-real-primary/90 btn-modern">
                    Déconnexion
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="outline" asChild className="btn-modern">
                    <Link to="/register">
                      Inscription
                    </Link>
                  </Button>
                  <Button variant="default" asChild className="bg-real-primary hover:bg-real-primary/90 btn-modern">
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
      <LiveChat />
    </header>
  );
};

export default Header;
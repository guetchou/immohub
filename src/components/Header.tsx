import { Link, useNavigate } from "react-router-dom";
import { Menu, MessageSquare, Sun, Moon, Calculator, Phone, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import MainNav from "./navigation/MainNav";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "next-themes";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "./ui/use-toast";

const Header = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [favoritesCount, setFavoritesCount] = useState(0);

  useEffect(() => {
    if (isAuthenticated) {
      fetchUnreadMessages();
      fetchFavoritesCount();
    }
  }, [isAuthenticated]);

  const fetchUnreadMessages = async () => {
    if (!user) return;
    
    const { data, error } = await supabase
      .from('messages')
      .select('id')
      .eq('receiver_id', user.id)
      .eq('read', false);
      
    if (error) {
      console.error('Error fetching unread messages:', error);
      return;
    }
    
    setUnreadMessages(data?.length || 0);
  };

  const fetchFavoritesCount = async () => {
    if (!user) return;
    
    const { data, error } = await supabase
      .from('favorites')
      .select('id')
      .eq('user_id', user.id);
      
    if (error) {
      console.error('Error fetching favorites:', error);
      return;
    }
    
    setFavoritesCount(data?.length || 0);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
      toast({
        title: "Déconnexion réussie",
        duration: 2000,
      });
    } catch (error) {
      console.error('Error logging out:', error);
      toast({
        title: "Erreur lors de la déconnexion",
        variant: "destructive",
      });
    }
  };

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
    toast({
      title: `Mode ${theme === "dark" ? "clair" : "sombre"} activé`,
      duration: 2000,
    });
  };

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
              onClick={toggleTheme}
              className="text-gray-700 dark:text-gray-300"
            >
              {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>

            {isAuthenticated && (
              <>
                <Link to="/favorites">
                  <Button variant="ghost" size="icon" className="text-gray-700 dark:text-gray-300 relative">
                    <Heart className="h-5 w-5" />
                    {favoritesCount > 0 && (
                      <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center bg-real-primary">
                        {favoritesCount}
                      </Badge>
                    )}
                  </Button>
                </Link>

                <Link to="/messages">
                  <Button variant="ghost" size="icon" className="text-gray-700 dark:text-gray-300 relative">
                    <MessageSquare className="h-5 w-5" />
                    {unreadMessages > 0 && (
                      <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center bg-real-primary">
                        {unreadMessages}
                      </Badge>
                    )}
                  </Button>
                </Link>
              </>
            )}

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
                          onClick={handleLogout}
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
                  <Button variant="default" onClick={handleLogout} className="bg-real-primary hover:bg-real-primary/90 btn-modern">
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
    </header>
  );
};

export default Header;
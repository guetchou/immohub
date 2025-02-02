import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import MainNav from "./navigation/MainNav";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import HeaderLogo from "./header/HeaderLogo";
import ThemeToggle from "./header/ThemeToggle";
import UserMenu from "./header/UserMenu";
import NotificationIcons from "./header/NotificationIcons";
import { useToast } from "@/hooks/use-toast";

const Header = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [favoritesCount, setFavoritesCount] = useState(0);
  const { toast } = useToast();
  const navigate = useNavigate();

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
      console.error('Error during logout:', error);
      toast({
        title: "Erreur lors de la déconnexion",
        variant: "destructive",
        duration: 2000,
      });
    }
  };

  return (
    <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm shadow-sm sticky top-0 z-50 border-b border-gray-200 dark:border-gray-800">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <HeaderLogo />
          
          <MainNav />
          
          <div className="flex items-center gap-4">
            <ThemeToggle />

            <NotificationIcons 
              unreadMessages={unreadMessages}
              favoritesCount={favoritesCount}
              isAuthenticated={isAuthenticated}
            />

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
                    {isAuthenticated ? (
                      <>
                        <Link to="/profile" className="text-gray-700 dark:text-gray-300 hover:text-real-primary dark:hover:text-real-accent transition-colors">
                          Profil
                        </Link>
                        <Link to="/settings" className="text-gray-700 dark:text-gray-300 hover:text-real-primary dark:hover:text-real-accent transition-colors">
                          Paramètres
                        </Link>
                        <Link to="/statistics" className="text-gray-700 dark:text-gray-300 hover:text-real-primary dark:hover:text-real-accent transition-colors">
                          Statistiques
                        </Link>
                        {user?.role === "ADMIN" && (
                          <Link to="/admin" className="text-gray-700 dark:text-gray-300 hover:text-real-primary dark:hover:text-real-accent transition-colors">
                            Administration
                          </Link>
                        )}
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
            
            <UserMenu />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useAuth } from "@/contexts/AuthContext";
import HeaderLogo from "./header/HeaderLogo";
import ThemeToggle from "./header/ThemeToggle";
import UserMenu from "./header/UserMenu";
import NotificationIcons from "./header/NotificationIcons";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const Header = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [favoritesCount, setFavoritesCount] = useState(0);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated && user) {
      // Fetch unread messages count
      const fetchUnreadMessages = async () => {
        try {
          console.log("Fetching unread messages for user:", user.id);
          const { count, error } = await supabase
            .from('messages')
            .select('*', { count: 'exact' })
            .eq('receiver_id', user.id)
            .eq('read', false);

          if (error) throw error;
          setUnreadMessages(count || 0);
        } catch (error) {
          console.error('Error fetching unread messages:', error);
        }
      };

      // Fetch favorites count
      const fetchFavoritesCount = async () => {
        try {
          console.log("Fetching favorites count for user:", user.id);
          const { count, error } = await supabase
            .from('favorites')
            .select('*', { count: 'exact' })
            .eq('user_id', user.id);

          if (error) throw error;
          setFavoritesCount(count || 0);
        } catch (error) {
          console.error('Error fetching favorites count:', error);
        }
      };

      // Set up real-time subscription for messages
      const messagesSubscription = supabase
        .channel('messages')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'messages',
            filter: `receiver_id=eq.${user.id}`
          },
          () => {
            console.log("New message received, updating count");
            fetchUnreadMessages();
          }
        )
        .subscribe();

      // Set up real-time subscription for favorites
      const favoritesSubscription = supabase
        .channel('favorites')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'favorites',
            filter: `user_id=eq.${user.id}`
          },
          () => {
            console.log("Favorites updated, refreshing count");
            fetchFavoritesCount();
          }
        )
        .subscribe();

      // Initial fetch
      fetchUnreadMessages();
      fetchFavoritesCount();

      // Cleanup subscriptions
      return () => {
        messagesSubscription.unsubscribe();
        favoritesSubscription.unsubscribe();
      };
    }
  }, [isAuthenticated, user]);

  const handleLogout = async () => {
    try {
      console.log("Logging out user");
      await logout();
      navigate('/');
      toast({
        title: "Déconnexion réussie",
        description: "À bientôt !",
        duration: 2000,
      });
    } catch (error) {
      console.error('Error during logout:', error);
      toast({
        title: "Erreur lors de la déconnexion",
        description: "Une erreur est survenue",
        variant: "destructive",
        duration: 2000,
      });
    }
  };

  return (
    <header className="flex items-center justify-between p-4 bg-white shadow">
      <HeaderLogo />
      <div className="flex items-center space-x-4">
        <NotificationIcons 
          unreadMessages={unreadMessages} 
          favoritesCount={favoritesCount} 
          isAuthenticated={isAuthenticated}
        />
        <ThemeToggle />
        {isAuthenticated ? (
          <UserMenu />
        ) : (
          <Link to="/login">
            <Button>Se connecter</Button>
          </Link>
        )}
      </div>
    </header>
  );
};

export default Header;
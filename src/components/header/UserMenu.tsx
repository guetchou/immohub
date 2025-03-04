
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { UserCircle } from "lucide-react";

interface UserMenuProps {
  handleLogout?: () => Promise<void>;
}

const UserMenu = ({ handleLogout }: UserMenuProps) => {
  const { isAuthenticated, logout, user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const onLogout = async () => {
    try {
      if (handleLogout) {
        await handleLogout();
      } else {
        await logout();
        navigate('/');
        toast({
          title: "Déconnexion réussie",
          duration: 2000,
        });
      }
    } catch (error) {
      console.error('Error logging out:', error);
      toast({
        title: "Erreur lors de la déconnexion",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="hidden md:flex items-center gap-4">
      {isAuthenticated ? (
        <>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Bonjour, {user?.name || user?.full_name || 'Utilisateur'}
          </div>
          <Button variant="outline" asChild className="btn-modern">
            <Link to="/profile" className="flex items-center gap-2">
              <UserCircle size={18} />
              Mon profil
            </Link>
          </Button>
          <Button variant="default" onClick={onLogout} className="bg-real-primary hover:bg-real-primary/90 btn-modern">
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
  );
};

export default UserMenu;

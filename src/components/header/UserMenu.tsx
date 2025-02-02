import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

const UserMenu = () => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

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

  return (
    <div className="hidden md:flex items-center gap-4">
      {isAuthenticated ? (
        <>
          <Button variant="outline" asChild className="btn-modern">
            <Link to="/profile">
              Mon profil
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
  );
};

export default UserMenu;
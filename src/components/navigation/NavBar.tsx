import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Home } from "lucide-react";

export const NavBar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const showBackButton = location.pathname !== "/";

  return (
    <nav className="flex items-center gap-4 p-4 bg-background border-b">
      {showBackButton && (
        <Button variant="ghost" onClick={() => navigate(-1)} className="mr-2">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour
        </Button>
      )}
      <Button variant="ghost" onClick={() => navigate("/")} className="mr-auto">
        <Home className="h-4 w-4 mr-2" />
        Accueil
      </Button>
    </nav>
  );
};
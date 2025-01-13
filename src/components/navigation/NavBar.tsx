import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Home } from "lucide-react";

export const NavBar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const showBackButton = location.pathname !== "/";

  return (
    <nav className="sticky top-0 z-50 w-full bg-white border-b shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-4">
            {showBackButton && (
              <Button variant="ghost" onClick={() => navigate(-1)} size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Retour
              </Button>
            )}
            <Button variant="ghost" onClick={() => navigate("/")} size="sm">
              <Home className="h-4 w-4 mr-2" />
              Accueil
            </Button>
          </div>
          
          <div className="text-lg font-semibold text-real-primary">
            ImmoHub Congo
          </div>
        </div>
      </div>
    </nav>
  );
};
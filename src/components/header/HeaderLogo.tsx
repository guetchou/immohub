
import { Link } from "react-router-dom";
import { Home, Building, BarChart3 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const HeaderLogo = () => {
  const { isAuthenticated, user } = useAuth();

  return (
    <div className="flex items-center">
      <Link to="/" className="flex items-center mr-6">
        <Building className="h-7 w-7 text-primary mr-2" />
        <span className="text-xl font-bold">ImmoHub</span>
      </Link>

      <nav className="hidden md:flex items-center space-x-4 ml-6">
        <Link to="/" className="text-gray-600 hover:text-primary transition-colors">
          Accueil
        </Link>
        <Link to="/properties" className="text-gray-600 hover:text-primary transition-colors">
          Propriétés
        </Link>
        {isAuthenticated && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="link" className="text-gray-600 hover:text-primary p-0">
                Mon Espace <span className="ml-1">▾</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Mon ImmoHub</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/dashboard" className="flex items-center cursor-pointer">
                  <BarChart3 className="mr-2 h-4 w-4" />
                  <span>Tableau de bord</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/profile" className="flex items-center cursor-pointer">
                  <Home className="mr-2 h-4 w-4" />
                  <span>Mon profil</span>
                </Link>
              </DropdownMenuItem>
              {(user?.role === 'TENANT' || user?.role === 'LANDLORD' || user?.role === 'ADMIN') && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/rent-management" className="flex items-center cursor-pointer">
                      <span>Gestion de loyer</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/leases" className="flex items-center cursor-pointer">
                      <span>Contrats</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/maintenance" className="flex items-center cursor-pointer">
                      <span>Maintenance</span>
                    </Link>
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
        <Link to="/contact" className="text-gray-600 hover:text-primary transition-colors">
          Contact
        </Link>
      </nav>
    </div>
  );
};

export default HeaderLogo;

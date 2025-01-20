import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Home, Building, Phone, Heart, MessageSquare, Calculator, Key } from "lucide-react";

const MainNav = () => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  return (
    <NavigationMenu className="hidden md:flex">
      <NavigationMenuList>
        <NavigationMenuItem>
          <Link to="/">
            <Button
              variant={isActive("/") ? "default" : "ghost"}
              className={cn(
                "flex items-center gap-2",
                isActive("/") && "bg-real-primary text-white"
              )}
            >
              <Home className="h-4 w-4" />
              <span>Accueil</span>
            </Button>
          </Link>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuTrigger>
            <Building className="h-4 w-4 mr-2" />
            Propriétés
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <div className="grid gap-3 p-6 w-[400px]">
              <Link to="/properties" className="group grid grid-cols-4 items-center gap-4">
                <div className="col-span-3">
                  <h3 className="text-sm font-medium">Toutes les propriétés</h3>
                  <p className="text-sm text-muted-foreground">
                    Parcourir toutes nos propriétés disponibles
                  </p>
                </div>
              </Link>
              <Link to="/properties?type=house" className="group grid grid-cols-4 items-center gap-4">
                <div className="col-span-3">
                  <h3 className="text-sm font-medium">Maisons</h3>
                  <p className="text-sm text-muted-foreground">
                    Voir toutes les maisons disponibles
                  </p>
                </div>
              </Link>
              <Link to="/properties?type=apartment" className="group grid grid-cols-4 items-center gap-4">
                <div className="col-span-3">
                  <h3 className="text-sm font-medium">Appartements</h3>
                  <p className="text-sm text-muted-foreground">
                    Explorer nos appartements
                  </p>
                </div>
              </Link>
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuTrigger>
            <Key className="h-4 w-4 mr-2" />
            Gestion locative
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <div className="grid gap-3 p-6 w-[400px]">
              <Link to="/rent/tenant" className="group grid grid-cols-4 items-center gap-4">
                <div className="col-span-3">
                  <h3 className="text-sm font-medium">Espace locataire</h3>
                  <p className="text-sm text-muted-foreground">
                    Gérer vos locations et paiements
                  </p>
                </div>
              </Link>
              <Link to="/rent/owner" className="group grid grid-cols-4 items-center gap-4">
                <div className="col-span-3">
                  <h3 className="text-sm font-medium">Espace propriétaire</h3>
                  <p className="text-sm text-muted-foreground">
                    Gérer vos biens et locataires
                  </p>
                </div>
              </Link>
              <Link to="/rent/calculator" className="group grid grid-cols-4 items-center gap-4">
                <div className="col-span-3">
                  <h3 className="text-sm font-medium">Calculateur de loyer</h3>
                  <p className="text-sm text-muted-foreground">
                    Estimer les loyers et charges
                  </p>
                </div>
              </Link>
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <Link to="/contact">
            <Button
              variant={isActive("/contact") ? "default" : "ghost"}
              className={cn(
                "flex items-center gap-2",
                isActive("/contact") && "bg-real-primary text-white"
              )}
            >
              <Phone className="h-4 w-4" />
              <span>Contact</span>
            </Button>
          </Link>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
};

export default MainNav;
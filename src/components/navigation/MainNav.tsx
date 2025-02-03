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
import { 
  Home, 
  Building2, 
  Wallet, 
  Users, 
  FileText, 
  Calculator, 
  MessageSquare, 
  Settings,
  Bell
} from "lucide-react";

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
            <Building2 className="h-4 w-4 mr-2" />
            Gestion Locative
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <div className="grid gap-3 p-6 w-[400px]">
              <Link to="/properties" className="group grid grid-cols-4 items-center gap-4">
                <div className="col-span-3">
                  <h3 className="text-sm font-medium">Propriétés</h3>
                  <p className="text-sm text-muted-foreground">
                    Gérer toutes les propriétés
                  </p>
                </div>
              </Link>
              <Link to="/tenants" className="group grid grid-cols-4 items-center gap-4">
                <div className="col-span-3">
                  <h3 className="text-sm font-medium">Locataires</h3>
                  <p className="text-sm text-muted-foreground">
                    Gestion des locataires
                  </p>
                </div>
              </Link>
              <Link to="/contracts" className="group grid grid-cols-4 items-center gap-4">
                <div className="col-span-3">
                  <h3 className="text-sm font-medium">Contrats</h3>
                  <p className="text-sm text-muted-foreground">
                    Baux et documents
                  </p>
                </div>
              </Link>
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuTrigger>
            <Wallet className="h-4 w-4 mr-2" />
            Paiements
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <div className="grid gap-3 p-6 w-[400px]">
              <Link to="/payments/rent" className="group grid grid-cols-4 items-center gap-4">
                <div className="col-span-3">
                  <h3 className="text-sm font-medium">Loyers</h3>
                  <p className="text-sm text-muted-foreground">
                    Gestion des paiements de loyer
                  </p>
                </div>
              </Link>
              <Link to="/payments/history" className="group grid grid-cols-4 items-center gap-4">
                <div className="col-span-3">
                  <h3 className="text-sm font-medium">Historique</h3>
                  <p className="text-sm text-muted-foreground">
                    Historique des transactions
                  </p>
                </div>
              </Link>
              <Link to="/payments/settings" className="group grid grid-cols-4 items-center gap-4">
                <div className="col-span-3">
                  <h3 className="text-sm font-medium">Paramètres</h3>
                  <p className="text-sm text-muted-foreground">
                    Configuration des paiements
                  </p>
                </div>
              </Link>
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuTrigger>
            <FileText className="h-4 w-4 mr-2" />
            Documents
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <div className="grid gap-3 p-6 w-[400px]">
              <Link to="/documents/contracts" className="group grid grid-cols-4 items-center gap-4">
                <div className="col-span-3">
                  <h3 className="text-sm font-medium">Contrats</h3>
                  <p className="text-sm text-muted-foreground">
                    Gestion des baux
                  </p>
                </div>
              </Link>
              <Link to="/documents/receipts" className="group grid grid-cols-4 items-center gap-4">
                <div className="col-span-3">
                  <h3 className="text-sm font-medium">Quittances</h3>
                  <p className="text-sm text-muted-foreground">
                    Quittances de loyer
                  </p>
                </div>
              </Link>
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <Link to="/messages">
            <Button
              variant={isActive("/messages") ? "default" : "ghost"}
              className={cn(
                "flex items-center gap-2",
                isActive("/messages") && "bg-real-primary text-white"
              )}
            >
              <MessageSquare className="h-4 w-4" />
              <span>Messages</span>
            </Button>
          </Link>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
};

export default MainNav;
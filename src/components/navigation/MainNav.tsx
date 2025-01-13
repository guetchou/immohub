import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Home, Building, Phone, Heart, MessageSquare, Calculator } from "lucide-react";

const MainNav = () => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { href: "/", label: "Accueil", icon: Home },
    { href: "/properties", label: "Propriétés", icon: Building },
    { href: "/contact", label: "Contact", icon: Phone },
    { href: "/favorites", label: "Favoris", icon: Heart },
    { href: "/messages", label: "Messages", icon: MessageSquare },
    { href: "/calculator", label: "Calculateur", icon: Calculator },
  ];

  return (
    <nav className="hidden md:flex items-center space-x-4">
      {navItems.map(({ href, label, icon: Icon }) => (
        <Button
          key={href}
          variant={isActive(href) ? "default" : "ghost"}
          className={cn(
            "flex items-center gap-2",
            isActive(href) && "bg-real-primary text-white"
          )}
          asChild
        >
          <Link to={href}>
            <Icon className="h-4 w-4" />
            <span>{label}</span>
          </Link>
        </Button>
      ))}
    </nav>
  );
};

export default MainNav;
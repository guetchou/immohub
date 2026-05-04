import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import HeaderLogo from "./header/HeaderLogo";
import ThemeToggle from "./header/ThemeToggle";
import UserMenu from "./header/UserMenu";
import { useToast } from "@/hooks/use-toast";
import { Menu, X } from "lucide-react";

const MINISTRY_ROLES = ["ADMIN", "MINISTRY_ADMIN", "MINISTRY_VIEWER", "MINISTRY_INSPECTOR", "COMPLIANCE_AGENT", "TAX_ANALYST"];

const Header = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isMinistry = user && MINISTRY_ROLES.includes(user.role);

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
      toast({ title: "Déconnexion réussie", description: "À bientôt !", duration: 2000 });
    } catch {
      toast({ title: "Erreur lors de la déconnexion", variant: "destructive", duration: 2000 });
    }
  };

  const navLinks = [
    { label: "Propriétés", href: "/properties" },
    { label: "Appartements meublés", href: "/furnished" },
    { label: "Observatoire", href: "/market-observatory" },
    { label: "Contact", href: "/contact" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white shadow dark:bg-gray-800">
      <div className="flex items-center justify-between px-4 py-3">
        <HeaderLogo />

        {/* Navigation desktop */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          {navLinks.map((l) => (
            <Link
              key={l.href}
              to={l.href}
              className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors"
            >
              {l.label}
            </Link>
          ))}
          {isMinistry && (
            <Link
              to="/ministry-dashboard"
              className="text-blue-700 hover:text-blue-900 dark:text-blue-400 font-semibold transition-colors"
            >
              Conformité
            </Link>
          )}
        </nav>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          {isAuthenticated ? (
            <UserMenu handleLogout={handleLogout} />
          ) : (
            <Link to="/login">
              <Button size="sm">Se connecter</Button>
            </Link>
          )}
          {/* Bouton menu mobile */}
          <button
            className="md:hidden p-1"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Menu mobile */}
      {mobileOpen && (
        <nav className="md:hidden border-t bg-white dark:bg-gray-800 px-4 pb-4 flex flex-col gap-3 text-sm font-medium">
          {navLinks.map((l) => (
            <Link
              key={l.href}
              to={l.href}
              className="text-gray-700 dark:text-gray-300 py-1"
              onClick={() => setMobileOpen(false)}
            >
              {l.label}
            </Link>
          ))}
          {isMinistry && (
            <Link
              to="/ministry-dashboard"
              className="text-blue-700 dark:text-blue-400 font-semibold py-1"
              onClick={() => setMobileOpen(false)}
            >
              Conformité
            </Link>
          )}
        </nav>
      )}
    </header>
  );
};

export default Header;

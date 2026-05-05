import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import HeaderLogo from "./header/HeaderLogo";
import ThemeToggle from "./header/ThemeToggle";
import UserMenu from "./header/UserMenu";
import { useToast } from "@/hooks/use-toast";
import {
  Menu, X, ChevronDown,
  Home, Building2, Sofa, BarChart3, Mail,
  LayoutDashboard, User, Heart, MessageSquare, Settings,
  Wallet, FileText, Wrench, ShieldCheck,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const MINISTRY_ROLES = [
  "ADMIN", "MINISTRY_ADMIN", "MINISTRY_VIEWER",
  "MINISTRY_INSPECTOR", "COMPLIANCE_AGENT", "TAX_ANALYST",
];

const LANDLORD_TENANT_ROLES = ["TENANT", "LANDLORD", "ADMIN"];

/* Rôles qui ont l'AppShell — pas besoin du dropdown "Mon Espace" dans la navbar publique */
const APPSHELL_ROLES = [
  "ADMIN", "MINISTRY_ADMIN", "MINISTRY_VIEWER", "MINISTRY_INSPECTOR",
  "COMPLIANCE_AGENT", "TAX_ANALYST", "FINANCE_VIEWER", "LANDLORD", "TENANT",
  "AGENCY", "FURNISHED_OPERATOR",
];

export default function Header() {
  const { user, isAuthenticated, logout } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isMinistry = !!(user && MINISTRY_ROLES.includes(user.role));
  const hasRentAccess = !!(user && LANDLORD_TENANT_ROLES.includes(user.role));
  const hasAppShell = !!(user && APPSHELL_ROLES.includes(user.role));

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
      toast({ title: "Déconnexion réussie", description: "À bientôt !", duration: 2000 });
    } catch {
      toast({ title: "Erreur lors de la déconnexion", variant: "destructive", duration: 2000 });
    }
  };

  const isActive = (href: string) =>
    location.pathname === href
      ? "text-real-primary font-semibold"
      : "text-gray-600 hover:text-real-primary dark:text-gray-300 dark:hover:text-real-light";

  const linkCls = (href: string) =>
    `text-sm transition-colors duration-150 whitespace-nowrap ${isActive(href)}`;

  /* ── liens "Mon Espace" ── */
  const espaceLinks = [
    { label: "Tableau de bord", href: "/dashboard",  Icon: LayoutDashboard },
    { label: "Mon profil",      href: "/profile",    Icon: User },
    { label: "Favoris",         href: "/favorites",  Icon: Heart },
    { label: "Messages",        href: "/messages",   Icon: MessageSquare },
    { label: "Paramètres",      href: "/settings",   Icon: Settings },
  ];

  /* ── liens "Services" ── */
  const serviceLinks = [
    { label: "Déclarer un meublé",  href: "/declarer-meuble/nouveau",      Icon: FileText },
    { label: "Vérifier un NIMT",   href: "/verify-nimt",          Icon: ShieldCheck },
    { label: "Observatoire marché", href: "/market-observatory",   Icon: BarChart3 },
    { label: "Contact",             href: "/contact",              Icon: Mail },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-real-primary/10 dark:bg-gray-900/95 dark:border-real-primary/20">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 h-14 gap-6">

        {/* ── Logo ── */}
        <HeaderLogo />

        {/* ── Navigation desktop ── */}
        <nav className="hidden lg:flex items-center gap-1 flex-1">
          <Link to="/" className={`px-3 py-1.5 rounded-md ${linkCls("/")}`}>
            Accueil
          </Link>
          <Link to="/properties" className={`px-3 py-1.5 rounded-md ${linkCls("/properties")}`}>
            Propriétés
          </Link>
          <Link to="/furnished" className={`px-3 py-1.5 rounded-md ${linkCls("/furnished")}`}>
            Meublés
          </Link>

          {/* Services dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-1 px-3 py-1.5 rounded-md text-sm text-gray-600 hover:text-real-primary dark:text-gray-300 dark:hover:text-real-light transition-colors duration-150 cursor-pointer whitespace-nowrap">
                Services <ChevronDown className="h-3.5 w-3.5 opacity-70" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-52">
              {serviceLinks.map(({ label, href, Icon }) => (
                <DropdownMenuItem key={href} asChild>
                  <Link to={href} className="flex items-center gap-2.5 cursor-pointer">
                    <Icon className="h-4 w-4 text-real-primary/70" />
                    {label}
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Mon Espace — uniquement si connecté sans AppShell */}
          {isAuthenticated && !hasAppShell && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-1 px-3 py-1.5 rounded-md text-sm text-gray-600 hover:text-real-primary dark:text-gray-300 dark:hover:text-real-light transition-colors duration-150 cursor-pointer whitespace-nowrap">
                  Mon Espace <ChevronDown className="h-3.5 w-3.5 opacity-70" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-52">
                {espaceLinks.map(({ label, href, Icon }) => (
                  <DropdownMenuItem key={href} asChild>
                    <Link to={href} className="flex items-center gap-2.5 cursor-pointer">
                      <Icon className="h-4 w-4 text-real-primary/70" />
                      {label}
                    </Link>
                  </DropdownMenuItem>
                ))}
                {hasRentAccess && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to="/rent-management" className="flex items-center gap-2.5 cursor-pointer">
                        <Wallet className="h-4 w-4 text-real-primary/70" /> Gestion de loyer
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/leases" className="flex items-center gap-2.5 cursor-pointer">
                        <FileText className="h-4 w-4 text-real-primary/70" /> Contrats
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/maintenance" className="flex items-center gap-2.5 cursor-pointer">
                        <Wrench className="h-4 w-4 text-real-primary/70" /> Maintenance
                      </Link>
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </nav>

        {/* ── Actions droite ── */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Lien vers le tableau de bord pour les utilisateurs avec AppShell */}
          {hasAppShell && (
            <Link
              to="/dashboard"
              className="hidden lg:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold bg-real-primary/10 text-real-primary hover:bg-real-primary hover:text-white transition-all duration-200"
            >
              <LayoutDashboard className="h-3.5 w-3.5" /> Tableau de bord
            </Link>
          )}

          <ThemeToggle />

          {isAuthenticated ? (
            <UserMenu handleLogout={handleLogout} />
          ) : (
            <Link to="/login">
              <Button size="sm" className="text-xs px-4">Se connecter</Button>
            </Link>
          )}

          {/* Burger mobile */}
          <button
            className="lg:hidden p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer transition-colors"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label={mobileOpen ? "Fermer le menu" : "Ouvrir le menu"}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* ── Menu mobile — transition CSS fluide ── */}
      <nav
        className={`lg:hidden border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden transition-all duration-200 ease-in-out ${
          mobileOpen ? "max-h-[36rem]" : "max-h-0"
        }`}
        aria-hidden={!mobileOpen}
      >
        <div className="px-4 py-3 flex flex-col gap-0.5">
          {[
            { label: "Accueil",          href: "/",                   Icon: Home },
            { label: "Propriétés",       href: "/properties",          Icon: Building2 },
            { label: "Meublés",          href: "/furnished",           Icon: Sofa },
            { label: "Déclarer un meublé", href: "/declarer-meuble/nouveau",   Icon: FileText },
            { label: "Vérifier NIMT",    href: "/verify-nimt",         Icon: ShieldCheck },
            { label: "Observatoire",     href: "/market-observatory",  Icon: BarChart3 },
            { label: "Contact",          href: "/contact",             Icon: Mail },
          ].map(({ label, href, Icon }) => (
            <Link
              key={href}
              to={href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:bg-real-secondary hover:text-real-primary dark:hover:bg-real-primary/10 transition-colors duration-150"
              onClick={() => setMobileOpen(false)}
            >
              <Icon className="h-4 w-4 opacity-60" /> {label}
            </Link>
          ))}

          {isAuthenticated && !hasAppShell && (
            <>
              <div className="mt-2 mb-1 px-3 text-xs text-gray-400 uppercase tracking-widest font-medium">
                Mon Espace
              </div>
              {espaceLinks.map(({ label, href, Icon }) => (
                <Link
                  key={href}
                  to={href}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:bg-real-secondary hover:text-real-primary dark:hover:bg-real-primary/10 transition-colors duration-150"
                  onClick={() => setMobileOpen(false)}
                >
                  <Icon className="h-4 w-4 opacity-60" /> {label}
                </Link>
              ))}
            </>
          )}

          {isMinistry && (
            <Link
              to="/ministry-dashboard"
              className="flex items-center gap-3 px-3 py-2.5 mt-1 rounded-lg text-sm font-semibold text-real-primary bg-real-primary/8 hover:bg-real-primary hover:text-white transition-all duration-150"
              onClick={() => setMobileOpen(false)}
            >
              <ShieldCheck className="h-4 w-4" /> Conformité — Ministère
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}

import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { UserRole } from "@/types/user";
import {
  LayoutDashboard, Users, ClipboardList, ShieldCheck, Bell,
  FileBarChart2, TrendingUp, Wallet, FileText, Wrench,
  Heart, MessageSquare, Settings, User, LogOut, Menu, X,
  AlertTriangle, BookOpen, BarChart3, Home, ChevronRight, Building2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

/* ─── types ─── */
interface NavItem   { label: string; href: string; Icon: React.ElementType; exact?: boolean }
interface NavSection { title: string; items: NavItem[] }

/* ─── navigation par rôle ─── */
function getNavSections(role: UserRole): NavSection[] {

  /* ── ADMIN ── */
  if (role === "ADMIN") return [
    { title: "Tableau de bord", items: [
      { label: "Accueil",          href: "/dashboard",                  Icon: LayoutDashboard, exact: true },
      { label: "Utilisateurs",     href: "/admin/users",                Icon: Users },
    ]},
    { title: "Registre NIMT", items: [
      { label: "Établissements",   href: "/ministry/tourism-registry",  Icon: BookOpen },
      { label: "Classification",   href: "/ministry/classification",    Icon: ShieldCheck },
    ]},
    { title: "Contrôle terrain", items: [
      { label: "Inspections",      href: "/ministry/inspections",       Icon: ClipboardList },
      { label: "Alertes",          href: "/ministry/alerts",            Icon: AlertTriangle },
      { label: "Dossiers",         href: "/ministry/cases",             Icon: FileText },
    ]},
    { title: "Conformité", items: [
      { label: "Registre conformité", href: "/ministry/registry",      Icon: ShieldCheck },
    ]},
    { title: "Analyses", items: [
      { label: "Statistiques",     href: "/ministry/statistics",        Icon: BarChart3 },
      { label: "Risque fiscal",    href: "/ministry/tax-risk",          Icon: TrendingUp },
      { label: "Finance",          href: "/finance-dashboard",          Icon: Wallet },
      { label: "Rapports",         href: "/ministry/reports",           Icon: FileBarChart2 },
    ]},
    { title: "Compte", items: [
      { label: "Mon profil",       href: "/profile",                    Icon: User },
      { label: "Paramètres",       href: "/settings",                   Icon: Settings },
    ]},
  ];

  /* ── MINISTRY_ADMIN — les décideurs voient les stats en premier ── */
  if (role === "MINISTRY_ADMIN") return [
    { title: "Tableau de bord", items: [
      { label: "Statistiques",     href: "/ministry/statistics",        Icon: BarChart3, exact: true },
    ]},
    { title: "Registre NIMT", items: [
      { label: "Établissements",   href: "/ministry/tourism-registry",  Icon: BookOpen },
      { label: "Classification",   href: "/ministry/classification",    Icon: ShieldCheck },
    ]},
    { title: "Contrôle terrain", items: [
      { label: "Inspections",      href: "/ministry/inspections",       Icon: ClipboardList },
      { label: "Alertes",          href: "/ministry/alerts",            Icon: AlertTriangle },
      { label: "Dossiers",         href: "/ministry/cases",             Icon: FileText },
    ]},
    { title: "Conformité", items: [
      { label: "Registre conformité", href: "/ministry/registry",      Icon: ShieldCheck },
    ]},
    { title: "Rapports", items: [
      { label: "Risque fiscal",    href: "/ministry/tax-risk",          Icon: TrendingUp },
      { label: "Finance",          href: "/finance-dashboard",          Icon: Wallet },
      { label: "Rapports",         href: "/ministry/reports",           Icon: FileBarChart2 },
    ]},
    { title: "Gestion", items: [
      { label: "Utilisateurs",     href: "/admin/users",                Icon: Users },
    ]},
    { title: "Compte", items: [
      { label: "Mon profil",       href: "/profile",                    Icon: User },
      { label: "Paramètres",       href: "/settings",                   Icon: Settings },
    ]},
  ];

  /* ── MINISTRY_INSPECTOR / COMPLIANCE_AGENT ── */
  if (role === "MINISTRY_INSPECTOR" || role === "COMPLIANCE_AGENT") return [
    { title: "Tableau de bord", items: [
      { label: "Statistiques",     href: "/ministry/statistics",        Icon: BarChart3, exact: true },
    ]},
    { title: "Contrôle terrain", items: [
      { label: "Inspections",      href: "/ministry/inspections",       Icon: ClipboardList },
      { label: "Alertes",          href: "/ministry/alerts",            Icon: AlertTriangle },
      { label: "Dossiers",         href: "/ministry/cases",             Icon: FileText },
    ]},
    { title: "Registre NIMT", items: [
      { label: "Établissements",   href: "/ministry/tourism-registry",  Icon: BookOpen },
      { label: "Conformité",       href: "/ministry/registry",          Icon: ShieldCheck },
    ]},
    { title: "Compte", items: [
      { label: "Mon profil",       href: "/profile",                    Icon: User },
    ]},
  ];

  /* ── MINISTRY_VIEWER / TAX_ANALYST / FINANCE_VIEWER ── */
  if (["MINISTRY_VIEWER", "TAX_ANALYST", "FINANCE_VIEWER"].includes(role)) return [
    { title: "Tableau de bord", items: [
      { label: "Statistiques",     href: "/ministry/statistics",        Icon: BarChart3, exact: true },
    ]},
    { title: "Analyses", items: [
      { label: "Risque fiscal",    href: "/ministry/tax-risk",          Icon: TrendingUp },
      { label: "Finance",          href: "/finance-dashboard",          Icon: Wallet },
      { label: "Rapports",         href: "/ministry/reports",           Icon: FileBarChart2 },
    ]},
    { title: "Registre", items: [
      { label: "Établissements",   href: "/ministry/tourism-registry",  Icon: BookOpen },
    ]},
    { title: "Compte", items: [
      { label: "Mon profil",       href: "/profile",                    Icon: User },
    ]},
  ];

  /* ── LANDLORD ── */
  if (role === "LANDLORD") return [
    { title: "Mon espace", items: [
      { label: "Accueil",          href: "/dashboard",                  Icon: LayoutDashboard, exact: true },
      { label: "Mes biens",        href: "/properties",                 Icon: Building2 },
      { label: "Favoris",          href: "/favorites",                  Icon: Heart },
      { label: "Messages",         href: "/messages",                   Icon: MessageSquare },
    ]},
    { title: "Gestion locative", items: [
      { label: "Loyers",           href: "/rent-management",            Icon: Wallet },
      { label: "Contrats",         href: "/leases",                     Icon: FileText },
      { label: "Maintenance",      href: "/maintenance",                Icon: Wrench },
    ]},
    { title: "Compte", items: [
      { label: "Mon profil",       href: "/profile",                    Icon: User },
      { label: "Paramètres",       href: "/settings",                   Icon: Settings },
    ]},
  ];

  /* ── TENANT ── */
  if (role === "TENANT") return [
    { title: "Mon espace", items: [
      { label: "Accueil",          href: "/dashboard",                  Icon: LayoutDashboard, exact: true },
      { label: "Favoris",          href: "/favorites",                  Icon: Heart },
      { label: "Messages",         href: "/messages",                   Icon: MessageSquare },
    ]},
    { title: "Mes contrats", items: [
      { label: "Paiements",        href: "/rent-management",            Icon: Wallet },
      { label: "Contrats",         href: "/leases",                     Icon: FileText },
      { label: "Maintenance",      href: "/maintenance",                Icon: Wrench },
      { label: "Notifications",    href: "/notifications",              Icon: Bell },
    ]},
    { title: "Compte", items: [
      { label: "Mon profil",       href: "/profile",                    Icon: User },
      { label: "Paramètres",       href: "/settings",                   Icon: Settings },
    ]},
  ];

  /* ── Default USER ── */
  return [
    { title: "Mon espace", items: [
      { label: "Accueil",          href: "/dashboard",                  Icon: LayoutDashboard, exact: true },
      { label: "Favoris",          href: "/favorites",                  Icon: Heart },
      { label: "Messages",         href: "/messages",                   Icon: MessageSquare },
    ]},
    { title: "Compte", items: [
      { label: "Mon profil",       href: "/profile",                    Icon: User },
      { label: "Paramètres",       href: "/settings",                   Icon: Settings },
    ]},
  ];
}

/* ─── labels rôle ─── */
const ROLE_LABELS: Partial<Record<UserRole, string>> = {
  ADMIN:              "Administrateur",
  MINISTRY_ADMIN:     "Resp. Ministère",
  MINISTRY_VIEWER:    "Observateur",
  MINISTRY_INSPECTOR: "Inspecteur",
  COMPLIANCE_AGENT:   "Agent Conformité",
  TAX_ANALYST:        "Analyste Fiscal",
  FINANCE_VIEWER:     "Finance",
  LANDLORD:           "Propriétaire",
  TENANT:             "Locataire",
  AGENCY:             "Agence",
  FURNISHED_OPERATOR: "Opérateur Meublé",
  USER:               "Utilisateur",
};

/* ─── titres de page ─── */
const PAGE_TITLES: Record<string, string> = {
  "/dashboard":                    "Vue d'ensemble",
  "/admin/users":                  "Utilisateurs",
  "/admin/users/new":              "Créer un utilisateur",
  "/ministry-dashboard":           "Tableau de bord",
  "/ministry/tourism-registry":    "Établissements NIMT",
  "/ministry/inspections":         "Inspections",
  "/ministry/registry":            "Registre conformité",
  "/ministry/map":                 "Carte",
  "/ministry/alerts":              "Alertes",
  "/ministry/cases":               "Dossiers",
  "/ministry/statistics":          "Statistiques",
  "/ministry/tax-risk":            "Risque fiscal",
  "/ministry/reports":             "Rapports",
  "/ministry/classification":      "Classification",
  "/finance-dashboard":            "Finance",
  "/profile":                      "Mon profil",
  "/settings":                     "Paramètres",
  "/favorites":                    "Favoris",
  "/messages":                     "Messages",
  "/rent-management":              "Loyers",
  "/leases":                       "Contrats de location",
  "/maintenance":                  "Maintenance",
  "/notifications":                "Notifications",
  "/properties":                   "Propriétés",
};

/* ════════════════════════════════════════════════════════════ */
export default function AppShell({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const role = (user?.role ?? "USER") as UserRole;
  const sections = getNavSections(role);

  /* Titre de page : cherche la correspondance exacte puis par préfixe */
  const pageTitle = PAGE_TITLES[location.pathname]
    ?? Object.entries(PAGE_TITLES)
         .filter(([k]) => location.pathname.startsWith(k) && k !== "/")
         .sort((a, b) => b[0].length - a[0].length)[0]?.[1]
    ?? "ImmoHub";

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
      toast({ title: "Déconnexion réussie", duration: 2000 });
    } catch {
      toast({ title: "Erreur de déconnexion", variant: "destructive", duration: 2000 });
    }
  };

  const isActive = (href: string, exact?: boolean) =>
    exact ? location.pathname === href : location.pathname.startsWith(href);

  /* ── Sidebar content (partagé desktop/mobile) ── */
  const SidebarContent = () => (
    <div className="flex flex-col h-full select-none">

      {/* Logo */}
      <div className="px-4 pt-5 pb-4 border-b border-white/10">
        <Link to="/" className="flex items-center gap-2.5 hover:opacity-80 transition-opacity">
          <div className="w-8 h-8 rounded-lg bg-white/15 flex items-center justify-center shrink-0">
            <Home className="h-4 w-4 text-white" />
          </div>
          <div className="min-w-0">
            <p className="text-white font-cinzel font-semibold text-sm leading-none">ImmoHub</p>
            <p className="text-white/50 font-josefin text-[10px] tracking-widest uppercase mt-0.5">Congo</p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-4">
        {sections.map((section) => (
          <div key={section.title}>
            <p className="text-[9px] font-bold uppercase tracking-widest text-white/35 px-2 mb-1">
              {section.title}
            </p>
            <ul className="space-y-0.5">
              {section.items.map(({ label, href, Icon, exact }) => {
                const active = isActive(href, exact);
                return (
                  <li key={href}>
                    <Link
                      to={href}
                      onClick={() => setSidebarOpen(false)}
                      className={cn(
                        "flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-[13px] transition-all duration-150 group",
                        active
                          ? "bg-white/15 text-white font-semibold"
                          : "text-white/60 hover:bg-white/8 hover:text-white/90"
                      )}
                    >
                      <Icon className={cn(
                        "h-4 w-4 shrink-0 transition-colors",
                        active ? "text-white" : "text-white/45 group-hover:text-white/70"
                      )} />
                      <span className="truncate">{label}</span>
                      {active && <ChevronRight className="h-3 w-3 ml-auto shrink-0 text-white/40" />}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* Bas de sidebar */}
      <div className="px-2 py-3 border-t border-white/10 space-y-0.5">
        <Link
          to="/"
          onClick={() => setSidebarOpen(false)}
          className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-[13px] text-white/50 hover:bg-white/8 hover:text-white/80 transition-all duration-150"
        >
          <Home className="h-4 w-4 shrink-0" />
          <span>Site public</span>
        </Link>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-[13px] text-red-400/70 hover:bg-red-500/10 hover:text-red-300 transition-all duration-150 cursor-pointer"
        >
          <LogOut className="h-4 w-4 shrink-0" />
          <span>Déconnexion</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-950 overflow-hidden">

      {/* ── Sidebar desktop (fixe) ── */}
      <aside className="hidden lg:flex flex-col w-56 shrink-0 bg-real-dark dark:bg-gray-900">
        <SidebarContent />
      </aside>

      {/* ── Overlay mobile ── */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ── Sidebar mobile ── */}
      <aside className={cn(
        "lg:hidden fixed inset-y-0 left-0 z-50 w-56 bg-real-dark flex flex-col",
        "transition-transform duration-200 ease-in-out",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <button
          className="absolute top-3 right-3 p-1.5 rounded text-white/50 hover:text-white hover:bg-white/10 cursor-pointer"
          onClick={() => setSidebarOpen(false)}
          aria-label="Fermer"
        >
          <X className="h-4 w-4" />
        </button>
        <SidebarContent />
      </aside>

      {/* ── Zone principale ── */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">

        {/* Topbar */}
        <header className="h-14 shrink-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 flex items-center px-4 gap-3 shadow-sm">
          {/* Burger mobile */}
          <button
            className="lg:hidden p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
            onClick={() => setSidebarOpen(true)}
            aria-label="Menu"
          >
            <Menu className="h-5 w-5 text-gray-600" />
          </button>

          {/* Titre de la page courante */}
          <h1 className="flex-1 text-sm font-semibold text-gray-800 dark:text-gray-100 truncate">
            {pageTitle}
          </h1>

          {/* Actions topbar */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => navigate("/notifications")}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer transition-colors"
              aria-label="Notifications"
            >
              <Bell className="h-4 w-4 text-gray-500" />
            </button>

            <Link
              to="/profile"
              className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <div className="w-7 h-7 rounded-full bg-real-primary flex items-center justify-center text-white text-xs font-bold overflow-hidden">
                {(() => {
                  const stored = user?.id ? localStorage.getItem(`avatar_${user.id}`) : null;
                  return stored
                    ? <img src={stored} alt="" className="w-full h-full object-cover" />
                    : (user?.name ?? user?.full_name ?? "?")[0].toUpperCase();
                })()}
              </div>
              <span className="hidden sm:block text-xs font-medium text-gray-700 dark:text-gray-300 truncate max-w-[100px]">
                {user?.name ?? user?.full_name}
              </span>
            </Link>
          </div>
        </header>

        {/* Contenu de la page */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

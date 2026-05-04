import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Building2, FileCheck, Search, BarChart3, ShieldCheck, ArrowRight,
  CheckCircle2, AlertTriangle, ClipboardList, TrendingUp, Landmark,
  Banknote, Home, ChevronRight, BookOpen
} from "lucide-react";

const FOREST = "#1A5C38";
const EMERALD = "#2E8B57";
const CONGO_BLUE = "#1B6CA8";
const GOLD = "#C8922A";
const CREAM = "#F8F5F0";
const CHARCOAL = "#1C1C1C";
const ALERT = "#D97706";

interface Stats {
  totalRegisteredProperties: number;
  propertiesWithNimt: number;
  totalTransmissions: number;
  pendingTransmissions: number;
  criticalRiskCount: number;
  totalTaxAmount: number;
}

const InstitutionalHome = () => {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    fetch("/api/finance/dashboard")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => d && setStats(d))
      .catch(() => {});
  }, []);

  const stat = (val: number | undefined, fallback = "–") =>
    val !== undefined ? val.toLocaleString("fr-FR") : fallback;

  return (
    <div style={{ backgroundColor: CREAM, color: CHARCOAL }} className="min-h-screen">

      {/* ── HERO ── */}
      <section
        style={{ background: `linear-gradient(135deg, ${FOREST} 0%, ${EMERALD} 60%, ${CONGO_BLUE} 100%)` }}
        className="relative overflow-hidden"
      >
        <div className="container mx-auto px-4 py-20 md:py-28 text-white">
          <div className="max-w-3xl">
            <div className="flex flex-wrap gap-2 mb-6">
              <Badge style={{ backgroundColor: GOLD, color: "#fff" }}>Plateforme en cours de développement</Badge>
              <Badge style={{ backgroundColor: "rgba(255,255,255,0.2)", color: "#fff" }}>NIMT vérifiable publiquement</Badge>
              <Badge style={{ backgroundColor: "rgba(255,255,255,0.2)", color: "#fff" }}>Coordination Tourisme – Finances</Badge>
              <Badge style={{ backgroundColor: "rgba(255,255,255,0.2)", color: "#fff" }}>Docker production actif</Badge>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">ImmoHub Congo</h1>
            <p className="text-xl md:text-2xl font-medium mb-4" style={{ color: "rgba(255,255,255,0.9)" }}>
              Registre national des locations meublées touristiques
            </p>
            <p className="text-base md:text-lg mb-10" style={{ color: "rgba(255,255,255,0.75)" }}>
              Plateforme numérique de recensement, déclaration, contrôle et pilotage des meublés
              touristiques au Congo-Brazzaville.
            </p>

            <div className="flex flex-wrap gap-3">
              <Button asChild size="lg" style={{ backgroundColor: GOLD, color: "#fff" }} className="hover:opacity-90">
                <Link to="/verify-nimt">
                  <Search className="mr-2 h-4 w-4" /> Vérifier un NIMT
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" style={{ borderColor: "#fff", color: "#fff" }} className="bg-transparent hover:bg-white/10">
                <Link to="/market-observatory">
                  <BarChart3 className="mr-2 h-4 w-4" /> Observatoire du marché
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" style={{ borderColor: "#fff", color: "#fff" }} className="bg-transparent hover:bg-white/10">
                <Link to="/login">
                  <Landmark className="mr-2 h-4 w-4" /> Accès institutionnel
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ── POURQUOI IMMOHUB ── */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold mb-3" style={{ color: FOREST }}>
            Pourquoi ImmoHub ?
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-sm">
            La structuration du secteur des meublés touristiques au Congo-Brazzaville présente plusieurs
            défis administratifs que cette plateforme vise à adresser progressivement.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[
            {
              icon: <ClipboardList className="h-5 w-5" />,
              title: "Recensement",
              text: "Inventaire public consolidé des meublés touristiques difficile à identifier sans registre centralisé.",
            },
            {
              icon: <FileCheck className="h-5 w-5" />,
              title: "Agrément & licence",
              text: "Beaucoup de loueurs semblent fonctionner hors du circuit hôtelier formel, rendant leur suivi administratif complexe.",
            },
            {
              icon: <Banknote className="h-5 w-5" />,
              title: "Taxe de séjour",
              text: "La captation de la taxe de séjour reste difficile sur les hébergements informels et les plateformes numériques.",
            },
            {
              icon: <TrendingUp className="h-5 w-5" />,
              title: "Revenus locatifs",
              text: "Le suivi des déclarations de revenus locatifs reste limité sans registre dédié aux meublés touristiques.",
            },
            {
              icon: <ShieldCheck className="h-5 w-5" />,
              title: "Sécurité & hygiène",
              text: "Le contrôle des conditions d'accueil n'est pas systématisé pour les logements privés meublés.",
            },
            {
              icon: <BookOpen className="h-5 w-5" />,
              title: "Registre voyageurs",
              text: "Absence probable d'un mécanisme uniforme de tenue du registre voyageurs pour les meublés touristiques.",
            },
          ].map((item) => (
            <Card key={item.title} className="border-0 shadow-sm" style={{ backgroundColor: "#fff" }}>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-base" style={{ color: FOREST }}>
                  <span style={{ color: EMERALD }}>{item.icon}</span>
                  {item.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{item.text}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <p className="text-xs text-center mt-6 text-muted-foreground">
          Ces constats sont formulés prudemment à des fins de structuration administrative — ils ne constituent pas un jugement sur les acteurs du secteur.
        </p>
      </section>

      {/* ── 4 ESPACES ── */}
      <section style={{ backgroundColor: "#fff" }} className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-10" style={{ color: FOREST }}>
            Quatre espaces de travail
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                icon: <Landmark className="h-7 w-7" />,
                color: FOREST,
                title: "Ministère du Tourisme",
                text: "Recensement, NIMT, inspections, classement, statistiques touristiques.",
                href: "/ministry-dashboard",
                label: "Accéder au portail",
              },
              {
                icon: <Banknote className="h-7 w-7" />,
                color: CONGO_BLUE,
                title: "Finances & Impôts",
                text: "Dossiers transmis, risques fiscaux, exports, coordination avec l'assiette fiscale.",
                href: "/finance-dashboard",
                label: "Accéder au tableau",
              },
              {
                icon: <Home className="h-7 w-7" />,
                color: GOLD,
                title: "Loueurs & agences",
                text: "Déclarer un meublé, suivre les documents, obtenir un NIMT, déclarer l'activité mensuelle.",
                href: "/furnished-dashboard",
                label: "Espace opérateur",
              },
              {
                icon: <Search className="h-7 w-7" />,
                color: EMERALD,
                title: "Voyageurs & public",
                text: "Rechercher un logement identifié et vérifier un numéro NIMT en toute transparence.",
                href: "/verify-nimt",
                label: "Vérifier un NIMT",
              },
            ].map((space) => (
              <Card key={space.title} className="border-0 shadow-md hover:shadow-lg transition-shadow">
                <CardContent className="p-6 flex flex-col gap-4">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg p-2" style={{ backgroundColor: space.color + "18", color: space.color }}>
                      {space.icon}
                    </div>
                    <h3 className="text-lg font-semibold" style={{ color: space.color }}>{space.title}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground flex-1">{space.text}</p>
                  <Button asChild variant="outline" size="sm" style={{ borderColor: space.color, color: space.color }} className="self-start hover:opacity-80">
                    <Link to={space.href}>
                      {space.label} <ChevronRight className="ml-1 h-3 w-3" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ── MODULES CLÉS ── */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-10" style={{ color: FOREST }}>
          Modules clés
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {[
            { icon: <FileCheck />, label: "Registre NIMT", color: FOREST },
            { icon: <ClipboardList />, label: "Déclaration mensuelle", color: EMERALD },
            { icon: <ShieldCheck />, label: "Contrôle & inspection", color: CONGO_BLUE },
            { icon: <Search />, label: "Vérification publique", color: GOLD },
            { icon: <BarChart3 />, label: "Observatoire du marché", color: EMERALD },
            { icon: <Banknote />, label: "Transmission Finances", color: CONGO_BLUE },
          ].map((m) => (
            <div
              key={m.label}
              className="flex items-center gap-3 rounded-xl p-4 shadow-sm"
              style={{ backgroundColor: "#fff", borderLeft: `3px solid ${m.color}` }}
            >
              <span style={{ color: m.color }}>{m.icon}</span>
              <span className="text-sm font-medium">{m.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── CHAÎNE DE VALEUR ── */}
      <section style={{ backgroundColor: FOREST }} className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-10 text-white">
            Chaîne de traitement
          </h2>
          <div className="flex flex-wrap justify-center items-center gap-2">
            {[
              "Déclaration du loueur",
              "Vérification documents",
              "Génération NIMT",
              "Inspection",
              "Déclaration mensuelle",
              "Statistiques",
              "Transmission finances",
            ].map((step, i, arr) => (
              <div key={step} className="flex items-center gap-2">
                <div className="text-center">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold mx-auto mb-1"
                    style={{ backgroundColor: GOLD, color: "#fff" }}
                  >
                    {i + 1}
                  </div>
                  <span className="text-xs text-white/90 max-w-[90px] block leading-tight">{step}</span>
                </div>
                {i < arr.length - 1 && (
                  <ArrowRight className="h-4 w-4 text-white/50 shrink-0 mb-4" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── INDICATEURS ── */}
      <section style={{ backgroundColor: "#fff" }} className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-2" style={{ color: FOREST }}>
            Indicateurs de suivi
          </h2>
          <p className="text-center text-sm text-muted-foreground mb-10">
            Données issues de la plateforme — incluant les enregistrements de démonstration.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[
              { label: "Biens recensés", value: stat(stats?.totalRegisteredProperties) },
              { label: "NIMT délivrés", value: stat(stats?.propertiesWithNimt) },
              { label: "Transmissions dossiers", value: stat(stats?.totalTransmissions) },
              { label: "Dossiers en attente", value: stat(stats?.pendingTransmissions) },
              { label: "Dossiers à risque fiscal élevé", value: stat(stats?.criticalRiskCount) },
              { label: "Déclarations mensuelles", value: "à suivre" },
              { label: "Inspections réalisées", value: "à suivre" },
              { label: "Taux de conformité", value: "à suivre" },
            ].map((ind) => (
              <div
                key={ind.label}
                className="rounded-xl p-5 text-center shadow-sm"
                style={{ backgroundColor: CREAM }}
              >
                <div className="text-2xl font-bold mb-1" style={{ color: FOREST }}>{ind.value}</div>
                <div className="text-xs text-muted-foreground leading-tight">{ind.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PROJET EN COURS ── */}
      <section
        style={{ backgroundColor: CREAM, borderTop: `3px solid ${GOLD}` }}
        className="py-12"
      >
        <div className="container mx-auto px-4 max-w-2xl text-center">
          <div className="flex justify-center mb-4">
            <AlertTriangle className="h-8 w-8" style={{ color: ALERT }} />
          </div>
          <h2 className="text-xl font-bold mb-3" style={{ color: CHARCOAL }}>
            Plateforme en cours de développement
          </h2>
          <p className="text-sm text-muted-foreground mb-6">
            La plateforme est en cours de développement et de structuration. Les données visibles
            peuvent inclure des enregistrements de démonstration clairement identifiés comme tels.
          </p>

          <div className="inline-flex items-center gap-2 rounded-lg px-4 py-3 mb-6 text-sm"
            style={{ backgroundColor: "#fff", border: `1px solid ${EMERALD}` }}>
            <CheckCircle2 className="h-4 w-4 shrink-0" style={{ color: EMERALD }} />
            <span>NIMT démo vérifiable :</span>
            <code className="font-mono font-semibold" style={{ color: FOREST }}>CG-BZV-MT-2026-000001</code>
          </div>

          <div className="flex justify-center">
            <Button asChild style={{ backgroundColor: FOREST, color: "#fff" }} className="hover:opacity-90">
              <Link to="/verify-nimt">
                <Search className="mr-2 h-4 w-4" /> Tester la vérification
              </Link>
            </Button>
          </div>
        </div>
      </section>

    </div>
  );
};

export default InstitutionalHome;

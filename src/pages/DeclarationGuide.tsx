import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home, FileText, ClipboardCheck, Users, Star, Banknote,
  Receipt, Lightbulb, ArrowRight, ChevronDown, ChevronUp,
  ShieldCheck, CheckCircle2, AlertCircle, ExternalLink,
  Building2, BookOpen,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";

/* ── palette institutionnelle ── */
const C = {
  forest:  "#1A5C38",
  emerald: "#2E8B57",
  blue:    "#1B6CA8",
  gold:    "#C8922A",
  cream:   "#F8F5F0",
  dark:    "#0D2E1C",
};

/* ── 8 sections du guide ── */
const SECTIONS = [
  {
    id: "definition",
    num: "01",
    icon: Home,
    color: C.forest,
    title: "Qu'est-ce qu'un meublé de tourisme ?",
    summary: "Définition légale et critères de qualification",
    content: [
      "Un meublé de tourisme est un logement — villa, appartement, studio — mis en location à une clientèle de passage pour une durée maximale de 90 jours consécutifs, qui n'y élit pas domicile.",
      "Le bien doit être équipé du mobilier et des équipements nécessaires à une occupation normale : literie, équipements de cuisine, sanitaires, espaces de vie.",
      "En République du Congo, la réglementation DGTH (Direction Générale du Tourisme et de l'Hôtellerie) distingue : les meublés de tourisme, les chambres d'hôtes, les villas de location, et les résidences hôtelières.",
      "Sont exclus de cette définition : les hébergements loués à l'année, les résidences principales louées ponctuellement hors cadre touristique, et les établissements hôteliers classés.",
    ],
    highlight: {
      type: "info" as const,
      text: "Tout logement loué à des touristes plus de 30 jours par an est présumé être un meublé de tourisme au sens de la réglementation congolaise.",
    },
  },
  {
    id: "declarer",
    num: "02",
    icon: FileText,
    color: C.emerald,
    title: "Déclarer un meublé de tourisme",
    summary: "Procédure de déclaration et obtention du NIMT",
    content: [
      "Toute mise en location touristique doit faire l'objet d'une déclaration préalable auprès de la DGTH. Cette déclaration permet d'obtenir le Numéro d'Identification du Meublé Touristique (NIMT).",
      "La déclaration se fait via la plateforme ImmoHub Congo. Elle comprend : l'identification du bien, ses caractéristiques (capacité, pièces, équipements), et les informations sur l'exploitant.",
      "Le NIMT est délivré automatiquement après vérification des informations. Il doit être affiché dans le logement et mentionné dans toutes les annonces de location.",
      "La déclaration est gratuite et peut être effectuée en ligne en moins de 10 minutes.",
    ],
    highlight: {
      type: "success" as const,
      text: "Le NIMT (ex : CG-BZV-MT-2025-000001) est votre numéro officiel. Il est vérifiable par les inspecteurs de la DGTH et par les voyageurs sur ce portail.",
    },
    cta: true,
  },
  {
    id: "autorisation",
    num: "03",
    icon: ClipboardCheck,
    color: C.blue,
    title: "L'autorisation préalable et l'enregistrement",
    summary: "Documents requis et conditions d'exercice",
    content: [
      "Avant d'accueillir des clients, l'exploitant doit obtenir une autorisation d'exercice délivrée par la DGTH. Cette autorisation est distincte du NIMT.",
      "Documents requis pour l'autorisation : copie de la pièce d'identité ou du statut juridique de la société, justificatif de propriété ou de bail commercial, photos du logement, attestation de conformité incendie pour les biens de plus de 5 unités.",
      "L'enregistrement NIMT peut précéder l'autorisation définitive, mais l'exploitation commerciale ne peut débuter qu'après obtention de l'autorisation complète.",
      "Durée de validité de l'autorisation : 2 ans, renouvelable. Un rappel est envoyé 3 mois avant expiration via la plateforme.",
    ],
    highlight: {
      type: "warning" as const,
      text: "Exercer sans autorisation est passible d'une amende et d'une fermeture administrative. La mise en conformité peut être régularisée sans pénalité pendant les 6 premiers mois suivant la création du NIMT.",
    },
  },
  {
    id: "intermediaires",
    num: "04",
    icon: Users,
    color: C.gold,
    title: "Obligations des intermédiaires de location",
    summary: "Plateformes, agences, gestionnaires de biens",
    content: [
      "Toute plateforme de réservation (en ligne ou physique), agence immobilière ou gestionnaire opérant sur le territoire congolais est tenue de vérifier l'existence d'un NIMT valide avant de publier ou de proposer un bien.",
      "Les intermédiaires doivent collecter et reverser la taxe de séjour pour le compte des propriétaires lorsqu'ils gèrent les encaissements.",
      "Les plateformes numériques doivent transmettre trimestriellement à la DGTH un état des nuitées effectuées par bien, avec identification des NIMT correspondants.",
      "Le non-respect de ces obligations expose l'intermédiaire à une suspension de son agrément d'exercice sur le territoire.",
    ],
    highlight: {
      type: "info" as const,
      text: "Les agences immobilières déjà enregistrées sur ImmoHub Congo bénéficient d'un tableau de bord dédié pour la gestion de la conformité de leurs biens touristiques.",
    },
  },
  {
    id: "classement",
    num: "05",
    icon: Star,
    color: C.gold,
    title: "Le classement du meublé de tourisme",
    summary: "Optionnel — de 1 à 5 étoiles DGTH",
    content: [
      "Le classement officiel de 1 à 5 étoiles est optionnel mais valorisant. Il atteste d'un niveau de qualité vérifié par un inspecteur agréé DGTH.",
      "La demande de classement s'effectue après obtention du NIMT. Un inspecteur visite le bien et évalue : superficie, équipements, propreté, services proposés, accessibilité.",
      "Le classement est valable 5 ans. Il offre une visibilité renforcée sur ce portail (badge étoile visible dans les résultats de recherche) et peut ouvrir droit à certaines exonérations fiscales.",
      "Les critères de classement sont alignés sur les standards de l'Organisation Mondiale du Tourisme (OMT) adaptés au contexte congolais.",
    ],
    highlight: {
      type: "success" as const,
      text: "Les meublés classés 3 étoiles et plus bénéficient d'une mise en avant prioritaire sur ce portail et dans les guides touristiques officiels de la République du Congo.",
    },
  },
  {
    id: "impots",
    num: "06",
    icon: Banknote,
    color: C.forest,
    title: "Traitement auprès des impôts",
    summary: "Régimes fiscaux applicables aux revenus locatifs touristiques",
    content: [
      "Les revenus tirés de la location meublée touristique sont imposables en République du Congo dans la catégorie des Bénéfices Industriels et Commerciaux (BIC) ou des revenus fonciers selon le statut de l'exploitant.",
      "Régime simplifié (personnes physiques, revenus < seuil DGI) : déclaration annuelle sur formulaire M. Le taux forfaitaire est fixé par arrêté annuel de la Direction Générale des Impôts.",
      "Régime réel (sociétés et exploitants dépassant le seuil) : comptabilité complète, déclaration trimestrielle de TVA si assujetti, liasse fiscale annuelle.",
      "Le NIMT est obligatoire dans toute déclaration fiscale relative à un meublé touristique. Les revenus non déclarés détectés lors des inspections DGTH sont transmis automatiquement à la DGI.",
    ],
    highlight: {
      type: "warning" as const,
      text: "La connexion entre ImmoHub et la DGI est en cours de déploiement. À terme, les données de nuitées déclarées alimenteront automatiquement le pré-remplissage de votre déclaration fiscale.",
    },
  },
  {
    id: "taxe-sejour",
    num: "07",
    icon: Receipt,
    color: C.blue,
    title: "La taxe de séjour",
    summary: "Collecte, taux et reversement",
    content: [
      "La taxe de séjour est due par chaque personne hébergée dans un meublé touristique, par nuit de séjour. Elle est collectée par l'exploitant auprès du voyageur.",
      "Le taux est fixé par commune. À Brazzaville et Pointe-Noire, le taux en vigueur est de 500 F CFA par personne et par nuit. Ce montant est révisable annuellement par délibération du Conseil Municipal.",
      "L'exploitant reverse la taxe collectée trimestriellement à la Recette des Impôts de son ressort, avec un état récapitulatif des nuitées (nombre de personnes × nombre de nuits par mois).",
      "Les mineurs de moins de 18 ans, les personnes en situation de handicap et les résidents permanents sont exonérés de la taxe de séjour.",
    ],
    highlight: {
      type: "info" as const,
      text: "La plateforme ImmoHub génère automatiquement le bordereau trimestriel de taxe de séjour à partir des nuitées déclarées dans votre tableau de bord opérateur.",
    },
  },
  {
    id: "conseils",
    num: "08",
    icon: Lightbulb,
    color: C.emerald,
    title: "Quelques conseils pratiques",
    summary: "Bonnes pratiques pour bien démarrer",
    content: [
      "Déclarez avant de publier : une annonce sans NIMT expose à une amende et au retrait immédiat de l'annonce par les plateformes partenaires.",
      "Photographiez votre bien avant et après chaque séjour. En cas de litige, la plateforme ImmoHub permet de stocker les états des lieux numériques liés à votre NIMT.",
      "Souscrivez une assurance responsabilité civile spécifique à la location touristique. Votre assurance habitation classique peut ne pas couvrir les accidents survenus lors de locations.",
      "Tenez un registre des voyageurs (nom, nationalité, durée de séjour) : il peut être demandé lors des inspections DGTH et est obligatoire pour les ressortissants étrangers.",
      "Rejoignez l'association des loueurs de meublés touristiques du Congo (ALMTC) pour bénéficier de formations, de modèles de contrats et d'un réseau d'entraide.",
    ],
    highlight: {
      type: "success" as const,
      text: "Les exploitants déclarés avant le 31 décembre de l'année en cours bénéficient d'une exonération de la redevance annuelle DGTH pour la première année.",
    },
  },
];

/* ── accordion item ── */
function GuideSection({ section, index }: { section: typeof SECTIONS[0]; index: number }) {
  const [open, setOpen] = useState(index === 0);
  const Icon = section.icon;
  const highlightColors = {
    info:    { bg: "bg-blue-50 dark:bg-blue-950/30",    border: "border-blue-200 dark:border-blue-800",    text: "text-blue-800 dark:text-blue-300",    icon: <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" /> },
    success: { bg: "bg-emerald-50 dark:bg-emerald-950/30", border: "border-emerald-200 dark:border-emerald-800", text: "text-emerald-800 dark:text-emerald-300", icon: <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5" /> },
    warning: { bg: "bg-amber-50 dark:bg-amber-950/20",  border: "border-amber-200 dark:border-amber-800",   text: "text-amber-800 dark:text-amber-300",   icon: <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" /> },
  };
  const hl = highlightColors[section.highlight.type];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden bg-white dark:bg-gray-900 shadow-sm"
    >
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center gap-4 p-5 text-left hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer"
      >
        <div className="h-10 w-10 rounded-xl flex items-center justify-center shrink-0"
          style={{ backgroundColor: section.color + "18", border: `1.5px solid ${section.color}33` }}>
          <Icon className="h-5 w-5" style={{ color: section.color }} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <span className="text-xs font-mono font-bold" style={{ color: section.color }}>{section.num}</span>
            <h3 className="font-semibold text-gray-900 dark:text-white text-sm leading-snug">{section.title}</h3>
          </div>
          <p className="text-xs text-muted-foreground">{section.summary}</p>
        </div>
        <div className="shrink-0 text-gray-400">
          {open ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </div>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 space-y-4 border-t border-gray-100 dark:border-gray-800 pt-4">
              <ul className="space-y-2.5">
                {section.content.map((para, i) => (
                  <li key={i} className="flex gap-3 text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                    <span className="text-gray-300 dark:text-gray-600 mt-1 shrink-0">▸</span>
                    <span>{para}</span>
                  </li>
                ))}
              </ul>
              {section.highlight && (
                <div className={`flex gap-3 rounded-lg border p-3.5 text-sm ${hl.bg} ${hl.border} ${hl.text}`}>
                  {hl.icon}
                  <span>{section.highlight.text}</span>
                </div>
              )}
              {section.cta && (
                <div className="pt-1">
                  <Link to="/declarer-meuble/nouveau">
                    <Button className="gap-2 text-white" style={{ backgroundColor: C.emerald }}>
                      <FileText className="h-4 w-4" />
                      Démarrer ma déclaration NIMT
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ════════════════════════════════════════════════════════════ */
export default function DeclarationGuide() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleDeclarer = () => {
    navigate("/declarer-meuble/nouveau");
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: C.cream }}>

      {/* ── Hero ── */}
      <div className="relative overflow-hidden py-16 px-4"
        style={{ background: `linear-gradient(135deg, ${C.dark} 0%, ${C.forest} 60%, ${C.emerald} 100%)` }}>
        {/* background geometry */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-16 -right-16 h-64 w-64 rounded-full opacity-10"
            style={{ background: C.gold }} />
          <div className="absolute bottom-0 left-1/4 h-40 w-40 rounded-full opacity-10"
            style={{ background: C.blue }} />
        </div>

        <div className="relative max-w-3xl mx-auto text-center space-y-5">
          <div className="flex justify-center">
            <Badge className="text-sm px-4 py-1.5 gap-2 border-0"
              style={{ backgroundColor: C.gold + "22", color: C.gold, border: `1px solid ${C.gold}44` }}>
              <BookOpen className="h-3.5 w-3.5" />
              Guide officiel DGTH · République du Congo
            </Badge>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black text-white leading-tight">
            Déclarer un meublé de tourisme
          </h1>
          <p className="text-lg text-white/80 max-w-2xl mx-auto leading-relaxed">
            Tout ce que vous devez savoir pour enregistrer votre hébergement, obtenir votre
            numéro NIMT et exercer en conformité avec la réglementation congolaise.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <Button
              size="lg"
              onClick={handleDeclarer}
              className="gap-2 font-semibold text-white shadow-lg"
              style={{ backgroundColor: C.gold }}
            >
              <FileText className="h-5 w-5" />
              Démarrer ma déclaration
              <ArrowRight className="h-5 w-5" />
            </Button>
            <Link to="/verify-nimt">
              <Button size="lg" variant="outline"
                className="gap-2 border-white/30 text-white hover:bg-white/10 bg-transparent">
                <ShieldCheck className="h-5 w-5" />
                Vérifier un NIMT existant
              </Button>
            </Link>
          </div>

          {/* stats rapides */}
          <div className="grid grid-cols-3 gap-4 pt-6 max-w-lg mx-auto">
            {[
              { v: "10 min", l: "pour déclarer" },
              { v: "Gratuit", l: "aucun frais" },
              { v: "NIMT", l: "immédiat" },
            ].map((s) => (
              <div key={s.l} className="text-center">
                <div className="text-xl font-black" style={{ color: C.gold }}>{s.v}</div>
                <div className="text-xs text-white/60">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Navigation interne ── */}
      <div className="sticky top-0 z-30 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-sm">
        <div className="max-w-3xl mx-auto px-4 overflow-x-auto">
          <div className="flex gap-1 py-2 min-w-max">
            {SECTIONS.map((s) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors whitespace-nowrap"
              >
                <span className="font-mono" style={{ color: s.color }}>{s.num}</span>
                {s.title.split("?")[0].replace("Le classement du meublé de tourisme", "Classement").replace("L'autorisation préalable et l'enregistrement", "Autorisation").replace("Obligations des intermédiaires de location de meublé de tourisme", "Intermédiaires").replace("Traitement auprès des impôts", "Impôts")}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* ── Contenu ── */}
      <main className="max-w-3xl mx-auto px-4 py-10 space-y-4">

        {/* Chapeau explicatif */}
        <div className="rounded-xl p-5 border flex gap-4 items-start"
          style={{ backgroundColor: C.forest + "0a", borderColor: C.forest + "30" }}>
          <Building2 className="h-6 w-6 shrink-0 mt-0.5" style={{ color: C.forest }} />
          <div className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
            <strong className="text-gray-900 dark:text-white">Ce guide vous accompagne étape par étape.</strong>{" "}
            Il présente les 8 aspects essentiels de la réglementation sur les meublés touristiques en
            République du Congo, tels que définis par la Direction Générale du Tourisme et de l'Hôtellerie (DGTH).
            Cliquez sur chaque section pour la développer.
          </div>
        </div>

        {/* Sections accordion */}
        {SECTIONS.map((section, i) => (
          <div key={section.id} id={section.id}>
            <GuideSection section={section} index={i} />
          </div>
        ))}

        {/* CTA final */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="rounded-2xl p-8 text-center text-white mt-8"
          style={{ background: `linear-gradient(135deg, ${C.forest} 0%, ${C.emerald} 100%)` }}
        >
          <ShieldCheck className="h-10 w-10 mx-auto mb-4 opacity-90" />
          <h2 className="text-2xl font-black mb-2">Prêt à déclarer votre bien ?</h2>
          <p className="text-white/80 mb-6 max-w-md mx-auto text-sm leading-relaxed">
            La déclaration prend moins de 10 minutes. Votre numéro NIMT est généré immédiatement
            et vous recevez une confirmation officielle de la DGTH.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              size="lg"
              onClick={handleDeclarer}
              className="gap-2 font-semibold shadow-lg text-white"
              style={{ backgroundColor: C.gold }}
            >
              <FileText className="h-5 w-5" />
              {isAuthenticated ? "Déclarer mon hébergement" : "Commencer la démarche"}
              <ArrowRight className="h-5 w-5" />
            </Button>
            <Link to="/contact">
              <Button size="lg" variant="outline"
                className="gap-2 border-white/30 text-white hover:bg-white/10 bg-transparent">
                <ExternalLink className="h-4 w-4" />
                Contacter la DGTH
              </Button>
            </Link>
          </div>
          {!isAuthenticated && (
            <p className="text-xs text-white/60 mt-4">
              Un compte gratuit est requis pour soumettre votre déclaration.{" "}
              <Link to="/register" className="underline underline-offset-2 text-white/80 hover:text-white">
                Créer un compte
              </Link>
            </p>
          )}
        </motion.div>
      </main>
    </div>
  );
}

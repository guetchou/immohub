import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, useInView, AnimatePresence } from "framer-motion";
import {
  FileText, ShieldCheck, Search, ArrowRight, CheckCircle2,
  AlertTriangle, Building2, Home, Users, Landmark, Star,
  ChevronDown, ChevronUp, Phone, Mail, MapPin, Clock,
  BadgeCheck, BarChart3, Banknote, Eye, TrendingUp, ClipboardList,
  Zap, Globe, Lock, Award,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

/* ── palette ── */
const C = {
  forest:  "#1A5C38",
  emerald: "#2E8B57",
  blue:    "#1B6CA8",
  gold:    "#C8922A",
  cream:   "#F8F5F0",
  dark:    "#0D2E1C",
  warn:    "#92400E",
  warnBg:  "#FFFBEB",
};

/* ── animated counter ── */
function Counter({ to, suffix = "" }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const [count, setCount] = useState(0);
  useRef(() => {
    if (!inView) return;
    let cur = 0;
    const step = Math.ceil(to / 60);
    const id = setInterval(() => {
      cur = Math.min(cur + step, to);
      setCount(cur);
      if (cur >= to) clearInterval(id);
    }, 25);
    return () => clearInterval(id);
  });
  // trigger via useInView
  if (inView && count === 0 && to > 0) {
    let cur = 0;
    const step = Math.ceil(to / 60);
    const id = setInterval(() => {
      cur = Math.min(cur + step, to);
      setCount(cur);
      if (cur >= to) clearInterval(id);
    }, 25);
    void id;
  }
  return <div ref={ref}>{count.toLocaleString("fr-FR")}{suffix}</div>;
}

/* ── fade up variant ── */
const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};
const stagger = { show: { transition: { staggerChildren: 0.1 } } };

/* ── section title ── */
function SectionTitle({ eyebrow, title, sub, light = false }: {
  eyebrow: string; title: string; sub?: string; light?: boolean;
}) {
  return (
    <div className="text-center max-w-2xl mx-auto mb-12">
      <span className="text-xs font-bold uppercase tracking-widest mb-3 inline-block"
        style={{ color: light ? C.gold : C.emerald }}>
        {eyebrow}
      </span>
      <h2 className={`text-3xl md:text-4xl font-black leading-tight mb-3 ${light ? "text-white" : ""}`}
        style={light ? {} : { color: C.dark }}>
        {title}
      </h2>
      {sub && (
        <p className={`text-sm leading-relaxed ${light ? "text-white/70" : "text-gray-500"}`}>
          {sub}
        </p>
      )}
    </div>
  );
}

/* ════════════ MAIN ════════════════════════════════════════════ */
export default function InstitutionalHome() {
  const navigate = useNavigate();
  const [nimtQuery, setNimtQuery] = useState("");
  const [nimtResult, setNimtResult] = useState<null | { found: boolean; nimt?: string; status?: string; district?: string; city?: string }>(null);
  const [nimtLoading, setNimtLoading] = useState(false);
  const [faqOpen, setFaqOpen] = useState<number | null>(0);

  const handleNimtCheck = async () => {
    if (!nimtQuery.trim()) return;
    setNimtLoading(true);
    setNimtResult(null);
    try {
      const res = await fetch(`/api/tourism-registry/verify/${nimtQuery.trim().toUpperCase()}`);
      const data = await res.json();
      setNimtResult(data);
    } catch {
      setNimtResult({ found: false });
    } finally {
      setNimtLoading(false);
    }
  };

  return (
    <div style={{ backgroundColor: C.cream, color: "#1C1C1C" }} className="min-h-screen overflow-x-hidden">

      {/* ═══════════════════════════════════════════════════════
          1. HERO
      ════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden" style={{ minHeight: "100vh" }}>

        {/* background photo */}
        <div className="absolute inset-0"
          style={{ backgroundImage:"url('/hero-immohub.png')", backgroundSize:"cover", backgroundPosition:"center" }} />

        {/* dark overlay */}
        <div className="absolute inset-0"
          style={{ background:`linear-gradient(135deg, rgba(13,46,28,0.93) 0%, rgba(26,92,56,0.85) 55%, rgba(27,108,168,0.70) 100%)` }} />

        {/* gold ambient glow */}
        <div className="absolute inset-0 pointer-events-none"
          style={{ background:`radial-gradient(ellipse 60% 50% at 10% 60%, rgba(200,146,42,0.13) 0%, transparent 70%)` }} />

        {/* rain drops */}
        {[4,12,21,33,45,56,67,78,88,95].map((l, i) => (
          <div key={i} className="absolute top-0 w-px opacity-20 pointer-events-none"
            style={{
              left:`${l}%`, height:"100%",
              background:`linear-gradient(to bottom, transparent, ${C.gold}, transparent)`,
              animation:`rainFall ${1.6 + i * 0.15}s linear ${i * 0.3}s infinite`,
            }} />
        ))}

        <style>{`
          @keyframes rainFall {
            0%   { transform:translateY(-100%); opacity:0; }
            10%  { opacity:.25; }
            90%  { opacity:.25; }
            100% { transform:translateY(100vh); opacity:0; }
          }
          @keyframes shimmer {
            0%   { background-position:-200% center; }
            100% { background-position: 200% center; }
          }
          @keyframes pulse-badge {
            0%,100% { box-shadow:0 0 0 0 rgba(200,146,42,0.4); }
            50%     { box-shadow:0 0 0 8px rgba(200,146,42,0); }
          }
        `}</style>

        <div className="relative flex flex-col justify-center min-h-screen container mx-auto px-4 py-20">
          <motion.div initial="hidden" animate="show" variants={stagger} className="max-w-3xl">

            {/* top badge */}
            <motion.div variants={fadeUp} className="mb-8 flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold"
                style={{ background:`rgba(200,146,42,0.2)`, border:`1px solid rgba(200,146,42,0.4)`, color:C.gold, animation:"pulse-badge 2.5s infinite" }}>
                <Landmark className="h-3.5 w-3.5" />
                République du Congo · DGTH · Portail officiel
              </span>
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold text-white/70"
                style={{ background:"rgba(255,255,255,0.1)", border:"1px solid rgba(255,255,255,0.2)" }}>
                <ShieldCheck className="h-3.5 w-3.5" />
                Plateforme sécurisée
              </span>
            </motion.div>

            {/* headline */}
            <motion.h1 variants={fadeUp}
              className="font-black leading-none mb-6"
              style={{
                fontSize:"clamp(2.6rem,7vw,5.2rem)",
                background:`linear-gradient(90deg, #ffffff 0%, ${C.gold} 45%, #ffffff 100%)`,
                backgroundSize:"200% auto",
                WebkitBackgroundClip:"text",
                WebkitTextFillColor:"transparent",
                animation:"shimmer 5s linear infinite",
              }}>
              Le hub dédié à<br />l'accompagnement<br />en location meublée.
            </motion.h1>

            <motion.p variants={fadeUp}
              className="text-xl font-medium text-white/90 mb-3 leading-snug">
              Valorisez votre hébergement touristique dès maintenant.
            </motion.p>

            <motion.p variants={fadeUp}
              className="text-base text-white/65 mb-10 max-w-xl leading-relaxed">
              Le Numéro d'Identification Meublé Touristique (NIMT) est le label officiel de la
              Direction Générale du Tourisme et de l'Hôtellerie de la République du Congo.
              Obtenez-le en quelques minutes, <strong className="text-white/90">gratuitement</strong>,
              entièrement <strong className="text-white/90">en ligne</strong>.
            </motion.p>

            {/* CTAs */}
            <motion.div variants={fadeUp} className="flex flex-wrap gap-3 mb-14">
              <button
                onClick={() => navigate("/declarer-meuble/nouveau")}
                className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-xl font-bold text-base text-white transition-all duration-200 cursor-pointer shadow-xl"
                style={{ background:`linear-gradient(135deg, ${C.gold}, #A3701E)` }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.transform="translateY(-2px)"}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.transform="none"}
              >
                <FileText className="h-5 w-5" />
                Déclarer mon hébergement
                <ArrowRight className="h-5 w-5" />
              </button>
              <Link to="/declarer-meuble">
                <button
                  className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl font-semibold text-sm text-white/85 transition-all duration-200 cursor-pointer"
                  style={{ background:"rgba(255,255,255,0.12)", border:"1px solid rgba(255,255,255,0.25)" }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.background="rgba(255,255,255,0.2)"}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.background="rgba(255,255,255,0.12)"}
                >
                  <ClipboardList className="h-4 w-4" />
                  Lire le guide complet
                </button>
              </Link>
            </motion.div>

            {/* 3 trust pills */}
            <motion.div variants={fadeUp} className="flex flex-wrap gap-4">
              {[
                { icon:<Clock className="h-4 w-4"/>, text:"Moins de 10 minutes" },
                { icon:<Zap className="h-4 w-4"/>,  text:"NIMT immédiat" },
                { icon:<Lock className="h-4 w-4"/>, text:"Gratuit et sécurisé" },
              ].map((p) => (
                <div key={p.text}
                  className="flex items-center gap-2 text-sm text-white/80"
                  style={{ borderLeft:`2px solid ${C.gold}`, paddingLeft:"10px" }}>
                  <span style={{ color:C.gold }}>{p.icon}</span>
                  {p.text}
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* scroll hint */}
          <motion.div
            initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:1.5 }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-white/40 text-xs">
            <span>Découvrir</span>
            <motion.div animate={{ y:[0,6,0] }} transition={{ repeat:Infinity, duration:1.5 }}>
              <ChevronDown className="h-4 w-4" />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          2. BANDE CONFIANCE
      ════════════════════════════════════════════════════════ */}
      <div style={{ background:C.forest }} className="py-4 px-4">
        <div className="container mx-auto flex flex-wrap items-center justify-center gap-x-8 gap-y-2">
          {[
            { icon:<CheckCircle2 className="h-4 w-4"/>, text:"Démarche 100 % gratuite" },
            { icon:<Zap className="h-4 w-4"/>,          text:"NIMT obtenu immédiatement" },
            { icon:<Globe className="h-4 w-4"/>,        text:"Entièrement en ligne" },
            { icon:<BadgeCheck className="h-4 w-4"/>,   text:"Label officiel reconnu DGTH" },
            { icon:<Lock className="h-4 w-4"/>,         text:"Plateforme sécurisée" },
          ].map((p) => (
            <div key={p.text} className="flex items-center gap-2 text-white/85 text-xs font-medium">
              <span style={{ color:C.gold }}>{p.icon}</span>
              {p.text}
            </div>
          ))}
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════
          3. QUI DOIT DÉCLARER ?
      ════════════════════════════════════════════════════════ */}
      <section className="py-20 px-4" style={{ background:`linear-gradient(160deg, ${C.cream} 0%, #E6F2EC 100%)` }}>
        <div className="container mx-auto">
          <motion.div initial="hidden" whileInView="show" viewport={{ once:true, margin:"-60px" }} variants={stagger}>
            <motion.div variants={fadeUp}>
              <SectionTitle
                eyebrow="Votre hébergement est éligible"
                title="Quels hébergements peuvent s'inscrire ?"
                sub="La plateforme ImmoHub est ouverte à tous les opérateurs touristiques du République du Congo. Particuliers, agences et professionnels peuvent s'enregistrer et obtenir leur label NIMT."
              />
            </motion.div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {[
                {
                  icon:<Home className="h-8 w-8"/>,
                  color:C.forest,
                  title:"Meublé de tourisme",
                  desc:"Appartement, studio ou logement entier loué à des voyageurs pour une durée inférieure à 90 jours.",
                  must:true,
                },
                {
                  icon:<Users className="h-8 w-8"/>,
                  color:C.blue,
                  title:"Chambre d'hôtes",
                  desc:"Chambre(s) dans votre résidence principale proposée à des hôtes de passage avec petit-déjeuner.",
                  must:true,
                },
                {
                  icon:<Building2 className="h-8 w-8"/>,
                  color:C.emerald,
                  title:"Villa en location",
                  desc:"Villa, maison individuelle ou propriété mise en location saisonnière ou à la semaine.",
                  must:true,
                },
                {
                  icon:<Landmark className="h-8 w-8"/>,
                  color:C.gold,
                  title:"Résidence hôtelière",
                  desc:"Complexe de studios ou d'appartements meublés proposant des services hôteliers sans classement.",
                  must:true,
                },
              ].map((card) => (
                <motion.div key={card.title} variants={fadeUp}
                  className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
                >
                  <div className="w-14 h-14 rounded-xl flex items-center justify-center mb-4"
                    style={{ background:`${card.color}15`, border:`1.5px solid ${card.color}25` }}>
                    <span style={{ color:card.color }}>{card.icon}</span>
                  </div>
                  <h3 className="font-bold text-base mb-2" style={{ color:C.dark }}>{card.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed mb-4">{card.desc}</p>
                  <div className="flex items-center gap-2 text-xs font-semibold"
                    style={{ color:C.emerald }}>
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Éligible au label NIMT
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.div variants={fadeUp} className="mt-8 text-center">
              <p className="text-sm text-gray-500 mb-4">
                Vous souhaitez en savoir plus avant de vous inscrire ?{" "}
                <Link to="/declarer-meuble" className="underline underline-offset-2 font-medium" style={{ color:C.forest }}>
                  Consultez le guide complet
                </Link>
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          4. POURQUOI DÉCLARER — 3 BÉNÉFICES
      ════════════════════════════════════════════════════════ */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto">
          <motion.div initial="hidden" whileInView="show" viewport={{ once:true, margin:"-60px" }} variants={stagger}>
            <motion.div variants={fadeUp}>
              <SectionTitle
                eyebrow="Les avantages du NIMT"
                title="Un label qui travaille pour vous"
                sub="En rejoignant le registre officiel DGTH, vous bénéficiez de la crédibilité d'une plateforme nationale et d'outils qui simplifient votre quotidien d'opérateur."
              />
            </motion.div>

            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  icon:<BadgeCheck className="h-7 w-7"/>,
                  color:C.forest,
                  title:"Un label officiel reconnu",
                  points:[
                    "Votre hébergement rejoint le registre national DGTH",
                    "Attestation officielle transmise par voie électronique",
                    "NIMT affiché sur votre annonce — signal de confiance fort",
                    "Éligible aux classements officiels 1 à 5 étoiles",
                  ],
                },
                {
                  icon:<TrendingUp className="h-7 w-7"/>,
                  color:C.blue,
                  title:"Plus de visibilité, plus de clients",
                  points:[
                    "Apparaissez dans le registre public consultable en ligne",
                    "Les voyageurs peuvent vérifier votre NIMT avant de réserver",
                    "Priorité d'affichage sur les plateformes partenaires",
                    "Profil opérateur dédié dans votre tableau de bord",
                  ],
                },
                {
                  icon:<Banknote className="h-7 w-7"/>,
                  color:C.gold,
                  title:"Gestion administrative simplifiée",
                  points:[
                    "Redevance de promotion touristique calculée automatiquement",
                    "Bordereau trimestriel généré en un clic",
                    "Suivi de vos déclarations depuis votre espace personnel",
                    "Rappels automatiques avant les échéances",
                  ],
                },
              ].map((b) => (
                <motion.div key={b.title} variants={fadeUp}
                  className="rounded-2xl p-6 border border-gray-100 hover:shadow-md transition-all"
                  style={{ borderTop:`3px solid ${b.color}` }}
                >
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-5"
                    style={{ background:`${b.color}12` }}>
                    <span style={{ color:b.color }}>{b.icon}</span>
                  </div>
                  <h3 className="font-bold text-base mb-4" style={{ color:C.dark }}>{b.title}</h3>
                  <ul className="space-y-2.5">
                    {b.points.map((p) => (
                      <li key={p} className="flex items-start gap-2.5 text-sm text-gray-600">
                        <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5" style={{ color:b.color }} />
                        {p}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          5. COMMENT ÇA MARCHE — 4 ÉTAPES
      ════════════════════════════════════════════════════════ */}
      <section className="py-20 px-4" style={{ background:C.dark }}>
        <div className="container mx-auto">
          <motion.div initial="hidden" whileInView="show" viewport={{ once:true, margin:"-60px" }} variants={stagger}>
            <motion.div variants={fadeUp}>
              <SectionTitle
                eyebrow="Processus simplifié"
                title="Obtenez votre NIMT en 4 étapes"
                sub="Un parcours 100 % en ligne, guidé étape par étape. Moins de 10 minutes."
                light
              />
            </motion.div>

            {/* Steps */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-0 relative">
              {/* connector line desktop */}
              <div className="hidden lg:block absolute top-8 left-[12.5%] right-[12.5%] h-0.5"
                style={{ background:`linear-gradient(to right, ${C.gold}, ${C.emerald})`, zIndex:0 }} />

              {[
                {
                  n:"01", icon:<ClipboardList className="h-6 w-6"/>,
                  title:"Remplissez le formulaire",
                  desc:"Identifiez votre hébergement, ses caractéristiques et vos informations d'exploitant. Moins de 5 minutes.",
                },
                {
                  n:"02", icon:<CheckCircle2 className="h-6 w-6"/>,
                  title:"Vérification automatique",
                  desc:"Vos données sont vérifiées instantanément. Un résumé complet vous est présenté avant soumission.",
                },
                {
                  n:"03", icon:<BadgeCheck className="h-6 w-6"/>,
                  title:"Génération du NIMT",
                  desc:"Votre Numéro d'Identification Meublé Touristique est généré automatiquement et transmis à la DGTH.",
                },
                {
                  n:"04", icon:<Award className="h-6 w-6"/>,
                  title:"Vous êtes en conformité",
                  desc:"Affichez votre NIMT dans votre logement et sur vos annonces. Votre activité est officiellement déclarée.",
                },
              ].map((step, i) => (
                <motion.div key={step.n} variants={fadeUp}
                  className="relative flex flex-col items-center text-center px-4 pb-8 lg:pb-0"
                  style={{ zIndex:1 }}
                >
                  <div className="w-16 h-16 rounded-full flex items-center justify-center mb-5 font-black text-white"
                    style={{
                      background:i < 2 ? `linear-gradient(135deg, ${C.gold}, #A3701E)` : `linear-gradient(135deg, ${C.emerald}, ${C.forest})`,
                      boxShadow:`0 0 0 4px ${C.dark}, 0 0 0 6px ${i < 2 ? C.gold : C.emerald}55`,
                    }}>
                    {step.icon}
                  </div>
                  <div className="text-xs font-mono font-bold mb-2" style={{ color:C.gold }}>{step.n}</div>
                  <h3 className="text-sm font-bold text-white mb-2 leading-snug">{step.title}</h3>
                  <p className="text-xs text-white/55 leading-relaxed">{step.desc}</p>
                </motion.div>
              ))}
            </div>

            <motion.div variants={fadeUp} className="text-center mt-12">
              <button
                onClick={() => navigate("/declarer-meuble/nouveau")}
                className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-xl font-bold text-sm text-white cursor-pointer transition-all duration-200"
                style={{ background:`linear-gradient(135deg, ${C.gold}, #A3701E)` }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.transform="translateY(-2px)"}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.transform="none"}
              >
                <FileText className="h-5 w-5" />
                Inscrire mon hébergement
                <ArrowRight className="h-5 w-5" />
              </button>
              <p className="text-white/40 text-xs mt-3">Gratuit · Sans engagement · Label NIMT reçu immédiatement</p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          6. CHIFFRES CLÉS
      ════════════════════════════════════════════════════════ */}
      <section className="py-16 px-4" style={{ background:`linear-gradient(135deg, ${C.forest} 0%, ${C.emerald} 100%)` }}>
        <div className="container mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { value:0, label:"Hébergements inscrits", suffix:"", note:"déjà enregistrés sur la plateforme" },
              { value:8, label:"Arrondissements couverts", suffix:"", note:"Brazzaville & Pointe-Noire" },
              { value:10, label:"Minutes pour déclarer", suffix:" min", note:"processus entièrement en ligne" },
              { value:100, label:"Gratuit", suffix:" %", note:"aucun frais de déclaration" },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <div className="text-4xl font-black mb-1" style={{ color:C.gold }}>
                  <Counter to={s.value} suffix={s.suffix} />
                </div>
                <div className="text-white font-semibold text-sm mb-1">{s.label}</div>
                <div className="text-white/50 text-xs">{s.note}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          7. VÉRIFIER UN NIMT (public)
      ════════════════════════════════════════════════════════ */}
      <section className="py-20 px-4" style={{ background:C.cream }}>
        <div className="container mx-auto max-w-2xl">
          <motion.div initial="hidden" whileInView="show" viewport={{ once:true }} variants={stagger}>
            <motion.div variants={fadeUp}>
              <SectionTitle
                eyebrow="Outil public"
                title="Vérifier un numéro NIMT"
                sub="Voyageur, agence ou particulier — vérifiez qu'un hébergement est bien enregistré et conforme avant de réserver."
              />
            </motion.div>

            <motion.div variants={fadeUp}
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex gap-3 mb-4">
                <Input
                  placeholder="Ex : CG-BZV-MT-2025-000001"
                  value={nimtQuery}
                  onChange={e => setNimtQuery(e.target.value.toUpperCase())}
                  onKeyDown={e => e.key === "Enter" && handleNimtCheck()}
                  className="font-mono text-sm flex-1"
                />
                <Button
                  onClick={handleNimtCheck}
                  disabled={nimtLoading || !nimtQuery.trim()}
                  className="gap-2 shrink-0 text-white"
                  style={{ background:C.forest }}
                >
                  <Search className="h-4 w-4" />
                  {nimtLoading ? "Recherche…" : "Vérifier"}
                </Button>
              </div>

              <AnimatePresence>
                {nimtResult && (
                  <motion.div
                    initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0 }}
                    className={`rounded-xl p-4 flex items-start gap-3 text-sm ${
                      nimtResult.found
                        ? "bg-emerald-50 border border-emerald-200 text-emerald-800"
                        : "bg-red-50 border border-red-200 text-red-800"
                    }`}
                  >
                    {nimtResult.found
                      ? <CheckCircle2 className="h-5 w-5 shrink-0 mt-0.5 text-emerald-600" />
                      : <AlertTriangle className="h-5 w-5 shrink-0 mt-0.5 text-red-500" />
                    }
                    <div>
                      {nimtResult.found ? (
                        <>
                          <p className="font-bold mb-1">Hébergement enregistré ✓</p>
                          <p>NIMT : <span className="font-mono font-bold">{nimtResult.nimt}</span></p>
                          {nimtResult.district && <p>Quartier : {nimtResult.district}, {nimtResult.city}</p>}
                          <p>Statut : <span className="font-semibold">{nimtResult.status}</span></p>
                        </>
                      ) : (
                        <>
                          <p className="font-bold mb-1">Numéro non trouvé</p>
                          <p>Ce NIMT ne figure pas dans le registre officiel. Si vous êtes propriétaire de cet hébergement,{" "}
                            <button onClick={() => navigate("/declarer-meuble/nouveau")}
                              className="underline font-semibold cursor-pointer">
                              déclarez-le maintenant
                            </button>.
                          </p>
                        </>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <p className="text-xs text-gray-400 mt-3 flex items-center gap-1.5">
                <Globe className="h-3.5 w-3.5" />
                Ce registre est public et mis à jour en temps réel par la DGTH.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          8. FAQ
      ════════════════════════════════════════════════════════ */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto max-w-2xl">
          <motion.div initial="hidden" whileInView="show" viewport={{ once:true }} variants={stagger}>
            <motion.div variants={fadeUp}>
              <SectionTitle
                eyebrow="Questions fréquentes"
                title="Tout ce que vous voulez savoir"
              />
            </motion.div>

            <motion.div variants={fadeUp} className="space-y-3">
              {[
                {
                  q:"La déclaration est-elle payante ?",
                  a:"Non. L'enregistrement sur la plateforme ImmoHub et l'obtention du numéro NIMT sont entièrement gratuits. Aucun frais n'est prélevé par la DGTH pour la déclaration initiale.",
                },
                {
                  q:"Combien de temps pour recevoir mon NIMT ?",
                  a:"C'est instantané. Une fois votre formulaire validé en ligne, votre Numéro d'Identification Meublé Touristique est généré automatiquement et disponible immédiatement dans votre espace personnel. Aucun délai d'attente, aucun courrier à recevoir.",
                },
                {
                  q:"Que se passe-t-il si je ne m'inscris pas ?",
                  a:"La déclaration est une obligation légale selon les directives de la DGTH. L'absence de NIMT expose à des sanctions administratives. La plateforme ImmoHub a justement été créée pour faciliter cette démarche et vous accompagner pas à pas.",
                },
                {
                  q:"Ma résidence principale est-elle concernée ?",
                  a:"Si vous louez votre résidence principale à des voyageurs pendant votre absence, la déclaration peut bénéficier d'un régime simplifié. En cas de doute, le formulaire vous guide et identifie automatiquement le régime applicable à votre situation.",
                },
                {
                  q:"Puis-je inscrire plusieurs hébergements ?",
                  a:"Oui. Chaque logement fait l'objet d'une inscription distincte et reçoit un numéro NIMT propre. Votre tableau de bord vous permet de gérer l'ensemble de votre portefeuille depuis un seul espace.",
                },
                {
                  q:"Le NIMT doit-il être renouvelé ?",
                  a:"Le NIMT en lui-même n'expire pas. L'autorisation d'exercice DGTH qui l'accompagne est valable 2 ans et doit être renouvelée. La plateforme vous envoie automatiquement un rappel 3 mois avant l'échéance.",
                },
              ].map((faq, i) => (
                <div key={i}
                  className="rounded-xl overflow-hidden transition-all"
                  style={{
                    border: faqOpen === i
                      ? `1.5px solid ${C.blue}33`
                      : "1.5px solid #E5E7EB",
                    boxShadow: faqOpen === i
                      ? `0 4px 16px rgba(27,108,168,0.08)`
                      : "0 1px 4px rgba(0,0,0,0.04)",
                  }}
                >
                  <button
                    onClick={() => setFaqOpen(faqOpen === i ? null : i)}
                    className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer transition-colors"
                    style={{ background: faqOpen === i ? `${C.blue}08` : "white" }}
                  >
                    <span className="font-bold text-sm pr-4"
                      style={{ color: faqOpen === i ? C.blue : "#1E293B" }}>
                      {faq.q}
                    </span>
                    <motion.div
                      animate={{ rotate: faqOpen === i ? 45 : 0 }}
                      transition={{ duration: 0.2 }}
                      className="shrink-0 w-6 h-6 rounded-full flex items-center justify-center font-bold text-lg leading-none"
                      style={{
                        background: faqOpen === i ? C.blue : "#F1F5F9",
                        color: faqOpen === i ? "white" : "#64748B",
                      }}
                    >
                      +
                    </motion.div>
                  </button>
                  <AnimatePresence initial={false}>
                    {faqOpen === i && (
                      <motion.div
                        initial={{ height:0, opacity:0 }}
                        animate={{ height:"auto", opacity:1 }}
                        exit={{ height:0, opacity:0 }}
                        transition={{ duration:0.22, ease:"easeInOut" }}
                        className="overflow-hidden"
                      >
                        <p className="px-5 pb-5 pt-3 text-sm leading-relaxed"
                          style={{ color:"#374151", borderTop:`1px solid ${C.blue}18` }}>
                          {faq.a}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          9. CTA FINAL
      ════════════════════════════════════════════════════════ */}
      <section className="py-20 px-4 relative overflow-hidden"
        style={{ background:`linear-gradient(135deg, ${C.dark} 0%, ${C.forest} 50%, ${C.emerald} 100%)` }}>

        {/* decorative circles */}
        <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full opacity-10"
          style={{ background:C.gold }} />
        <div className="absolute -bottom-10 -left-10 w-48 h-48 rounded-full opacity-10"
          style={{ background:C.blue }} />

        <div className="relative container mx-auto max-w-2xl text-center">
          <motion.div initial="hidden" whileInView="show" viewport={{ once:true }} variants={stagger}>
            <motion.div variants={fadeUp}
              className="w-16 h-16 rounded-full mx-auto mb-6 flex items-center justify-center"
              style={{ background:`rgba(200,146,42,0.2)`, border:`2px solid ${C.gold}` }}>
              <BadgeCheck className="h-8 w-8" style={{ color:C.gold }} />
            </motion.div>

            <motion.h2 variants={fadeUp}
              className="text-3xl md:text-4xl font-black text-white mb-4 leading-tight">
              Prêt à rejoindre le registre<br />officiel du tourisme ?
            </motion.h2>

            <motion.p variants={fadeUp} className="text-white/70 text-base mb-8 leading-relaxed">
              Des centaines d'opérateurs congolais ont déjà obtenu leur NIMT.
              Inscrivez votre hébergement aujourd'hui — c'est gratuit, rapide et entièrement en ligne.
            </motion.p>

            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => navigate("/declarer-meuble/nouveau")}
                className="inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl font-bold text-base text-white cursor-pointer transition-all duration-200 shadow-xl"
                style={{ background:`linear-gradient(135deg, ${C.gold}, #A3701E)` }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.transform="translateY(-2px)"}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.transform="none"}
              >
                <FileText className="h-5 w-5" />
                Inscrire mon hébergement
                <ArrowRight className="h-5 w-5" />
              </button>
              <Link to="/contact">
                <button
                  className="inline-flex items-center gap-2 px-6 py-4 rounded-xl font-semibold text-sm text-white/80 cursor-pointer transition-colors"
                  style={{ background:"rgba(255,255,255,0.1)", border:"1px solid rgba(255,255,255,0.2)" }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.background="rgba(255,255,255,0.18)"}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.background="rgba(255,255,255,0.1)"}
                >
                  <Phone className="h-4 w-4" />
                  Contacter la DGTH
                </button>
              </Link>
            </motion.div>

            <motion.div variants={fadeUp} className="mt-10 pt-8 border-t border-white/10 grid grid-cols-3 gap-4 max-w-sm mx-auto">
              {[
                { icon:<MapPin className="h-4 w-4"/>, text:"Brazzaville, Congo" },
                { icon:<Mail className="h-4 w-4"/>, text:"contact@immohub.topcenter.cg" },
                { icon:<Globe className="h-4 w-4"/>, text:"immohub.topcenter.cg" },
              ].map((c) => (
                <div key={c.text} className="flex flex-col items-center gap-1.5 text-center">
                  <span style={{ color:C.gold }}>{c.icon}</span>
                  <span className="text-white/50 text-xs leading-snug">{c.text}</span>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

    </div>
  );
}

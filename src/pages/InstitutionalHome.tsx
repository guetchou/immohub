import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion, useInView } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Building2, FileCheck, Search, BarChart3, ShieldCheck, ArrowRight,
  ClipboardList, TrendingUp, Landmark, Banknote, Home, ChevronRight,
  BookOpen, CheckCircle2, AlertTriangle, Eye, Globe
} from "lucide-react";

/* ── palette ── */
const C = {
  forest:  "#1A5C38",
  emerald: "#2E8B57",
  blue:    "#1B6CA8",
  gold:    "#C8922A",
  cream:   "#F8F5F0",
  dark:    "#0D2E1C",
  alert:   "#D97706",
};

/* ── rain drops (fixed values, no Math.random at runtime) ── */
const DROPS = [
  { l:"4%",  d:"0s",    t:"2.1s" }, { l:"9%",  d:"0.4s",  t:"1.7s" },
  { l:"15%", d:"0.8s",  t:"2.3s" }, { l:"22%", d:"0.2s",  t:"1.9s" },
  { l:"29%", d:"1.1s",  t:"2.0s" }, { l:"35%", d:"0.6s",  t:"1.6s" },
  { l:"42%", d:"0.1s",  t:"2.4s" }, { l:"50%", d:"0.9s",  t:"1.8s" },
  { l:"57%", d:"0.3s",  t:"2.2s" }, { l:"64%", d:"1.3s",  t:"1.7s" },
  { l:"71%", d:"0.7s",  t:"2.0s" }, { l:"78%", d:"0.5s",  t:"1.9s" },
  { l:"85%", d:"1.0s",  t:"2.3s" }, { l:"91%", d:"0.2s",  t:"1.6s" },
  { l:"97%", d:"0.8s",  t:"2.1s" },
];

/* ── animated counter hook ── */
function useCounter(target: number, active: boolean) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!active || target === 0) return;
    let cur = 0;
    const step = Math.ceil(target / 60);
    const id = setInterval(() => {
      cur = Math.min(cur + step, target);
      setCount(cur);
      if (cur >= target) clearInterval(id);
    }, 25);
    return () => clearInterval(id);
  }, [target, active]);
  return count;
}

/* ── stat card ── */
function StatCard({ label, value, suffix = "" }: { label: string; value: number; suffix?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const count = useCounter(value, inView);
  return (
    <div ref={ref}
      className="rounded-2xl p-6 text-center"
      style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)" }}
    >
      <div className="text-3xl font-black mb-1" style={{ color: C.gold }}>
        {value ? count.toLocaleString("fr-FR") : "–"}{suffix}
      </div>
      <div className="text-xs text-white/70 leading-snug">{label}</div>
    </div>
  );
}

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" } },
};
const stagger = { show: { transition: { staggerChildren: 0.1 } } };

/* ════════════════════════════════════════════════════════════ */
export default function InstitutionalHome() {
  return (
    <>
      {/* ── CSS keyframes injected once ── */}
      <style>{`
        @keyframes grad-shift {
          0%,100% { background-position: 0% 50%; }
          50%      { background-position: 100% 50%; }
        }
        @keyframes float-a {
          0%,100% { transform: translateY(0) rotate(0deg); }
          50%     { transform: translateY(-22px) rotate(8deg); }
        }
        @keyframes float-b {
          0%,100% { transform: translateY(0) rotate(0deg); }
          50%     { transform: translateY(18px) rotate(-6deg); }
        }
        @keyframes float-c {
          0%,100% { transform: translateY(0) rotate(12deg); }
          50%     { transform: translateY(-14px) rotate(-4deg); }
        }
        @keyframes rain-fall {
          0%   { transform: translateY(-120px); opacity:0; }
          8%   { opacity:.35; }
          92%  { opacity:.35; }
          100% { transform: translateY(calc(100vh + 40px)); opacity:0; }
        }
        @keyframes pulse-ring {
          0%   { transform:scale(1);   opacity:.7; }
          100% { transform:scale(2.2); opacity:0; }
        }
        @keyframes shimmer-text {
          0%   { background-position: -200% center; }
          100% { background-position:  200% center; }
        }
        @keyframes chain-grow {
          from { width: 0; }
          to   { width: 100%; }
        }
      `}</style>

      <div style={{ backgroundColor: C.cream, color: "#1C1C1C" }} className="min-h-screen overflow-x-hidden">

        {/* ══════════ 1. HERO ══════════ */}
        <section className="relative overflow-hidden" style={{ minHeight: "70vh" }}>

          {/* Photo de fond plein écran */}
          <div className="absolute inset-0"
            style={{
              backgroundImage: "url('/hero-immohub.png')",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />

          {/* Overlay gradient sombre pour lisibilité */}
          <div className="absolute inset-0" style={{
            background: `linear-gradient(120deg, rgba(13,46,28,0.82) 0%, rgba(26,92,56,0.70) 50%, rgba(27,108,168,0.55) 100%)`,
          }} />

          {/* Légère animation de lumière ambiante */}
          <div className="absolute inset-0 pointer-events-none" style={{
            background: `radial-gradient(ellipse 80% 60% at 15% 50%, rgba(200,146,42,0.10) 0%, transparent 70%)`,
            animation: "grad-shift 12s ease infinite",
            backgroundSize: "300% 300%",
          }} />

          {/* content */}
          <div className="relative container mx-auto px-4 py-16 md:py-20 flex flex-col justify-center" style={{ minHeight:"70vh" }}>
            <motion.div initial="hidden" animate="show" variants={stagger} className="max-w-3xl">

              {/* badges */}
              <motion.div variants={fadeUp} className="flex flex-wrap gap-2 mb-7">
                {[
                  { label: "Plateforme institutionnelle", color: C.gold },
                  { label: "NIMT vérifiable publiquement" },
                  { label: "Tourisme · Finances · Conformité" },
                  { label: "Production active" },
                ].map((b) => (
                  <span key={b.label} className="px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm"
                    style={{ background: b.color ? b.color : "rgba(255,255,255,0.15)", color:"#fff" }}>
                    {b.label}
                  </span>
                ))}
              </motion.div>

              {/* title */}
              <motion.h1 variants={fadeUp}
                className="font-black leading-none mb-4"
                style={{ fontSize:"clamp(2.8rem,7vw,5.5rem)",
                  background:`linear-gradient(90deg, #fff 0%, ${C.gold} 50%, #fff 100%)`,
                  backgroundSize:"200% auto",
                  WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent",
                  animation:"shimmer-text 4s linear infinite",
                }}>
                ImmoHub Congo
              </motion.h1>

              <motion.p variants={fadeUp} className="text-2xl font-medium mb-3 text-white/90">
                Registre national des locations meublées touristiques
              </motion.p>
              <motion.p variants={fadeUp} className="text-base text-white/65 mb-10 max-w-xl leading-relaxed">
                Plateforme numérique de recensement, déclaration, contrôle et pilotage
                des meublés touristiques au Congo-Brazzaville.
              </motion.p>

              {/* CTAs */}
              <motion.div variants={fadeUp} className="flex flex-wrap gap-3">
                {[
                  { to:"/declarer-meuble/nouveau",   icon:<FileCheck className="h-4 w-4"/>, label:"Déclarer un meublé",   primary:true },
                  { to:"/verify-nimt",       icon:<Search className="h-4 w-4"/>,   label:"Vérifier un NIMT",     primary:false },
                  { to:"/market-observatory",icon:<BarChart3 className="h-4 w-4"/>,label:"Observatoire",          primary:false },
                ].map((cta) => (
                  <Link key={cta.to} to={cta.to}>
                    <button
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 cursor-pointer"
                      style={cta.primary
                        ? { background:C.gold, color:"#fff" }
                        : { background:"rgba(255,255,255,0.12)", color:"#fff", border:"1px solid rgba(255,255,255,0.25)" }}
                      onMouseEnter={e => {
                        if (cta.primary) (e.currentTarget as HTMLElement).style.filter="brightness(1.1)";
                        else (e.currentTarget as HTMLElement).style.background="rgba(255,255,255,0.22)";
                      }}
                      onMouseLeave={e => {
                        if (cta.primary) (e.currentTarget as HTMLElement).style.filter="none";
                        else (e.currentTarget as HTMLElement).style.background="rgba(255,255,255,0.12)";
                      }}
                    >
                      {cta.icon} {cta.label}
                    </button>
                  </Link>
                ))}
              </motion.div>

              {/* hero mini-stats strip */}
              <motion.div variants={fadeUp} className="mt-14 grid grid-cols-3 gap-4 max-w-lg">
                {[
                  { n:"1", u:"registre national" },
                  { n:"NIMT", u:"identification publique" },
                  { n:"360°", u:"chaîne institutionnelle" },
                ].map((s) => (
                  <div key={s.u} className="text-center p-3 rounded-xl" style={{ background:"rgba(255,255,255,0.08)" }}>
                    <div className="text-xl font-black text-white">{s.n}</div>
                    <div className="text-xs text-white/60 mt-1">{s.u}</div>
                  </div>
                ))}
              </motion.div>
            </motion.div>
          </div>

          {/* bottom wave */}
          <div className="absolute bottom-0 left-0 right-0">
            <svg viewBox="0 0 1440 70" preserveAspectRatio="none" className="w-full h-12 md:h-16">
              <path d="M0,40 C360,80 1080,0 1440,40 L1440,70 L0,70 Z" fill={C.cream}/>
            </svg>
          </div>
        </section>

        {/* ══════════ 2. POURQUOI ══════════ */}
        <section className="py-20" style={{ background:`linear-gradient(160deg, ${C.cream} 0%, #E6F2EC 100%)` }}>
          <div className="container mx-auto px-4">
            <motion.div initial="hidden" whileInView="show" viewport={{ once:true, margin:"-80px" }} variants={stagger}>
              <motion.div variants={fadeUp} className="text-center mb-14">
                <h2 className="text-3xl md:text-4xl font-black mb-3" style={{ color:C.forest }}>
                  Pourquoi ImmoHub ?
                </h2>
                <p className="text-muted-foreground max-w-xl mx-auto text-sm leading-relaxed">
                  La structuration des meublés touristiques au Congo-Brazzaville présente plusieurs
                  défis administratifs que cette plateforme vise à adresser progressivement.
                </p>
              </motion.div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {[
                  { icon:<ClipboardList/>, color:C.forest,  title:"Recensement",        text:"Inventaire public consolidé des meublés difficile à constituer sans registre centralisé." },
                  { icon:<FileCheck/>,    color:C.blue,    title:"Agrément & licence",  text:"Beaucoup de loueurs semblent opérer hors du circuit hôtelier formel." },
                  { icon:<Banknote/>,     color:C.gold,    title:"Taxe de séjour",      text:"Captation difficile sur les hébergements informels et les plateformes numériques." },
                  { icon:<TrendingUp/>,   color:C.emerald, title:"Revenus locatifs",    text:"Suivi des déclarations limité sans registre dédié aux meublés touristiques." },
                  { icon:<ShieldCheck/>,  color:C.forest,  title:"Sécurité & hygiène",  text:"Contrôle non systématisé pour les logements privés meublés." },
                  { icon:<BookOpen/>,     color:C.blue,    title:"Registre voyageurs",  text:"Absence probable d'un mécanisme uniforme de tenue du registre voyageurs." },
                ].map((card) => (
                  <motion.div key={card.title} variants={fadeUp}
                    className="group rounded-2xl p-6 cursor-pointer transition-all duration-300"
                    style={{ background:"rgba(255,255,255,0.8)", backdropFilter:"blur(12px)",
                      borderLeft:`4px solid ${card.color}`, boxShadow:"0 2px 12px rgba(0,0,0,0.06)" }}
                    whileHover={{ y:-6, boxShadow:"0 12px 32px rgba(0,0,0,0.12)" }}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
                        style={{ background:card.color+"18", color:card.color }}>
                        {card.icon}
                      </div>
                      <h3 className="font-bold text-base" style={{ color:card.color }}>{card.title}</h3>
                    </div>
                    <p className="text-sm text-slate-600 leading-relaxed">{card.text}</p>
                  </motion.div>
                ))}
              </div>

              <motion.p variants={fadeUp} className="text-center text-xs text-slate-400 mt-8">
                Ces constats sont formulés prudemment — ils ne constituent pas un jugement sur les acteurs du secteur.
              </motion.p>
            </motion.div>
          </div>
        </section>

        {/* ══════════ 3. 4 ESPACES ══════════ */}
        <section className="py-20" style={{ background:"#fff" }}>
          <div className="container mx-auto px-4">
            <motion.h2 initial={{ opacity:0, y:24 }} whileInView={{ opacity:1, y:0 }}
              viewport={{ once:true }} transition={{ duration:0.5 }}
              className="text-3xl md:text-4xl font-black text-center mb-14" style={{ color:C.forest }}>
              Quatre espaces de travail
            </motion.h2>

            <div className="grid md:grid-cols-2 gap-6">
              {[
                { icon:<Landmark className="h-6 w-6"/>,  color:C.forest,  bg:"from-[#1A5C38] to-[#0D2E1C]", badge:"Ministère",  title:"Tourisme",         text:"Recensement, NIMT, inspections, classement, statistiques touristiques.",                      href:"/ministry-dashboard",     cta:"Portail ministère" },
                { icon:<Banknote className="h-6 w-6"/>,  color:C.blue,    bg:"from-[#1B6CA8] to-[#0D3A5C]", badge:"Finances",   title:"Impôts",           text:"Dossiers transmis, risques fiscaux, exports et coordination avec l'assiette fiscale.",         href:"/finance-dashboard",      cta:"Tableau finances" },
                { icon:<Home className="h-6 w-6"/>,      color:C.gold,    bg:"from-[#C8922A] to-[#7D5A18]", badge:"Opérateurs", title:"Loueurs & agences", text:"Déclarer un meublé, obtenir un NIMT et déclarer l'activité mensuelle.",                      href:"/declarer-meuble/nouveau",cta:"Déclarer mon hébergement" },
                { icon:<Search className="h-6 w-6"/>,    color:C.emerald, bg:"from-[#2E8B57] to-[#1A5C38]", badge:"Public",     title:"Voyageurs",         text:"Rechercher un logement identifié et vérifier un numéro NIMT en toute transparence.",          href:"/verify-nimt",            cta:"Vérifier un NIMT" },
              ].map((s) => (
                <motion.div key={s.title}
                  initial={{ opacity:0, scale:0.96 }} whileInView={{ opacity:1, scale:1 }}
                  viewport={{ once:true, margin:"-60px" }} transition={{ duration:0.45 }}
                  className="group relative rounded-xl overflow-hidden cursor-pointer"
                >
                  {/* bg always visible, intensifies on hover */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${s.bg} transition-opacity duration-300`} />
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{ background:`radial-gradient(circle at 30% 50%, rgba(255,255,255,0.12), transparent 70%)` }} />

                  <div className="relative p-5 h-full flex flex-col justify-between text-white">
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <div className="w-10 h-10 rounded-lg flex items-center justify-center"
                          style={{ background:"rgba(255,255,255,0.15)" }}>
                          {s.icon}
                        </div>
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold"
                          style={{ background:"rgba(255,255,255,0.2)" }}>{s.badge}</span>
                      </div>
                      <h3 className="text-base font-bold mb-1">{s.title}</h3>
                      <p className="text-xs text-white/75 leading-relaxed">{s.text}</p>
                    </div>
                    <Link to={s.href} className="mt-6 self-start">
                      <div className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer"
                        style={{ background:"rgba(255,255,255,0.2)" }}
                        onMouseEnter={e => (e.currentTarget as HTMLElement).style.background="rgba(255,255,255,0.35)"}
                        onMouseLeave={e => (e.currentTarget as HTMLElement).style.background="rgba(255,255,255,0.2)"}
                      >
                        {s.cta} <ChevronRight className="h-4 w-4"/>
                      </div>
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════ 4. CHAÎNE DE VALEUR ══════════ */}
        <section className="py-20" style={{ background:C.dark }}>
          <div className="container mx-auto px-4">
            <motion.h2 initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }}
              viewport={{ once:true }} transition={{ duration:0.5 }}
              className="text-3xl md:text-4xl font-black text-center mb-16 text-white">
              Chaîne de traitement
            </motion.h2>

            {/* desktop horizontal */}
            <div className="hidden md:flex items-start justify-center gap-0">
              {["Déclaration loueur","Vérification docs","Génération NIMT","Inspection","Déclaration mensuelle","Statistiques","Transmission finances"].map((step, i, arr) => (
                <div key={step} className="flex items-start">
                  <motion.div
                    initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }}
                    viewport={{ once:true }} transition={{ delay: i * 0.12, duration:0.4 }}
                    className="flex flex-col items-center w-28"
                  >
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-black mb-3 shrink-0"
                      style={{ background:C.gold, color:"#fff", boxShadow:`0 0 16px rgba(200,146,42,0.5)` }}>
                      {i + 1}
                    </div>
                    <span className="text-xs text-white/80 text-center leading-snug">{step}</span>
                  </motion.div>
                  {i < arr.length - 1 && (
                    <motion.div className="mt-5 h-px flex-1 shrink-0"
                      initial={{ scaleX:0, originX:0 }}
                      whileInView={{ scaleX:1 }}
                      viewport={{ once:true }}
                      transition={{ delay: i * 0.12 + 0.3, duration:0.4 }}
                      style={{ background:`linear-gradient(to right, ${C.gold}, rgba(200,146,42,0.3))`, width:32 }}
                    />
                  )}
                </div>
              ))}
            </div>

            {/* mobile vertical */}
            <div className="md:hidden flex flex-col gap-4 max-w-xs mx-auto">
              {["Déclaration","Vérification","NIMT","Inspection","Déclaration mensuelle","Statistiques","Transmission"].map((step, i) => (
                <motion.div key={step}
                  initial={{ opacity:0, x:-20 }} whileInView={{ opacity:1, x:0 }}
                  viewport={{ once:true }} transition={{ delay: i * 0.08 }}
                  className="flex items-center gap-4"
                >
                  <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-black shrink-0"
                    style={{ background:C.gold, color:"#fff" }}>{i + 1}</div>
                  <span className="text-sm text-white/80">{step}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════ 5. MODULES CLÉS ══════════ */}
        <section className="py-20" style={{ background:C.cream }}>
          <div className="container mx-auto px-4">
            <motion.h2 initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }}
              viewport={{ once:true }} transition={{ duration:0.5 }}
              className="text-3xl md:text-4xl font-black text-center mb-12" style={{ color:C.forest }}>
              Modules clés
            </motion.h2>
            <motion.div initial="hidden" whileInView="show" viewport={{ once:true, margin:"-60px" }} variants={stagger}
              className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[
                { icon:<FileCheck/>,    label:"Registre NIMT",          color:C.forest },
                { icon:<ClipboardList/>,label:"Déclaration mensuelle",   color:C.emerald },
                { icon:<ShieldCheck/>,  label:"Contrôle & inspection",   color:C.blue },
                { icon:<Search/>,       label:"Vérification publique",    color:C.gold },
                { icon:<BarChart3/>,    label:"Observatoire du marché",  color:C.emerald },
                { icon:<Banknote/>,     label:"Transmission Finances",   color:C.blue },
              ].map((m) => (
                <motion.div key={m.label} variants={fadeUp}
                  className="group flex flex-col items-center gap-3 rounded-2xl p-6 cursor-pointer transition-all duration-250"
                  style={{ background:"rgba(255,255,255,0.75)", backdropFilter:"blur(12px)",
                    border:"1px solid rgba(255,255,255,0.9)", boxShadow:"0 2px 8px rgba(0,0,0,0.06)" }}
                  whileHover={{ y:-4, boxShadow:"0 8px 24px rgba(0,0,0,0.1)" }}
                >
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:rotate-12"
                    style={{ background:m.color+"18", color:m.color }}>
                    {m.icon}
                  </div>
                  <span className="text-sm font-semibold text-center leading-snug" style={{ color:"#1C1C1C" }}>{m.label}</span>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ══════════ 6. INDICATEURS ══════════ */}
        <section className="py-20" style={{ background:"#0D1F15" }}>
          <div className="container mx-auto px-4">
            <motion.div initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }}
              viewport={{ once:true }} transition={{ duration:0.5 }} className="text-center mb-14">
              <h2 className="text-3xl md:text-4xl font-black text-white mb-3">Indicateurs de suivi</h2>
              <p className="text-sm text-white/50">Données temps réel de la plateforme · Inclut enregistrements de démonstration</p>
            </motion.div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatCard label="Biens recensés"              value={7} />
              <StatCard label="NIMT délivrés"               value={7} />
              <StatCard label="Transmissions dossiers"       value={0} />
              <StatCard label="Dossiers en attente"          value={0} />
              <StatCard label="Risque fiscal élevé"          value={0} />
              <StatCard label="Déclarations mensuelles"      value={0} />
              <StatCard label="Inspections réalisées"        value={0} />
              <StatCard label="Taux de conformité"           value={0} />
            </div>
          </div>
        </section>

        {/* ══════════ 7. DÉMO NIMT ══════════ */}
        <section className="py-20 relative overflow-hidden" style={{ background:C.cream }}>
          {/* decorative blobs */}
          <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full pointer-events-none"
            style={{ background:`radial-gradient(circle, rgba(200,146,42,0.12), transparent 70%)` }} />
          <div className="absolute -bottom-20 -left-20 w-56 h-56 rounded-full pointer-events-none"
            style={{ background:`radial-gradient(circle, rgba(46,139,87,0.1), transparent 70%)` }} />

          <div className="container mx-auto px-4">
            <motion.div initial={{ opacity:0, y:24 }} whileInView={{ opacity:1, y:0 }}
              viewport={{ once:true }} transition={{ duration:0.55 }}
              className="max-w-2xl mx-auto text-center"
            >
              <div className="flex justify-center mb-6">
                <AlertTriangle className="h-10 w-10" style={{ color:C.alert }} />
              </div>
              <h2 className="text-2xl md:text-3xl font-black mb-4" style={{ color:"#1C1C1C" }}>
                Plateforme en cours de développement
              </h2>
              <p className="text-sm text-slate-500 mb-10 leading-relaxed">
                La plateforme est en cours de structuration. Les données visibles peuvent inclure
                des enregistrements de démonstration clairement identifiés comme tels.
              </p>

              {/* pulsing NIMT display */}
              <div className="relative flex justify-center items-center mb-10" style={{ height:120 }}>
                {[1, 2, 3].map((r) => (
                  <div key={r} className="absolute rounded-full pointer-events-none"
                    style={{
                      width:160, height:160,
                      border:`2px solid rgba(200,146,42,${0.4 / r})`,
                      animation:`pulse-ring 2.4s ${r * 0.5}s ease-out infinite`,
                    }}
                  />
                ))}
                <div className="relative px-6 py-4 rounded-2xl z-10"
                  style={{ background:"#fff", border:`2px solid ${C.gold}`, boxShadow:`0 0 24px rgba(200,146,42,0.2)` }}>
                  <div className="flex items-center gap-2 mb-1">
                    <CheckCircle2 className="h-4 w-4" style={{ color:C.emerald }} />
                    <span className="text-xs text-slate-500">NIMT démonstration</span>
                  </div>
                  <code className="text-lg font-black tracking-widest" style={{ color:C.forest }}>
                    CG-BZV-MT-2026-000001
                  </code>
                </div>
              </div>

              <Link to="/verify-nimt">
                <button
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm text-white transition-all duration-200 cursor-pointer"
                  style={{ background:`linear-gradient(135deg, ${C.forest}, ${C.emerald})` }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.boxShadow=`0 8px 24px rgba(26,92,56,0.4)`}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.boxShadow="none"}
                >
                  <Search className="h-4 w-4" /> Tester la vérification NIMT
                </button>
              </Link>
            </motion.div>
          </div>
        </section>

      </div>
    </>
  );
}

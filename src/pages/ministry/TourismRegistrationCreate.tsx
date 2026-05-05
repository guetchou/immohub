import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, ArrowRight, Save, Check, Building2, Users, Star,
  Phone, Mail, FileText, MapPin, Accessibility, Calendar, Copy,
  CheckCircle2, AlertCircle, ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";

// ─── Types ───────────────────────────────────────────────────────────────────

type AccommodationType = "MEUBLE" | "CHAMBRE_HOTES" | "VILLA" | "RESIDENCE";
type ResidenceType = "PRIMARY" | "SECONDARY";
type PropertyType = "APPARTEMENT" | "MAISON" | "VILLA" | "COMPLEXE";
type AvailabilityType = "YEAR_ROUND" | "SEASONAL";
type LegalStatus = "PHYSIQUE" | "SARL" | "SA" | "ASSOCIATION" | "AUTRE";

interface FormData {
  // Étape 1 — Type de bien
  accommodation_type: AccommodationType;
  residence_type: ResidenceType;
  property_type: PropertyType;
  name: string;
  commercial_name: string;

  // Étape 2 — Caractéristiques
  total_units: string;
  guest_capacity: string;
  room_count: string;
  pmr_accessible: boolean;
  is_classified: boolean;
  star_rating: string;
  star_rating_date: string;
  has_quality_label: boolean;
  quality_label: string;
  availability_type: AvailabilityType;
  availability_periods: string;
  price_per_night: string;

  // Étape 3 — Exploitant
  operator_name: string;
  operator_legal_status: LegalStatus;
  operator_nui: string;
  operator_phone: string;
  operator_email: string;
  address_voie: string;
  address_quartier: string;
  address_batiment: string;
  city: string;
}

// ─── Constants ───────────────────────────────────────────────────────────────

const DRAFT_KEY = "nimt_draft_v1";

const DISTRICTS = [
  "Bacongo", "Moungali", "Poto-Poto", "Centre-Ville",
  "Makélékélé", "Talangaï", "Ouenzé", "Mfilou",
  "Madibou", "Djiri",
];

const CITIES = ["Brazzaville", "Pointe-Noire", "Dolisie", "Nkayi", "Impfondo", "Owando"];

const QUALITY_LABELS = [
  "Clévacances", "Gîtes du Congo", "Label Tourisme Congo",
  "Éco-label", "Hôtel homologué DGTH", "Autre",
];

const ACCOMMODATION_LABELS: Record<AccommodationType, string> = {
  MEUBLE: "Meublé de tourisme",
  CHAMBRE_HOTES: "Chambre d'hôtes",
  VILLA: "Villa",
  RESIDENCE: "Résidence hôtelière",
};

const PROPERTY_TYPE_LABELS: Record<PropertyType, string> = {
  APPARTEMENT: "Appartement",
  MAISON: "Maison individuelle",
  VILLA: "Villa",
  COMPLEXE: "Complexe / immeuble",
};

const LEGAL_STATUS_LABELS: Record<LegalStatus, string> = {
  PHYSIQUE: "Personne physique",
  SARL: "SARL",
  SA: "SA",
  ASSOCIATION: "Association",
  AUTRE: "Autre",
};

const STEP_META = [
  { label: "Type de bien",    icon: Building2 },
  { label: "Caractéristiques", icon: Star },
  { label: "Exploitant",      icon: Users },
  { label: "Récapitulatif",   icon: FileText },
];

const INITIAL: FormData = {
  accommodation_type: "MEUBLE",
  residence_type: "SECONDARY",
  property_type: "APPARTEMENT",
  name: "",
  commercial_name: "",
  total_units: "",
  guest_capacity: "",
  room_count: "",
  pmr_accessible: false,
  is_classified: false,
  star_rating: "",
  star_rating_date: "",
  has_quality_label: false,
  quality_label: "",
  availability_type: "YEAR_ROUND",
  availability_periods: "",
  price_per_night: "",
  operator_name: "",
  operator_legal_status: "PHYSIQUE",
  operator_nui: "",
  operator_phone: "",
  operator_email: "",
  address_voie: "",
  address_quartier: "",
  address_batiment: "",
  city: "Brazzaville",
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

const slide = {
  initial: (dir: number) => ({ x: dir * 60, opacity: 0 }),
  animate: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir * -60, opacity: 0 }),
  transition: { duration: 0.25, ease: "easeInOut" },
};

function RadioCard({
  value, current, onChange, label, description,
}: {
  value: string; current: string; onChange: (v: string) => void;
  label: string; description?: string;
}) {
  const active = value === current;
  return (
    <button
      type="button"
      onClick={() => onChange(value)}
      className={`flex flex-col gap-1 rounded-lg border-2 p-4 text-left transition-all cursor-pointer w-full
        ${active
          ? "border-emerald-600 bg-emerald-50 dark:bg-emerald-950/30"
          : "border-gray-200 dark:border-gray-700 hover:border-emerald-300"
        }`}
    >
      <div className="flex items-center justify-between">
        <span className="font-medium text-sm">{label}</span>
        <div className={`h-4 w-4 rounded-full border-2 flex items-center justify-center
          ${active ? "border-emerald-600" : "border-gray-300"}`}>
          {active && <div className="h-2 w-2 rounded-full bg-emerald-600" />}
        </div>
      </div>
      {description && <span className="text-xs text-muted-foreground">{description}</span>}
    </button>
  );
}

function ToggleCard({
  value, onChange, label, description, icon: Icon,
}: {
  value: boolean; onChange: (v: boolean) => void;
  label: string; description?: string; icon?: React.ElementType;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!value)}
      className={`flex items-start gap-3 rounded-lg border-2 p-4 text-left transition-all cursor-pointer w-full
        ${value
          ? "border-emerald-600 bg-emerald-50 dark:bg-emerald-950/30"
          : "border-gray-200 dark:border-gray-700 hover:border-emerald-300"
        }`}
    >
      {Icon && <Icon className={`h-5 w-5 mt-0.5 ${value ? "text-emerald-600" : "text-gray-400"}`} />}
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <span className="font-medium text-sm">{label}</span>
          <div className={`h-5 w-9 rounded-full transition-colors ${value ? "bg-emerald-600" : "bg-gray-200 dark:bg-gray-700"}`}>
            <div className={`h-4 w-4 rounded-full bg-white mt-0.5 transition-transform mx-0.5
              ${value ? "translate-x-4" : "translate-x-0"}`} />
          </div>
        </div>
        {description && <span className="text-xs text-muted-foreground mt-0.5 block">{description}</span>}
      </div>
    </button>
  );
}

// ─── Step components ──────────────────────────────────────────────────────────

function Step1({ form, set }: { form: FormData; set: (k: keyof FormData, v: unknown) => void }) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
          Type d'hébergement
        </h3>
        <div className="grid grid-cols-2 gap-3">
          {(Object.keys(ACCOMMODATION_LABELS) as AccommodationType[]).map((t) => (
            <RadioCard
              key={t} value={t} current={form.accommodation_type}
              onChange={(v) => set("accommodation_type", v as AccommodationType)}
              label={ACCOMMODATION_LABELS[t]}
            />
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
          Type de résidence
        </h3>
        <div className="grid grid-cols-2 gap-3">
          <RadioCard
            value="PRIMARY" current={form.residence_type}
            onChange={(v) => set("residence_type", v as ResidenceType)}
            label="Résidence principale"
            description="Occupée plus de 8 mois / an"
          />
          <RadioCard
            value="SECONDARY" current={form.residence_type}
            onChange={(v) => set("residence_type", v as ResidenceType)}
            label="Résidence secondaire"
            description="Location saisonnière ou secondaire"
          />
        </div>
        {form.residence_type === "PRIMARY" && form.accommodation_type === "MEUBLE" && (
          <div className="mt-2 flex items-start gap-2 rounded-lg bg-amber-50 border border-amber-200 p-3 text-sm text-amber-800">
            <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
            <span>Les meublés en résidence principale peuvent bénéficier d'un régime simplifié selon la réglementation DGTH.</span>
          </div>
        )}
      </div>

      <div>
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
          Type de logement
        </h3>
        <div className="grid grid-cols-2 gap-3">
          {(Object.keys(PROPERTY_TYPE_LABELS) as PropertyType[]).map((t) => (
            <RadioCard
              key={t} value={t} current={form.property_type}
              onChange={(v) => set("property_type", v as PropertyType)}
              label={PROPERTY_TYPE_LABELS[t]}
            />
          ))}
        </div>
      </div>

      <Separator />

      <div className="grid grid-cols-1 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="name">Nom du bien <span className="text-red-500">*</span></Label>
          <Input
            id="name" placeholder="Ex: Résidence Les Flamboyants"
            value={form.name}
            onChange={(e) => set("name", e.target.value)}
            required
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="commercial_name">Nom commercial <span className="text-xs text-muted-foreground">(si différent)</span></Label>
          <Input
            id="commercial_name" placeholder="Ex: Les Flamboyants Boutique"
            value={form.commercial_name}
            onChange={(e) => set("commercial_name", e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}

function Step2({ form, set }: { form: FormData; set: (k: keyof FormData, v: unknown) => void }) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
          Capacité
        </h3>
        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="total_units">Unités (studios/chambres)</Label>
            <Input id="total_units" type="number" min={1} placeholder="Ex: 8"
              value={form.total_units} onChange={(e) => set("total_units", e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="guest_capacity">Capacité d'accueil (pers.)</Label>
            <Input id="guest_capacity" type="number" min={1} placeholder="Ex: 20"
              value={form.guest_capacity} onChange={(e) => set("guest_capacity", e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="room_count">Nombre de pièces</Label>
            <Input id="room_count" type="number" min={1} placeholder="Ex: 3"
              value={form.room_count} onChange={(e) => set("room_count", e.target.value)} />
          </div>
        </div>
      </div>

      <ToggleCard
        value={form.pmr_accessible}
        onChange={(v) => set("pmr_accessible", v)}
        label="Accessible aux personnes à mobilité réduite (PMR)"
        description="Le bien est équipé pour accueillir les personnes handicapées"
        icon={Accessibility}
      />

      <Separator />

      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
          Classement & label
        </h3>
        <ToggleCard
          value={form.is_classified}
          onChange={(v) => set("is_classified", v)}
          label="Bien classé (étoiles officielles)"
          description="Classement attribué par la DGTH ou organisme agréé"
          icon={Star}
        />
        {form.is_classified && (
          <motion.div
            initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="grid grid-cols-2 gap-4 pl-4 border-l-2 border-emerald-300"
          >
            <div className="space-y-1.5">
              <Label>Nombre d'étoiles</Label>
              <Select value={form.star_rating} onValueChange={(v) => set("star_rating", v)}>
                <SelectTrigger><SelectValue placeholder="1 à 5 étoiles" /></SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5].map((n) => (
                    <SelectItem key={n} value={String(n)}>{n} étoile{n > 1 ? "s" : ""}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Date de classement</Label>
              <Input type="date" value={form.star_rating_date}
                onChange={(e) => set("star_rating_date", e.target.value)} />
            </div>
          </motion.div>
        )}

        <ToggleCard
          value={form.has_quality_label}
          onChange={(v) => set("has_quality_label", v)}
          label="Label qualité"
          description="Label reconnu par le Ministère du Tourisme"
        />
        {form.has_quality_label && (
          <motion.div
            initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="pl-4 border-l-2 border-emerald-300"
          >
            <Select value={form.quality_label} onValueChange={(v) => set("quality_label", v)}>
              <SelectTrigger><SelectValue placeholder="Sélectionner un label" /></SelectTrigger>
              <SelectContent>
                {QUALITY_LABELS.map((l) => (
                  <SelectItem key={l} value={l}>{l}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </motion.div>
        )}
      </div>

      <Separator />

      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
          Disponibilité & tarif
        </h3>
        <div className="grid grid-cols-2 gap-3">
          <RadioCard
            value="YEAR_ROUND" current={form.availability_type}
            onChange={(v) => set("availability_type", v as AvailabilityType)}
            label="Toute l'année"
          />
          <RadioCard
            value="SEASONAL" current={form.availability_type}
            onChange={(v) => set("availability_type", v as AvailabilityType)}
            label="Saisonnière"
            description="Périodes définies"
          />
        </div>
        {form.availability_type === "SEASONAL" && (
          <motion.div
            initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
            className="space-y-1.5"
          >
            <Label>Périodes prévisionnelles</Label>
            <Input placeholder="Ex: Juin–Août, Décembre–Janvier"
              value={form.availability_periods}
              onChange={(e) => set("availability_periods", e.target.value)} />
          </motion.div>
        )}
        <div className="space-y-1.5">
          <Label htmlFor="price">Prix par nuit (F CFA)</Label>
          <Input id="price" type="number" min={0} placeholder="Ex: 25 000"
            value={form.price_per_night}
            onChange={(e) => set("price_per_night", e.target.value)} />
        </div>
      </div>
    </div>
  );
}

function Step3({ form, set }: { form: FormData; set: (k: keyof FormData, v: unknown) => void }) {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
          Identité de l'exploitant
        </h3>
        <div className="space-y-1.5">
          <Label htmlFor="operator_name">Nom / Raison sociale <span className="text-red-500">*</span></Label>
          <Input id="operator_name" placeholder="Ex: Société Immobilière Congo SARL"
            value={form.operator_name}
            onChange={(e) => set("operator_name", e.target.value)} required />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label>Statut juridique</Label>
            <Select value={form.operator_legal_status}
              onValueChange={(v) => set("operator_legal_status", v as LegalStatus)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {(Object.keys(LEGAL_STATUS_LABELS) as LegalStatus[]).map((s) => (
                  <SelectItem key={s} value={s}>{LEGAL_STATUS_LABELS[s]}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="operator_nui">NUI <span className="text-xs text-muted-foreground">(Numéro Unique d'Identification)</span></Label>
            <Input id="operator_nui" placeholder="Ex: M2024BZVCG12345"
              value={form.operator_nui}
              onChange={(e) => set("operator_nui", e.target.value.toUpperCase())} />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="operator_phone">
              <Phone className="h-3.5 w-3.5 inline mr-1" />Téléphone
            </Label>
            <Input id="operator_phone" type="tel" placeholder="+242 06 000 0000"
              value={form.operator_phone}
              onChange={(e) => set("operator_phone", e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="operator_email">
              <Mail className="h-3.5 w-3.5 inline mr-1" />Email
            </Label>
            <Input id="operator_email" type="email" placeholder="contact@etablissement.cg"
              value={form.operator_email}
              onChange={(e) => set("operator_email", e.target.value)} />
          </div>
        </div>
      </div>

      <Separator />

      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
          <MapPin className="h-3.5 w-3.5 inline mr-1" />Adresse du bien
        </h3>
        <div className="space-y-1.5">
          <Label htmlFor="address_voie">Numéro et libellé de voie</Label>
          <Input id="address_voie" placeholder="Ex: 12 Avenue des Flamboyants"
            value={form.address_voie}
            onChange={(e) => set("address_voie", e.target.value)} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label>Quartier / Arrondissement</Label>
            <Select value={form.address_quartier}
              onValueChange={(v) => set("address_quartier", v)}>
              <SelectTrigger><SelectValue placeholder="Sélectionner" /></SelectTrigger>
              <SelectContent>
                {DISTRICTS.map((d) => (
                  <SelectItem key={d} value={d}>{d}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Ville</Label>
            <Select value={form.city} onValueChange={(v) => set("city", v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {CITIES.map((c) => (
                  <SelectItem key={c} value={c}>{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="address_batiment">Bâtiment / Immeuble / Étage <span className="text-xs text-muted-foreground">(optionnel)</span></Label>
          <Input id="address_batiment" placeholder="Ex: Bâtiment B, 2e étage"
            value={form.address_batiment}
            onChange={(e) => set("address_batiment", e.target.value)} />
        </div>
      </div>
    </div>
  );
}

function RecapRow({ label, value }: { label: string; value: string | undefined | null }) {
  if (!value) return null;
  return (
    <div className="flex justify-between text-sm py-1.5 border-b border-dashed border-gray-100 dark:border-gray-800 last:border-0">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium text-right max-w-[60%]">{value}</span>
    </div>
  );
}

function Step4({
  form, generatedNimt, loading, onSubmit,
}: {
  form: FormData;
  generatedNimt: string | null;
  loading: boolean;
  onSubmit: () => void;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (generatedNimt) {
      navigator.clipboard.writeText(generatedNimt);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (generatedNimt) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center gap-6 py-4 text-center"
      >
        <div className="h-16 w-16 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
          <CheckCircle2 className="h-9 w-9 text-emerald-600" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-emerald-700 dark:text-emerald-400">Dossier enregistré !</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Le numéro NIMT a été attribué au bien
          </p>
        </div>
        <div className="rounded-xl border-2 border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30 px-8 py-5 w-full max-w-sm">
          <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wider">Numéro NIMT</p>
          <p className="text-2xl font-mono font-bold tracking-widest text-emerald-800 dark:text-emerald-300">
            {generatedNimt}
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={handleCopy}>
            {copied ? <Check className="h-4 w-4 mr-2 text-emerald-600" /> : <Copy className="h-4 w-4 mr-2" />}
            {copied ? "Copié !" : "Copier le NIMT"}
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">
          Conservez ce numéro. Il sera requis pour toutes les démarches auprès de la DGTH.
        </p>
      </motion.div>
    );
  }

  return (
    <div className="space-y-5">
      <Card className="border-emerald-200 dark:border-emerald-900">
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <Building2 className="h-4 w-4 text-emerald-600" />Type de bien
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-0.5">
          <RecapRow label="Hébergement" value={ACCOMMODATION_LABELS[form.accommodation_type]} />
          <RecapRow label="Résidence" value={form.residence_type === "PRIMARY" ? "Principale" : "Secondaire"} />
          <RecapRow label="Type de logement" value={PROPERTY_TYPE_LABELS[form.property_type]} />
          <RecapRow label="Nom du bien" value={form.name} />
          {form.commercial_name && <RecapRow label="Nom commercial" value={form.commercial_name} />}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <Star className="h-4 w-4 text-emerald-600" />Caractéristiques
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-0.5">
          <RecapRow label="Unités" value={form.total_units || "—"} />
          <RecapRow label="Capacité d'accueil" value={form.guest_capacity ? `${form.guest_capacity} personnes` : "—"} />
          <RecapRow label="Nombre de pièces" value={form.room_count || "—"} />
          <RecapRow label="Accessibilité PMR" value={form.pmr_accessible ? "Oui" : "Non"} />
          {form.is_classified && <RecapRow label="Classement" value={`${form.star_rating} étoile(s) — ${form.star_rating_date}`} />}
          {form.has_quality_label && <RecapRow label="Label" value={form.quality_label} />}
          <RecapRow label="Disponibilité" value={form.availability_type === "YEAR_ROUND" ? "Toute l'année" : `Saisonnière — ${form.availability_periods}`} />
          {form.price_per_night && <RecapRow label="Prix / nuit" value={`${Number(form.price_per_night).toLocaleString("fr-FR")} F CFA`} />}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <Users className="h-4 w-4 text-emerald-600" />Exploitant
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-0.5">
          <RecapRow label="Raison sociale" value={form.operator_name} />
          <RecapRow label="Statut juridique" value={LEGAL_STATUS_LABELS[form.operator_legal_status]} />
          {form.operator_nui && <RecapRow label="NUI" value={form.operator_nui} />}
          {form.operator_phone && <RecapRow label="Téléphone" value={form.operator_phone} />}
          {form.operator_email && <RecapRow label="Email" value={form.operator_email} />}
          <RecapRow label="Adresse" value={[form.address_voie, form.address_quartier, form.city].filter(Boolean).join(", ")} />
          {form.address_batiment && <RecapRow label="Bâtiment" value={form.address_batiment} />}
        </CardContent>
      </Card>

      <div className="rounded-lg bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 p-4 text-sm text-amber-800 dark:text-amber-300 flex items-start gap-2">
        <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
        <span>
          En soumettant ce dossier, vous certifiez l'exactitude des informations fournies.
          Un numéro NIMT sera automatiquement généré et transmis à la DGTH.
        </span>
      </div>

      <Button onClick={onSubmit} disabled={loading} className="w-full bg-emerald-700 hover:bg-emerald-800" size="lg">
        {loading ? (
          <span className="flex items-center gap-2">
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
            </svg>
            Enregistrement en cours…
          </span>
        ) : (
          <span className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Soumettre et générer le NIMT
          </span>
        )}
      </Button>
    </div>
  );
}

// ─── Wizard ───────────────────────────────────────────────────────────────────

const TourismRegistrationCreate = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [step, setStep] = useState(0);
  const [dir, setDir] = useState(1);
  const [loading, setLoading] = useState(false);
  const [generatedNimt, setGeneratedNimt] = useState<string | null>(null);
  const [form, setForm] = useState<FormData>(() => {
    try {
      const saved = localStorage.getItem(DRAFT_KEY);
      return saved ? { ...INITIAL, ...JSON.parse(saved) } : INITIAL;
    } catch {
      return INITIAL;
    }
  });

  // Auto-save draft
  useEffect(() => {
    localStorage.setItem(DRAFT_KEY, JSON.stringify(form));
  }, [form]);

  const set = (k: keyof FormData, v: unknown) =>
    setForm((prev) => ({ ...prev, [k]: v }));

  const validateStep = (): string | null => {
    if (step === 0 && !form.name.trim()) return "Le nom du bien est requis.";
    if (step === 2 && !form.operator_name.trim()) return "Le nom de l'exploitant est requis.";
    return null;
  };

  const goNext = () => {
    const err = validateStep();
    if (err) { toast({ title: "Champ requis", description: err, variant: "destructive" }); return; }
    setDir(1);
    setStep((s) => Math.min(s + 1, 3));
  };

  const goPrev = () => {
    setDir(-1);
    setStep((s) => Math.max(s - 1, 0));
  };

  const handleSubmit = async () => {
    const err = validateStep();
    if (err) { toast({ title: "Champ requis", description: err, variant: "destructive" }); return; }

    setLoading(true);
    try {
      const token = localStorage.getItem("authToken");
      const payload = {
        name: form.name,
        commercial_name: form.commercial_name || undefined,
        address: [form.address_voie, form.address_quartier, form.city].filter(Boolean).join(", "),
        address_voie: form.address_voie || undefined,
        address_quartier: form.address_quartier || undefined,
        address_batiment: form.address_batiment || undefined,
        district: form.address_quartier || undefined,
        city: form.city,
        operator_name: form.operator_name,
        operator_phone: form.operator_phone || undefined,
        operator_email: form.operator_email || undefined,
        operator_legal_status: form.operator_legal_status,
        operator_nui: form.operator_nui || undefined,
        total_units: parseInt(form.total_units) || 0,
        guest_capacity: parseInt(form.guest_capacity) || 0,
        room_count: parseInt(form.room_count) || 0,
        price_per_night: parseFloat(form.price_per_night) || 0,
        accommodation_type: form.accommodation_type,
        residence_type: form.residence_type,
        property_type: form.property_type,
        pmr_accessible: form.pmr_accessible,
        star_rating: form.is_classified && form.star_rating ? parseInt(form.star_rating) : undefined,
        star_rating_date: form.is_classified ? form.star_rating_date || undefined : undefined,
        quality_label: form.has_quality_label ? form.quality_label || undefined : undefined,
        availability_type: form.availability_type,
        availability_periods: form.availability_type === "SEASONAL" ? form.availability_periods : undefined,
      };

      const res = await fetch("/api/tourism-registry", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || "Erreur lors de la création");
      }

      const { id } = await res.json();

      // Auto-generate NIMT
      const nimtRes = await fetch(`/api/tourism-registry/${id}/generate-nimt`, {
        method: "POST",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      if (nimtRes.ok) {
        const { nimt } = await nimtRes.json();
        setGeneratedNimt(nimt);
        localStorage.removeItem(DRAFT_KEY);
      } else {
        toast({ title: "Dossier créé", description: `Identifiant : ${id}. Générez le NIMT depuis le registre.` });
        localStorage.removeItem(DRAFT_KEY);
        navigate("/ministry/tourism-registry");
      }
    } catch (e: unknown) {
      toast({
        title: "Erreur",
        description: e instanceof Error ? e.message : "Impossible de créer le dossier",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const hasDraft = JSON.stringify(form) !== JSON.stringify(INITIAL);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-8 px-4">
      <div className="max-w-2xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex-1">
            <h1 className="text-xl font-bold tracking-tight">Déclaration — Meublé touristique</h1>
            <p className="text-sm text-muted-foreground">Enregistrement NIMT · DGTH Congo-Brazzaville</p>
          </div>
          {hasDraft && !generatedNimt && (
            <Badge variant="secondary" className="gap-1">
              <Save className="h-3 w-3" />Brouillon
            </Badge>
          )}
        </div>

        {/* Stepper */}
        {!generatedNimt && (
          <div className="flex items-center gap-0">
            {STEP_META.map((s, i) => {
              const Icon = s.icon;
              const done = i < step;
              const active = i === step;
              return (
                <div key={i} className="flex items-center flex-1 last:flex-none">
                  <button
                    type="button"
                    onClick={() => { if (done) { setDir(i < step ? -1 : 1); setStep(i); } }}
                    className={`flex flex-col items-center gap-1 cursor-default ${done ? "cursor-pointer" : ""}`}
                  >
                    <div className={`h-8 w-8 rounded-full flex items-center justify-center transition-all
                      ${done ? "bg-emerald-600 text-white" : active ? "bg-emerald-700 text-white ring-4 ring-emerald-200 dark:ring-emerald-900" : "bg-gray-200 dark:bg-gray-800 text-gray-400"}`}>
                      {done ? <Check className="h-4 w-4" /> : <Icon className="h-4 w-4" />}
                    </div>
                    <span className={`text-xs hidden sm:block whitespace-nowrap
                      ${active ? "text-emerald-700 dark:text-emerald-400 font-semibold" : "text-muted-foreground"}`}>
                      {s.label}
                    </span>
                  </button>
                  {i < STEP_META.length - 1 && (
                    <div className={`flex-1 h-0.5 mx-2 transition-colors ${i < step ? "bg-emerald-600" : "bg-gray-200 dark:bg-gray-700"}`} />
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Form card */}
        <Card className="overflow-hidden">
          {!generatedNimt && (
            <CardHeader className="bg-gradient-to-r from-emerald-700 to-emerald-600 text-white py-4">
              <CardTitle className="text-base flex items-center gap-2">
                {(() => { const Icon = STEP_META[step].icon; return <Icon className="h-4 w-4" />; })()}
                Étape {step + 1} — {STEP_META[step].label}
              </CardTitle>
              <CardDescription className="text-emerald-100 text-xs">
                {step === 0 && "Identifiez le type et le nom du bien à déclarer"}
                {step === 1 && "Renseignez les caractéristiques physiques et le classement"}
                {step === 2 && "Informations sur l'exploitant et l'adresse du bien"}
                {step === 3 && "Vérifiez l'ensemble des informations avant soumission"}
              </CardDescription>
            </CardHeader>
          )}
          <CardContent className={generatedNimt ? "p-6" : "p-6"}>
            <AnimatePresence mode="wait" custom={dir}>
              <motion.div
                key={step}
                custom={dir}
                variants={slide}
                initial="initial"
                animate="animate"
                exit="exit"
              >
                {step === 0 && <Step1 form={form} set={set} />}
                {step === 1 && <Step2 form={form} set={set} />}
                {step === 2 && <Step3 form={form} set={set} />}
                {step === 3 && (
                  <Step4
                    form={form}
                    generatedNimt={generatedNimt}
                    loading={loading}
                    onSubmit={handleSubmit}
                  />
                )}
              </motion.div>
            </AnimatePresence>
          </CardContent>
        </Card>

        {/* Navigation */}
        {!generatedNimt && (
          <div className="flex items-center justify-between">
            <Button variant="outline" onClick={goPrev} disabled={step === 0}>
              <ArrowLeft className="h-4 w-4 mr-2" />Précédent
            </Button>
            <span className="text-xs text-muted-foreground">{step + 1} / {STEP_META.length}</span>
            {step < 3 ? (
              <Button onClick={goNext} className="bg-emerald-700 hover:bg-emerald-800">
                Suivant<ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            ) : null}
          </div>
        )}

        {/* NIMT success navigation */}
        {generatedNimt && (
          <div className="flex justify-center">
            <Button onClick={() => navigate("/ministry/tourism-registry")} className="bg-emerald-700 hover:bg-emerald-800">
              <ChevronRight className="h-4 w-4 mr-2" />Retour au registre
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TourismRegistrationCreate;

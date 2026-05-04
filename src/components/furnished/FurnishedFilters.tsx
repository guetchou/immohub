import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ComplianceStatus } from "@/types/furnished";

const DISTRICTS = ["Bacongo", "Moungali", "Poto-Poto", "Centre-Ville", "Makélékélé", "Talangaï"];

const COMPLIANCE_STATUSES: { value: ComplianceStatus; label: string }[] = [
  { value: "UNDECLARED", label: "Non déclaré" },
  { value: "PENDING_DOCUMENTS", label: "Documents en attente" },
  { value: "DECLARED", label: "Déclaré" },
  { value: "AUTHORIZED", label: "Autorisé" },
  { value: "CLASSIFIED", label: "Classifié" },
  { value: "NON_COMPLIANT", label: "Non conforme" },
  { value: "SUSPENDED", label: "Suspendu" },
];

export interface FurnishedFiltersState {
  district: string;
  status: string;
  maxPrice: string;
}

interface FurnishedFiltersProps {
  onFilterChange: (filters: FurnishedFiltersState) => void;
}

export function FurnishedFilters({ onFilterChange }: FurnishedFiltersProps) {
  const [filters, setFilters] = useState<FurnishedFiltersState>({
    district: "",
    status: "",
    maxPrice: "",
  });

  function update(key: keyof FurnishedFiltersState, value: string) {
    const next = { ...filters, [key]: value };
    setFilters(next);
    onFilterChange(next);
  }

  return (
    <div className="flex flex-wrap gap-4 items-end">
      <div className="space-y-1.5 min-w-[160px]">
        <Label htmlFor="filter-district">Quartier</Label>
        <Select value={filters.district} onValueChange={(v) => update("district", v === "all" ? "" : v)}>
          <SelectTrigger id="filter-district">
            <SelectValue placeholder="Tous les quartiers" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les quartiers</SelectItem>
            {DISTRICTS.map((d) => (
              <SelectItem key={d} value={d}>{d}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-1.5 min-w-[180px]">
        <Label htmlFor="filter-status">Statut conformité</Label>
        <Select value={filters.status} onValueChange={(v) => update("status", v === "all" ? "" : v)}>
          <SelectTrigger id="filter-status">
            <SelectValue placeholder="Tous les statuts" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les statuts</SelectItem>
            {COMPLIANCE_STATUSES.map((s) => (
              <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-1.5 min-w-[140px]">
        <Label htmlFor="filter-price">Prix max / nuit (FCFA)</Label>
        <Input
          id="filter-price"
          type="number"
          placeholder="Ex : 50000"
          value={filters.maxPrice}
          onChange={(e) => update("maxPrice", e.target.value)}
        />
      </div>
    </div>
  );
}

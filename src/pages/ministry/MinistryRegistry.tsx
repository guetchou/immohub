import { useState } from "react";
import { Link } from "react-router-dom";
import { furnishedPropertiesMock } from "@/data/furnishedMock";
import { FurnishedStatusBadge } from "@/components/furnished/FurnishedStatusBadge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ComplianceStatus } from "@/types/furnished";
import { FolderOpen, List } from "lucide-react";

const DISTRICTS = ["Bacongo", "Moungali", "Poto-Poto", "Centre-Ville", "Makélékélé", "Talangaï"];

const STATUSES: { value: ComplianceStatus; label: string }[] = [
  { value: "UNDECLARED", label: "Non déclaré" },
  { value: "PENDING_DOCUMENTS", label: "Documents en attente" },
  { value: "DECLARED", label: "Déclaré" },
  { value: "AUTHORIZED", label: "Autorisé" },
  { value: "CLASSIFIED", label: "Classifié" },
  { value: "NON_COMPLIANT", label: "Non conforme" },
  { value: "SUSPENDED", label: "Suspendu" },
];

export default function MinistryRegistry() {
  const [district, setDistrict] = useState("");
  const [status, setStatus] = useState("");

  const filtered = furnishedPropertiesMock.filter((p) => {
    if (district && p.district !== district) return false;
    if (status && p.complianceStatus !== status) return false;
    return true;
  });

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
        <List className="h-6 w-6" />
        Registre des biens meublés
      </h1>

      <div className="flex flex-wrap gap-4 items-end">
        <div className="space-y-1.5 min-w-[160px]">
          <Label>Quartier</Label>
          <Select value={district} onValueChange={(v) => setDistrict(v === "all" ? "" : v)}>
            <SelectTrigger>
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
          <Label>Statut conformité</Label>
          <Select value={status} onValueChange={(v) => setStatus(v === "all" ? "" : v)}>
            <SelectTrigger>
              <SelectValue placeholder="Tous les statuts" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les statuts</SelectItem>
              {STATUSES.map((s) => (
                <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm text-muted-foreground font-normal">
            {filtered.length} bien{filtered.length !== 1 ? "s" : ""} trouvé{filtered.length !== 1 ? "s" : ""}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/40">
                  <th className="text-left px-3 py-2 font-medium text-muted-foreground">Référence</th>
                  <th className="text-left px-3 py-2 font-medium text-muted-foreground">Nom</th>
                  <th className="text-left px-3 py-2 font-medium text-muted-foreground">Quartier</th>
                  <th className="text-left px-3 py-2 font-medium text-muted-foreground">Opérateur</th>
                  <th className="text-left px-3 py-2 font-medium text-muted-foreground">Statut</th>
                  <th className="text-left px-3 py-2 font-medium text-muted-foreground">Score risque</th>
                  <th className="text-left px-3 py-2 font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p) => (
                  <tr key={p.id} className="border-b last:border-0 hover:bg-muted/20">
                    <td className="px-3 py-2 font-mono text-xs text-muted-foreground">{p.id}</td>
                    <td className="px-3 py-2 font-medium">{p.name}</td>
                    <td className="px-3 py-2 text-muted-foreground">{p.district}</td>
                    <td className="px-3 py-2 text-muted-foreground">{p.operatorName}</td>
                    <td className="px-3 py-2">
                      <FurnishedStatusBadge status={p.complianceStatus} />
                    </td>
                    <td className="px-3 py-2">
                      <span
                        className={`font-semibold ${
                          (p.taxRiskScore ?? 0) >= 75
                            ? "text-red-600"
                            : (p.taxRiskScore ?? 0) >= 50
                            ? "text-orange-500"
                            : (p.taxRiskScore ?? 0) >= 25
                            ? "text-yellow-600"
                            : "text-green-600"
                        }`}
                      >
                        {p.taxRiskScore ?? "—"}
                      </span>
                    </td>
                    <td className="px-3 py-2">
                      <Button asChild size="sm" variant="outline">
                        <Link to={`/ministry/cases?property=${p.id}`}>
                          <FolderOpen className="h-4 w-4 mr-1" />
                          Ouvrir dossier
                        </Link>
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

import { useState } from "react";
import { taxRiskMock } from "@/data/ministryMock";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ShieldAlert, FolderOpen } from "lucide-react";
import { TaxRiskAssessment } from "@/types/ministry";

type RiskLevel = TaxRiskAssessment["riskLevel"];

const riskConfig: Record<RiskLevel, { label: string; className: string }> = {
  LOW: { label: "Faible", className: "bg-green-100 text-green-700 border-green-200" },
  MEDIUM: { label: "Moyen", className: "bg-yellow-100 text-yellow-700 border-yellow-200" },
  HIGH: { label: "Élevé", className: "bg-orange-100 text-orange-700 border-orange-200" },
  CRITICAL: { label: "Critique", className: "bg-red-100 text-red-800 border-red-200" },
};

function fmt(n: number): string {
  return n.toLocaleString("fr-FR") + " FCFA";
}

export default function MinistryTaxRisk() {
  const [riskFilter, setRiskFilter] = useState("");

  const sorted = [...taxRiskMock].sort((a, b) => b.riskScore - a.riskScore);
  const filtered = sorted.filter((r) => {
    if (riskFilter && r.riskLevel !== riskFilter) return false;
    return true;
  });

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
        <ShieldAlert className="h-6 w-6" />
        Analyse du risque fiscal
      </h1>

      <div className="flex flex-wrap gap-4 items-end">
        <div className="space-y-1.5 min-w-[180px]">
          <Label>Niveau de risque</Label>
          <Select value={riskFilter} onValueChange={(v) => setRiskFilter(v === "all" ? "" : v)}>
            <SelectTrigger>
              <SelectValue placeholder="Tous les niveaux" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les niveaux</SelectItem>
              <SelectItem value="CRITICAL">Critique</SelectItem>
              <SelectItem value="HIGH">Élevé</SelectItem>
              <SelectItem value="MEDIUM">Moyen</SelectItem>
              <SelectItem value="LOW">Faible</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm text-muted-foreground font-normal">
            {filtered.length} bien{filtered.length !== 1 ? "s" : ""} — trié par score décroissant
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/40">
                  <th className="text-left px-3 py-2 font-medium text-muted-foreground">Bien</th>
                  <th className="text-left px-3 py-2 font-medium text-muted-foreground">Quartier</th>
                  <th className="text-right px-3 py-2 font-medium text-muted-foreground">Revenus estimés</th>
                  <th className="text-right px-3 py-2 font-medium text-muted-foreground">Revenus déclarés</th>
                  <th className="text-right px-3 py-2 font-medium text-muted-foreground">Écart</th>
                  <th className="text-center px-3 py-2 font-medium text-muted-foreground">Score</th>
                  <th className="text-left px-3 py-2 font-medium text-muted-foreground">Niveau</th>
                  <th className="text-left px-3 py-2 font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((r) => {
                  const rc = riskConfig[r.riskLevel];
                  const gap = r.estimatedRevenue - r.declaredRevenue;
                  const isActionable = r.riskLevel === "HIGH" || r.riskLevel === "CRITICAL";
                  return (
                    <tr key={r.propertyId} className="border-b last:border-0 hover:bg-muted/20">
                      <td className="px-3 py-2 font-medium">{r.propertyName}</td>
                      <td className="px-3 py-2 text-muted-foreground">{r.district}</td>
                      <td className="px-3 py-2 text-right text-muted-foreground">{fmt(r.estimatedRevenue)}</td>
                      <td className="px-3 py-2 text-right text-muted-foreground">{fmt(r.declaredRevenue)}</td>
                      <td className="px-3 py-2 text-right font-medium text-red-600">{fmt(gap)}</td>
                      <td className="px-3 py-2 text-center">
                        <span
                          className={`font-bold ${
                            r.riskScore >= 75 ? "text-red-600" : r.riskScore >= 50 ? "text-orange-500" : "text-green-600"
                          }`}
                        >
                          {r.riskScore}
                        </span>
                      </td>
                      <td className="px-3 py-2">
                        <Badge variant="outline" className={rc.className}>{rc.label}</Badge>
                      </td>
                      <td className="px-3 py-2">
                        {isActionable ? (
                          <Button size="sm" variant="outline">
                            <FolderOpen className="h-4 w-4 mr-1" />
                            Ouvrir dossier
                          </Button>
                        ) : (
                          <span className="text-muted-foreground text-xs">—</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

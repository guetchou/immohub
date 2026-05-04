import { useState } from "react";
import { ministryCasesMock } from "@/data/ministryMock";
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
import { FolderOpen, Plus } from "lucide-react";
import { MinistryDossierStatus } from "@/types/ministry";

const statusConfig: Record<MinistryDossierStatus, { label: string; className: string }> = {
  NEW: { label: "Nouveau", className: "bg-blue-100 text-blue-700 border-blue-200" },
  UNDER_REVIEW: { label: "En révision", className: "bg-yellow-100 text-yellow-700 border-yellow-200" },
  DOCUMENTS_REQUESTED: { label: "Docs demandés", className: "bg-orange-100 text-orange-700 border-orange-200" },
  INSPECTION_SCHEDULED: { label: "Inspection planifiée", className: "bg-purple-100 text-purple-700 border-purple-200" },
  INSPECTED: { label: "Inspecté", className: "bg-teal-100 text-teal-700 border-teal-200" },
  NOTICE_SENT: { label: "Mise en demeure", className: "bg-red-100 text-red-700 border-red-200" },
  REGULARIZED: { label: "Régularisé", className: "bg-green-100 text-green-700 border-green-200" },
  TRANSMITTED: { label: "Transmis", className: "bg-gray-100 text-gray-600 border-gray-200" },
  CLOSED: { label: "Clôturé", className: "bg-gray-200 text-gray-600 border-gray-300" },
  SUSPENDED: { label: "Suspendu", className: "bg-red-200 text-red-800 border-red-300" },
};

const ALL_STATUSES = Object.keys(statusConfig) as MinistryDossierStatus[];

export default function MinistryCases() {
  const [statusFilter, setStatusFilter] = useState("");

  const filtered = ministryCasesMock.filter((c) => {
    if (statusFilter && c.status !== statusFilter) return false;
    return true;
  });

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <FolderOpen className="h-6 w-6" />
          Gestion des dossiers
        </h1>
        <Button size="sm">
          <Plus className="h-4 w-4 mr-1" />
          Nouveau dossier
        </Button>
      </div>

      <div className="flex flex-wrap gap-4 items-end">
        <div className="space-y-1.5 min-w-[200px]">
          <Label>Statut dossier</Label>
          <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v === "all" ? "" : v)}>
            <SelectTrigger>
              <SelectValue placeholder="Tous les statuts" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les statuts</SelectItem>
              {ALL_STATUSES.map((s) => (
                <SelectItem key={s} value={s}>{statusConfig[s].label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm text-muted-foreground font-normal">
            {filtered.length} dossier{filtered.length !== 1 ? "s" : ""}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/40">
                  <th className="text-left px-3 py-2 font-medium text-muted-foreground">Référence</th>
                  <th className="text-left px-3 py-2 font-medium text-muted-foreground">Bien</th>
                  <th className="text-left px-3 py-2 font-medium text-muted-foreground">Quartier</th>
                  <th className="text-left px-3 py-2 font-medium text-muted-foreground">Opérateur</th>
                  <th className="text-left px-3 py-2 font-medium text-muted-foreground">Statut</th>
                  <th className="text-left px-3 py-2 font-medium text-muted-foreground">Score risque</th>
                  <th className="text-left px-3 py-2 font-medium text-muted-foreground">Inspecteur</th>
                  <th className="text-left px-3 py-2 font-medium text-muted-foreground">Ouvert le</th>
                  <th className="text-left px-3 py-2 font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((c) => {
                  const sc = statusConfig[c.status];
                  return (
                    <tr key={c.id} className="border-b last:border-0 hover:bg-muted/20">
                      <td className="px-3 py-2 font-mono text-xs">{c.referenceNumber}</td>
                      <td className="px-3 py-2 font-medium">{c.propertyName}</td>
                      <td className="px-3 py-2 text-muted-foreground">{c.district}</td>
                      <td className="px-3 py-2 text-muted-foreground">{c.operatorName}</td>
                      <td className="px-3 py-2">
                        <Badge variant="outline" className={sc.className}>{sc.label}</Badge>
                      </td>
                      <td className="px-3 py-2">
                        <span
                          className={`font-semibold ${
                            (c.taxRiskScore ?? 0) >= 75
                              ? "text-red-600"
                              : (c.taxRiskScore ?? 0) >= 50
                              ? "text-orange-500"
                              : "text-green-600"
                          }`}
                        >
                          {c.taxRiskScore ?? "—"}
                        </span>
                      </td>
                      <td className="px-3 py-2 text-muted-foreground">
                        {c.assignedInspectorName ?? "—"}
                      </td>
                      <td className="px-3 py-2 text-muted-foreground">
                        {new Date(c.openedAt).toLocaleDateString("fr-FR")}
                      </td>
                      <td className="px-3 py-2">
                        <Button size="sm" variant="outline">
                          <FolderOpen className="h-4 w-4 mr-1" />
                          Ouvrir
                        </Button>
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

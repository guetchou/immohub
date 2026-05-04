import { useState } from "react";
import { Link } from "react-router-dom";
import { ministryAlertsMock } from "@/data/ministryMock";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Bell, ChevronRight } from "lucide-react";
import { AdministrativeNotification } from "@/types/ministry";

type NotifType = AdministrativeNotification["type"];

const severityConfig = {
  URGENT: { label: "Urgent", className: "bg-red-100 text-red-800 border-red-200" },
  WARNING: { label: "Attention", className: "bg-orange-100 text-orange-800 border-orange-200" },
  INFO: { label: "Info", className: "bg-blue-100 text-blue-700 border-blue-200" },
};

const typeLabels: Record<NotifType, string> = {
  MISSING_DECLARATION: "Déclaration manquante",
  INSPECTION_ALERT: "Alerte inspection",
  COMPLIANCE_ISSUE: "Problème conformité",
  TAX_RISK: "Risque fiscal",
  DEADLINE: "Échéance",
};

const TYPES: NotifType[] = [
  "MISSING_DECLARATION",
  "INSPECTION_ALERT",
  "COMPLIANCE_ISSUE",
  "TAX_RISK",
  "DEADLINE",
];

export default function MinistryAlerts() {
  const [typeFilter, setTypeFilter] = useState("");

  const filtered = ministryAlertsMock.filter((a) => {
    if (typeFilter && a.type !== typeFilter) return false;
    return true;
  });

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
        <Bell className="h-6 w-6" />
        Alertes administratives
      </h1>

      <div className="flex flex-wrap gap-4 items-end">
        <div className="space-y-1.5 min-w-[200px]">
          <Label>Type d'alerte</Label>
          <Select value={typeFilter} onValueChange={(v) => setTypeFilter(v === "all" ? "" : v)}>
            <SelectTrigger>
              <SelectValue placeholder="Tous les types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les types</SelectItem>
              {TYPES.map((t) => (
                <SelectItem key={t} value={t}>{typeLabels[t]}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm text-muted-foreground font-normal">
            {filtered.length} alerte{filtered.length !== 1 ? "s" : ""}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {filtered.length === 0 && (
            <p className="text-muted-foreground py-4 text-center text-sm">Aucune alerte pour ce filtre.</p>
          )}
          {filtered.map((alert) => {
            const sc = severityConfig[alert.severity];
            return (
              <Link
                key={alert.id}
                to={alert.actionUrl ?? "#"}
                className="flex items-start gap-3 p-4 rounded-lg border hover:bg-muted/30 transition-colors"
              >
                <Badge variant="outline" className={`${sc.className} shrink-0 mt-0.5`}>{sc.label}</Badge>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-medium text-sm truncate">{alert.propertyName}</p>
                    <span className="text-xs text-muted-foreground shrink-0">
                      {new Date(alert.createdAt).toLocaleDateString("fr-FR")}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">{typeLabels[alert.type]}</p>
                  <p className="text-sm text-muted-foreground mt-1">{alert.message}</p>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
              </Link>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}

import { useEffect, useState } from "react";
import { Building2, FileCheck, Clock, AlertTriangle, Banknote, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { financeDashboardMock, financeTransmissionsMock, FinanceTransmission } from "@/data/financeMock";

const STATUS_LABELS: Record<string, string> = {
  PENDING: "En attente",
  RECEIVED: "Reçu",
  IN_REVIEW: "En analyse",
  PROCESSED: "Traité",
};

const STATUS_VARIANT: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  PENDING: "outline",
  RECEIVED: "secondary",
  IN_REVIEW: "secondary",
  PROCESSED: "default",
};

interface DashboardStats {
  totalRegisteredProperties: number;
  propertiesWithNimt: number;
  totalTransmissions: number;
  pendingTransmissions: number;
  totalRevenueDeclared: number;
  criticalRiskCount: number;
  totalTaxAmount: number;
}

const FinanceDashboard = () => {
  const [stats, setStats] = useState<DashboardStats>(financeDashboardMock);
  const [transmissions, setTransmissions] = useState<FinanceTransmission[]>(financeTransmissionsMock);

  useEffect(() => {
    const load = async () => {
      try {
        const [sRes, tRes] = await Promise.all([
          fetch("/api/finance/dashboard"),
          fetch("/api/finance/transmissions"),
        ]);
        if (sRes.ok) setStats(await sRes.json());
        if (tRes.ok) setTransmissions(await tRes.json());
      } catch {}
    };
    load();
  }, []);

  const kpis = [
    {
      label: "Biens enregistrés",
      value: stats.totalRegisteredProperties,
      icon: <Building2 className="h-6 w-6 text-blue-600" />,
    },
    {
      label: "Avec NIMT",
      value: stats.propertiesWithNimt,
      icon: <FileCheck className="h-6 w-6 text-green-600" />,
    },
    {
      label: "Dossiers transmis",
      value: stats.totalTransmissions,
      icon: <TrendingUp className="h-6 w-6 text-purple-600" />,
    },
    {
      label: "En attente de traitement",
      value: stats.pendingTransmissions,
      icon: <Clock className="h-6 w-6 text-orange-500" />,
    },
    {
      label: "Revenus déclarés (F CFA)",
      value: stats.totalRevenueDeclared.toLocaleString("fr-FR"),
      icon: <Banknote className="h-6 w-6 text-emerald-600" />,
    },
    {
      label: "Risque critique",
      value: stats.criticalRiskCount,
      icon: <AlertTriangle className="h-6 w-6 text-red-600" />,
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Tableau de bord — Finances & Impôts</h1>
        <p className="text-sm text-muted-foreground">
          Dossiers transmis par le Ministère du Tourisme · République du Congo
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {kpis.map((k) => (
          <Card key={k.label}>
            <CardContent className="pt-5">
              <div className="flex items-center gap-3">
                {k.icon}
                <div>
                  <p className="text-xl font-bold leading-tight">{k.value}</p>
                  <p className="text-xs text-muted-foreground">{k.label}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Dossiers transmis</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {transmissions.length === 0 ? (
            <p className="text-sm text-muted-foreground px-4 py-6 text-center">Aucun dossier transmis.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/40">
                    <th className="text-left px-4 py-2 font-medium text-muted-foreground">Bien</th>
                    <th className="text-left px-4 py-2 font-medium text-muted-foreground">NIMT</th>
                    <th className="text-right px-4 py-2 font-medium text-muted-foreground">Revenus déclarés</th>
                    <th className="text-right px-4 py-2 font-medium text-muted-foreground">Taxe estimée</th>
                    <th className="text-left px-4 py-2 font-medium text-muted-foreground">Statut</th>
                    <th className="text-left px-4 py-2 font-medium text-muted-foreground">Transmis le</th>
                  </tr>
                </thead>
                <tbody>
                  {transmissions.map((t) => (
                    <tr key={t.id} className="border-b last:border-0 hover:bg-muted/20">
                      <td className="px-4 py-2">
                        <div className="font-medium">{t.propertyName}</div>
                        <div className="text-xs text-muted-foreground">{t.operatorName}</div>
                      </td>
                      <td className="px-4 py-2">
                        <span className="font-mono text-xs">{t.nimt ?? "—"}</span>
                      </td>
                      <td className="px-4 py-2 text-right font-medium">
                        {t.totalRevenue.toLocaleString("fr-FR")} F
                      </td>
                      <td className="px-4 py-2 text-right">
                        {t.taxAmount.toLocaleString("fr-FR")} F
                      </td>
                      <td className="px-4 py-2">
                        <Badge variant={STATUS_VARIANT[t.status] ?? "outline"}>
                          {STATUS_LABELS[t.status] ?? t.status}
                        </Badge>
                      </td>
                      <td className="px-4 py-2 text-muted-foreground text-xs">
                        {new Date(t.transmittedAt).toLocaleDateString("fr-FR")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="border-amber-200 bg-amber-50 dark:bg-amber-950/20">
        <CardContent className="pt-4 text-xs text-muted-foreground">
          Ce tableau de bord affiche uniquement les dossiers transmis par le Ministère du Tourisme.
          Le service Finances & Impôts ne peut pas modifier le registre touristique ni les inspections.
        </CardContent>
      </Card>
    </div>
  );
};

export default FinanceDashboard;

import { furnishedPropertiesMock } from "@/data/furnishedMock";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FurnishedStatusBadge } from "@/components/furnished/FurnishedStatusBadge";
import { Building2, CheckCircle, AlertTriangle, TrendingUp } from "lucide-react";

export default function FurnishedDashboard() {
  const properties = furnishedPropertiesMock;

  const totalUnits = properties.reduce((sum, p) => sum + p.totalUnits, 0);
  const activeUnits = properties.reduce((sum, p) => sum + p.activeUnits, 0);
  const compliant = properties.filter(
    (p) => p.complianceStatus === "AUTHORIZED" || p.complianceStatus === "CLASSIFIED"
  ).length;
  const avgRisk = Math.round(
    properties.reduce((sum, p) => sum + (p.taxRiskScore ?? 0), 0) / properties.length
  );

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">Tableau de bord — Opérateur meublé</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="flex items-center gap-3 pt-5">
            <Building2 className="h-8 w-8 text-blue-500 shrink-0" />
            <div>
              <p className="text-sm text-muted-foreground">Total unités</p>
              <p className="text-2xl font-bold">{totalUnits}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 pt-5">
            <CheckCircle className="h-8 w-8 text-green-500 shrink-0" />
            <div>
              <p className="text-sm text-muted-foreground">Unités actives</p>
              <p className="text-2xl font-bold">{activeUnits}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 pt-5">
            <CheckCircle className="h-8 w-8 text-emerald-500 shrink-0" />
            <div>
              <p className="text-sm text-muted-foreground">Biens conformes</p>
              <p className="text-2xl font-bold">{compliant}/{properties.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 pt-5">
            <AlertTriangle className="h-8 w-8 text-orange-500 shrink-0" />
            <div>
              <p className="text-sm text-muted-foreground">Score risque moyen</p>
              <p className="text-2xl font-bold">{avgRisk}/100</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <TrendingUp className="h-5 w-5" />
            Mes biens meublés
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/40">
                  <th className="text-left px-3 py-2 font-medium text-muted-foreground">Nom</th>
                  <th className="text-left px-3 py-2 font-medium text-muted-foreground">Quartier</th>
                  <th className="text-left px-3 py-2 font-medium text-muted-foreground">Unités</th>
                  <th className="text-left px-3 py-2 font-medium text-muted-foreground">Prix/nuit</th>
                  <th className="text-left px-3 py-2 font-medium text-muted-foreground">Statut</th>
                  <th className="text-left px-3 py-2 font-medium text-muted-foreground">Risque fiscal</th>
                </tr>
              </thead>
              <tbody>
                {properties.map((p) => (
                  <tr key={p.id} className="border-b last:border-0 hover:bg-muted/20">
                    <td className="px-3 py-2 font-medium">{p.name}</td>
                    <td className="px-3 py-2 text-muted-foreground">{p.district}</td>
                    <td className="px-3 py-2">{p.activeUnits}/{p.totalUnits}</td>
                    <td className="px-3 py-2">{p.pricePerNight.toLocaleString("fr-FR")} FCFA</td>
                    <td className="px-3 py-2">
                      <FurnishedStatusBadge status={p.complianceStatus} />
                    </td>
                    <td className="px-3 py-2">
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-16 rounded-full bg-gray-100 overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              (p.taxRiskScore ?? 0) >= 75
                                ? "bg-red-500"
                                : (p.taxRiskScore ?? 0) >= 50
                                ? "bg-orange-400"
                                : (p.taxRiskScore ?? 0) >= 25
                                ? "bg-yellow-400"
                                : "bg-green-500"
                            }`}
                            style={{ width: `${p.taxRiskScore ?? 0}%` }}
                          />
                        </div>
                        <span className="text-xs text-muted-foreground">{p.taxRiskScore ?? 0}</span>
                      </div>
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

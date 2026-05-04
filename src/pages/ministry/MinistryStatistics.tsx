import { ministryStatsMock } from "@/data/ministryMock";
import { furnishedPropertiesMock } from "@/data/furnishedMock";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { BarChart2, Building2, CheckCircle, AlertCircle, ShieldAlert } from "lucide-react";
import { ComplianceStatus } from "@/types/furnished";

const statusLabels: Record<ComplianceStatus, string> = {
  UNDECLARED: "Non déclaré",
  PENDING_DOCUMENTS: "Docs en attente",
  DECLARED: "Déclaré",
  AUTHORIZED: "Autorisé",
  CLASSIFIED: "Classifié",
  NON_COMPLIANT: "Non conforme",
  SUSPENDED: "Suspendu",
};

const statusColors: Record<ComplianceStatus, string> = {
  UNDECLARED: "bg-red-400",
  PENDING_DOCUMENTS: "bg-orange-400",
  DECLARED: "bg-blue-400",
  AUTHORIZED: "bg-green-400",
  CLASSIFIED: "bg-emerald-600",
  NON_COMPLIANT: "bg-red-700",
  SUSPENDED: "bg-gray-400",
};

export default function MinistryStatistics() {
  const stats = ministryStatsMock;
  const properties = furnishedPropertiesMock;

  const districtCounts = properties.reduce<Record<string, number>>((acc, p) => {
    acc[p.district] = (acc[p.district] ?? 0) + 1;
    return acc;
  }, {});

  const chartData = Object.entries(districtCounts).map(([district, count]) => ({
    district,
    count,
  }));

  const statusCounts = properties.reduce<Partial<Record<ComplianceStatus, number>>>((acc, p) => {
    acc[p.complianceStatus] = (acc[p.complianceStatus] ?? 0) + 1;
    return acc;
  }, {});

  const total = properties.length;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
        <BarChart2 className="h-6 w-6" />
        Statistiques
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="flex items-center gap-3 pt-5">
            <Building2 className="h-7 w-7 text-blue-500 shrink-0" />
            <div>
              <p className="text-xs text-muted-foreground">Total biens</p>
              <p className="text-2xl font-bold">{stats.totalFurnishedProperties}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 pt-5">
            <CheckCircle className="h-7 w-7 text-green-500 shrink-0" />
            <div>
              <p className="text-xs text-muted-foreground">Taux conformité</p>
              <p className="text-2xl font-bold">{stats.complianceRate}%</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 pt-5">
            <AlertCircle className="h-7 w-7 text-red-500 shrink-0" />
            <div>
              <p className="text-xs text-muted-foreground">Non déclarés</p>
              <p className="text-2xl font-bold">{stats.undeclaredProperties}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 pt-5">
            <ShieldAlert className="h-7 w-7 text-red-600 shrink-0" />
            <div>
              <p className="text-xs text-muted-foreground">Risque critique</p>
              <p className="text-2xl font-bold">{stats.criticalRiskProperties}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Biens par quartier</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={chartData} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="district" tick={{ fontSize: 11 }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                <Tooltip
                  formatter={(value: number) => [value, "Biens"]}
                  contentStyle={{ fontSize: 12 }}
                />
                <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Répartition par statut</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2.5">
              {(Object.entries(statusCounts) as [ComplianceStatus, number][]).map(([status, count]) => {
                const pct = Math.round((count / total) * 100);
                return (
                  <div key={status} className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-sm shrink-0 ${statusColors[status]}`} />
                    <span className="text-sm flex-1">{statusLabels[status]}</span>
                    <span className="text-sm font-medium w-8 text-right">{count}</span>
                    <span className="text-xs text-muted-foreground w-10 text-right">{pct}%</span>
                    <div className="w-24 h-2 rounded-full bg-gray-100 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${statusColors[status]}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

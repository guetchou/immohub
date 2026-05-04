import { Link } from "react-router-dom";
import { ministryStatsMock, ministryAlertsMock } from "@/data/ministryMock";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Building2,
  CheckCircle,
  AlertCircle,
  BarChart2,
  FolderOpen,
  ClipboardList,
  ShieldAlert,
  Bell,
  ChevronRight,
} from "lucide-react";

const severityConfig = {
  URGENT: { label: "Urgent", className: "bg-red-100 text-red-800 border-red-200" },
  WARNING: { label: "Attention", className: "bg-orange-100 text-orange-800 border-orange-200" },
  INFO: { label: "Info", className: "bg-blue-100 text-blue-700 border-blue-200" },
};

interface KpiCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  to: string;
  accent?: string;
}

function KpiCard({ title, value, icon, to, accent = "text-blue-500" }: KpiCardProps) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="pt-5">
        <Link to={to} className="flex items-start gap-3 group">
          <span className={`${accent} shrink-0 mt-0.5`}>{icon}</span>
          <div>
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold group-hover:text-primary transition-colors">{value}</p>
          </div>
        </Link>
      </CardContent>
    </Card>
  );
}

export default function MinistryDashboard() {
  const stats = ministryStatsMock;
  const recentAlerts = ministryAlertsMock.slice(0, 3);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">Tableau de bord — Ministère</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          title="Total biens recensés"
          value={stats.totalFurnishedProperties}
          icon={<Building2 className="h-7 w-7" />}
          to="/ministry/registry"
          accent="text-blue-500"
        />
        <KpiCard
          title="Biens déclarés"
          value={stats.declaredProperties}
          icon={<CheckCircle className="h-7 w-7" />}
          to="/ministry/registry?status=DECLARED"
          accent="text-green-500"
        />
        <KpiCard
          title="Non déclarés"
          value={stats.undeclaredProperties}
          icon={<AlertCircle className="h-7 w-7" />}
          to="/ministry/registry?status=UNDECLARED"
          accent="text-red-500"
        />
        <KpiCard
          title="Taux de conformité"
          value={`${stats.complianceRate}%`}
          icon={<BarChart2 className="h-7 w-7" />}
          to="/ministry/statistics"
          accent="text-indigo-500"
        />
        <KpiCard
          title="Dossiers ouverts"
          value={stats.openCases}
          icon={<FolderOpen className="h-7 w-7" />}
          to="/ministry/cases"
          accent="text-orange-500"
        />
        <KpiCard
          title="Inspections en attente"
          value={stats.pendingInspections}
          icon={<ClipboardList className="h-7 w-7" />}
          to="/ministry/inspections"
          accent="text-yellow-600"
        />
        <KpiCard
          title="Biens risque critique"
          value={stats.criticalRiskProperties}
          icon={<ShieldAlert className="h-7 w-7" />}
          to="/ministry/tax-risk"
          accent="text-red-600"
        />
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <Bell className="h-5 w-5" />
            Alertes récentes
          </CardTitle>
          <Button asChild variant="outline" size="sm">
            <Link to="/ministry/alerts">
              Voir toutes les alertes <ChevronRight className="h-4 w-4 ml-1" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent className="space-y-3">
          {recentAlerts.map((alert) => {
            const sc = severityConfig[alert.severity];
            return (
              <Link
                key={alert.id}
                to={alert.actionUrl ?? "#"}
                className="flex items-start gap-3 p-3 rounded-lg border hover:bg-muted/30 transition-colors"
              >
                <Badge variant="outline" className={`${sc.className} shrink-0 mt-0.5`}>{sc.label}</Badge>
                <div className="min-w-0">
                  <p className="font-medium text-sm truncate">{alert.propertyName}</p>
                  <p className="text-sm text-muted-foreground">{alert.message}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {new Date(alert.createdAt).toLocaleDateString("fr-FR")}
                  </p>
                </div>
              </Link>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}

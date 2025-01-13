import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import { Building2, Users, DollarSign, AlertTriangle } from "lucide-react";
import DashboardCard from "@/components/dashboards/DashboardCard";
import DashboardStats from "@/components/dashboards/DashboardStats";

const InsuranceDashboard = () => {
  const { user, hasRole } = useAuth();

  if (!hasRole(["INSURANCE"])) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Tableau de bord Assurance</h1>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <DashboardCard
          title="Polices Actives"
          value="128"
          icon={Building2}
          description="+12 ce mois"
        />

        <DashboardCard
          title="Clients"
          value="95"
          icon={Users}
          description="8 nouveaux"
        />

        <DashboardCard
          title="Primes"
          value="12.5M FCFA"
          icon={DollarSign}
          description="Ce mois"
        />

        <DashboardCard
          title="Réclamations"
          value="3"
          icon={AlertTriangle}
          description="En attente"
        />
      </div>

      <div className="grid gap-4 mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Performance des Polices</CardTitle>
          </CardHeader>
          <CardContent>
            <DashboardStats />
          </CardContent>
        </Card>

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Dernières Polices</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                <li className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Résidence Les Palmes</p>
                    <p className="text-sm text-gray-500">Multirisque - 450,000 FCFA/an</p>
                  </div>
                  <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                    Active
                  </span>
                </li>
                <li className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Immeuble Le Mercure</p>
                    <p className="text-sm text-gray-500">Incendie - 850,000 FCFA/an</p>
                  </div>
                  <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">
                    En cours
                  </span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Réclamations Récentes</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="text-red-500">Dégât des eaux - Résidence Les Palmes</li>
                <li className="text-orange-500">Évaluation sinistre - Villa Riviera</li>
                <li className="text-blue-500">Renouvellement - Immeuble Le Mercure</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default InsuranceDashboard;
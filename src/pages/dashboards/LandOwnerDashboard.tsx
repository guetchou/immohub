import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import { Building2, Users, DollarSign, AlertTriangle } from "lucide-react";
import DashboardCard from "@/components/dashboards/DashboardCard";
import DashboardStats from "@/components/dashboards/DashboardStats";

const LandOwnerDashboard = () => {
  const { user, hasRole } = useAuth();

  if (!hasRole(["LAND_OWNER"])) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Tableau de bord Propriétaire Terrien</h1>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <DashboardCard
          title="Terrains"
          value="5"
          icon={Building2}
          description="3 disponibles"
        />

        <DashboardCard
          title="Acheteurs Potentiels"
          value="12"
          icon={Users}
          description="4 offres reçues"
        />

        <DashboardCard
          title="Revenus"
          value="25M FCFA"
          icon={DollarSign}
          description="Cette année"
        />

        <DashboardCard
          title="Alertes"
          value="2"
          icon={AlertTriangle}
          description="À traiter"
        />
      </div>

      <div className="grid gap-4 mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Valeur des Terrains</CardTitle>
          </CardHeader>
          <CardContent>
            <DashboardStats />
          </CardContent>
        </Card>

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Mes Terrains</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                <li className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Parcelle Bingerville</p>
                    <p className="text-sm text-gray-500">1200m² - 45M FCFA</p>
                  </div>
                  <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                    Disponible
                  </span>
                </li>
                <li className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Terrain Assinie</p>
                    <p className="text-sm text-gray-500">2000m² - 80M FCFA</p>
                  </div>
                  <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">
                    En négociation
                  </span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Actions Requises</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="text-red-500">Renouvellement titre foncier - Parcelle A</li>
                <li className="text-orange-500">Visite terrain avec géomètre</li>
                <li className="text-blue-500">Négociation vente Terrain Assinie</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default LandOwnerDashboard;
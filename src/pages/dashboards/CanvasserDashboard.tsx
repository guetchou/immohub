import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import { Building2, Users, MessageSquare, Calculator } from "lucide-react";
import DashboardCard from "@/components/dashboards/DashboardCard";
import DashboardStats from "@/components/dashboards/DashboardStats";

const CanvasserDashboard = () => {
  const { user, hasRole } = useAuth();

  if (!hasRole(["CANVASSER"])) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Tableau de bord Démarcheur</h1>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <DashboardCard
          title="Propriétés"
          value="15"
          icon={Building2}
          description="À prospecter"
        />

        <DashboardCard
          title="Prospects"
          value="28"
          icon={Users}
          description="8 hautement intéressés"
        />

        <DashboardCard
          title="Messages"
          value="12"
          icon={MessageSquare}
          description="4 non lus"
        />

        <DashboardCard
          title="Commissions"
          value="850,000 FCFA"
          icon={Calculator}
          description="Ce mois"
        />
      </div>

      <div className="grid gap-4 mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Performance des Prospections</CardTitle>
          </CardHeader>
          <CardContent>
            <DashboardStats />
          </CardContent>
        </Card>

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Propriétés à Visiter</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                <li className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Terrain Bingerville</p>
                    <p className="text-sm text-gray-500">800m² - À vendre</p>
                  </div>
                  <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">
                    Prioritaire
                  </span>
                </li>
                <li className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Maison Abobo</p>
                    <p className="text-sm text-gray-500">4 pièces - Location</p>
                  </div>
                  <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                    Cette semaine
                  </span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Rendez-vous du Jour</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="text-red-500">09h00 - Visite Terrain Bingerville</li>
                <li className="text-orange-500">11h30 - Rencontre Client Cocody</li>
                <li className="text-blue-500">15h00 - Évaluation Maison Abobo</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CanvasserDashboard;
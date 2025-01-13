import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import { Building2, Users, MessageSquare, Calculator, Home, DollarSign } from "lucide-react";
import DashboardCard from "@/components/dashboards/DashboardCard";
import DashboardStats from "@/components/dashboards/DashboardStats";

const AgencyDashboard = () => {
  const { user, hasRole } = useAuth();

  if (!hasRole(["AGENCY"])) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Tableau de bord Agence Immobilière</h1>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <DashboardCard
          title="Propriétés"
          value="24"
          icon={Building2}
          description="8 en location, 16 en vente"
        />

        <DashboardCard
          title="Clients"
          value="156"
          icon={Users}
          description="+12 ce mois"
        />

        <DashboardCard
          title="Revenus"
          value="5.2M FCFA"
          icon={DollarSign}
          description="+8% vs mois dernier"
        />

        <DashboardCard
          title="Messages"
          value="18"
          icon={MessageSquare}
          description="5 non lus"
        />
      </div>

      <div className="grid gap-4 mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Performance des Ventes</CardTitle>
          </CardHeader>
          <CardContent>
            <DashboardStats />
          </CardContent>
        </Card>

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Dernières Transactions</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                <li className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Villa Riviera</p>
                    <p className="text-sm text-gray-500">Vendue - 180M FCFA</p>
                  </div>
                  <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                    Complétée
                  </span>
                </li>
                <li className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Appartement Les Rosiers</p>
                    <p className="text-sm text-gray-500">Location - 450,000 FCFA/mois</p>
                  </div>
                  <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                    En cours
                  </span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Tâches Importantes</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="text-red-500">Visite Villa Cocody - 14h00</li>
                <li className="text-orange-500">Signature contrat Apt Marcory</li>
                <li className="text-blue-500">Évaluation propriété Yopougon</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AgencyDashboard;
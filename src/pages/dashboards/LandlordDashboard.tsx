import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import { Building2, Users, Wallet, AlertCircle } from "lucide-react";
import DashboardCard from "@/components/dashboards/DashboardCard";
import DashboardStats from "@/components/dashboards/DashboardStats";

const LandlordDashboard = () => {
  const { user, hasRole } = useAuth();

  if (!hasRole(["LANDLORD"])) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Tableau de bord Propriétaire</h1>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <DashboardCard
          title="Propriétés"
          value="3"
          icon={Building2}
          description="2 louées, 1 disponible"
        />

        <DashboardCard
          title="Locataires"
          value="2"
          icon={Users}
          description="Tous les loyers sont à jour"
        />

        <DashboardCard
          title="Revenus Mensuels"
          value="700,000 FCFA"
          icon={Wallet}
          description="+5% ce mois"
        />

        <DashboardCard
          title="Maintenance"
          value="2"
          icon={AlertCircle}
          description="Demandes en attente"
        />
      </div>

      <div className="grid gap-4 mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Revenus Locatifs</CardTitle>
          </CardHeader>
          <CardContent>
            <DashboardStats />
          </CardContent>
        </Card>

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Propriétés</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                <li className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Villa Cocody</p>
                    <p className="text-sm text-gray-500">350,000 FCFA/mois</p>
                  </div>
                  <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                    Louée
                  </span>
                </li>
                <li className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Appartement Plateau</p>
                    <p className="text-sm text-gray-500">400,000 FCFA/mois</p>
                  </div>
                  <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                    Louée
                  </span>
                </li>
                <li className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Studio Marcory</p>
                    <p className="text-sm text-gray-500">250,000 FCFA/mois</p>
                  </div>
                  <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">
                    Disponible
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
                <li className="text-red-500">Renouvellement de bail - Villa Cocody</li>
                <li className="text-orange-500">Demande de réparation - Appartement Plateau</li>
                <li className="text-blue-500">Visite programmée - Studio Marcory</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default LandlordDashboard;
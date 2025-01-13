import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import { Building2, Users, Calculator, DollarSign } from "lucide-react";
import DashboardCard from "@/components/dashboards/DashboardCard";
import DashboardStats from "@/components/dashboards/DashboardStats";

const BrokerDashboard = () => {
  const { user, hasRole } = useAuth();

  if (!hasRole(["BROKER"])) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Tableau de bord Courtier</h1>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <DashboardCard
          title="Transactions"
          value="12"
          icon={Building2}
          description="4 en cours"
        />

        <DashboardCard
          title="Clients"
          value="45"
          icon={Users}
          description="8 prospects actifs"
        />

        <DashboardCard
          title="Commissions"
          value="2.8M FCFA"
          icon={DollarSign}
          description="Ce mois"
        />

        <DashboardCard
          title="Taux de Conversion"
          value="68%"
          icon={Calculator}
          description="+5% vs dernier mois"
        />
      </div>

      <div className="grid gap-4 mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Performance Mensuelle</CardTitle>
          </CardHeader>
          <CardContent>
            <DashboardStats />
          </CardContent>
        </Card>

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Transactions en Cours</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                <li className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Duplex Angré</p>
                    <p className="text-sm text-gray-500">Vente - 85M FCFA</p>
                  </div>
                  <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">
                    Négociation
                  </span>
                </li>
                <li className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Studio Plateau</p>
                    <p className="text-sm text-gray-500">Location - 250,000 FCFA</p>
                  </div>
                  <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                    Finalisation
                  </span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Prochains Rendez-vous</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="text-red-500">10h00 - Visite Appartement Riviera</li>
                <li className="text-orange-500">14h30 - Négociation Villa Cocody</li>
                <li className="text-blue-500">16h00 - Signature Bail Marcory</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default BrokerDashboard;
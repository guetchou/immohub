import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import { Building2, CreditCard, MessageSquare, AlertTriangle } from "lucide-react";
import DashboardCard from "@/components/dashboards/DashboardCard";
import DashboardStats from "@/components/dashboards/DashboardStats";

const TenantDashboard = () => {
  const { user, hasRole } = useAuth();

  if (!hasRole(["TENANT"])) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Tableau de bord Locataire</h1>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <DashboardCard
          title="Loyer Mensuel"
          value="350,000 FCFA"
          icon={Building2}
          description="Prochain paiement: 01/02/2024"
        />

        <DashboardCard
          title="Solde Caution"
          value="700,000 FCFA"
          icon={CreditCard}
          description="2 mois de caution"
        />

        <DashboardCard
          title="Messages"
          value="3"
          icon={MessageSquare}
          description="2 nouveaux messages"
        />

        <DashboardCard
          title="Maintenance"
          value="1"
          icon={AlertTriangle}
          description="Demande en attente"
        />
      </div>

      <div className="grid gap-4 mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Historique des Paiements</CardTitle>
          </CardHeader>
          <CardContent>
            <DashboardStats />
          </CardContent>
        </Card>

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Documents Importants</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="flex items-center justify-between">
                  <span>Contrat de location</span>
                  <button className="text-blue-500 hover:underline">Voir</button>
                </li>
                <li className="flex items-center justify-between">
                  <span>État des lieux</span>
                  <button className="text-blue-500 hover:underline">Voir</button>
                </li>
                <li className="flex items-center justify-between">
                  <span>Quittances de loyer</span>
                  <button className="text-blue-500 hover:underline">Voir</button>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Notifications</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="text-orange-500">Rappel: Paiement du loyer dans 5 jours</li>
                <li className="text-green-500">Quittance de janvier disponible</li>
                <li className="text-blue-500">Visite de maintenance programmée</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TenantDashboard;
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import { Building2, Users, DollarSign, FileText } from "lucide-react";
import DashboardCard from "@/components/dashboards/DashboardCard";
import DashboardStats from "@/components/dashboards/DashboardStats";

const NotaryDashboard = () => {
  const { user, hasRole } = useAuth();

  if (!hasRole(["NOTARY"])) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Tableau de bord Notaire</h1>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <DashboardCard
          title="Actes en Cours"
          value="15"
          icon={FileText}
          description="5 urgents"
        />

        <DashboardCard
          title="Clients"
          value="42"
          icon={Users}
          description="Ce mois"
        />

        <DashboardCard
          title="Honoraires"
          value="4.8M FCFA"
          icon={DollarSign}
          description="Ce mois"
        />

        <DashboardCard
          title="Propriétés"
          value="8"
          icon={Building2}
          description="En transaction"
        />
      </div>

      <div className="grid gap-4 mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Volume d'Actes</CardTitle>
          </CardHeader>
          <CardContent>
            <DashboardStats />
          </CardContent>
        </Card>

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Actes en Cours</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                <li className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Vente Villa Cocody</p>
                    <p className="text-sm text-gray-500">Acte de vente</p>
                  </div>
                  <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">
                    En cours
                  </span>
                </li>
                <li className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">SCI Les Rosiers</p>
                    <p className="text-sm text-gray-500">Constitution</p>
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
              <CardTitle>Rendez-vous</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="text-red-500">10h00 - Signature Vente Villa Cocody</li>
                <li className="text-orange-500">14h30 - Consultation SCI Les Rosiers</li>
                <li className="text-blue-500">16h00 - Authentification documents</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default NotaryDashboard;
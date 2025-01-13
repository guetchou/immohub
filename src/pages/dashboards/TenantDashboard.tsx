import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";

const TenantDashboard = () => {
  const { user, hasRole } = useAuth();

  if (!hasRole(["TENANT"])) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Tableau de bord locataire</h1>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Mes locations</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Voir vos locations actuelles</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Paiements</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Gérer vos paiements</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Documents</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Accéder à vos documents</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TenantDashboard;
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";

const LandlordDashboard = () => {
  const { user, hasRole } = useAuth();

  if (!hasRole(["LANDLORD"])) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Tableau de bord propriétaire</h1>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Mes propriétés</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Gérer vos biens immobiliers</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Locataires</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Gérer vos locataires</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Revenus</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Suivre vos revenus locatifs</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LandlordDashboard;
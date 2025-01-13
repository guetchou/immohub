import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import { Building2, Users, MessageSquare, Calculator } from "lucide-react";

const LandlordDashboard = () => {
  const { user, hasRole } = useAuth();

  if (!hasRole(["LANDLORD"])) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Tableau de bord Propriétaire</h1>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Propriétés
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>Gérer vos biens immobiliers</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Locataires
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>Gérer vos locataires</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Messages
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>Communications</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="h-5 w-5" />
              Revenus
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>Suivi des revenus locatifs</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LandlordDashboard;
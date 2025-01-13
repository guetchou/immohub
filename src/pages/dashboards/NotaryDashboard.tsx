import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import { Building2, Users, MessageSquare, Calculator } from "lucide-react";

const NotaryDashboard = () => {
  const { user, hasRole } = useAuth();

  if (!hasRole(["NOTARY"])) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Tableau de bord Notaire</h1>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Actes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>Gestion des actes</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Clients
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>Liste des clients</p>
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
              Honoraires
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>Suivi des honoraires</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default NotaryDashboard;
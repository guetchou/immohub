import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Building2, Users, Wallet, AlertCircle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const PropertyManagementDashboard = () => {
  const navigate = useNavigate();

  const { data: properties, isLoading: propertiesLoading } = useQuery({
    queryKey: ['properties'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('properties')
        .select('*');
      if (error) throw error;
      return data;
    }
  });

  const { data: leases, isLoading: leasesLoading } = useQuery({
    queryKey: ['leases'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('lease_contracts')
        .select('*');
      if (error) throw error;
      return data;
    }
  });

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Tableau de Bord Gestion Locative</h1>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Propriétés
            </CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {propertiesLoading ? "..." : properties?.length || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              propriétés en gestion
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Locataires
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {leasesLoading ? "..." : leases?.length || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              contrats actifs
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Paiements
            </CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              95%
            </div>
            <p className="text-xs text-muted-foreground">
              taux de recouvrement
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Incidents
            </CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              2
            </div>
            <p className="text-xs text-muted-foreground">
              requêtes en attente
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Actions Rapides</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Button 
                variant="outline"
                className="w-full"
                onClick={() => navigate('/properties/new')}
              >
                <Building2 className="mr-2 h-4 w-4" />
                Nouvelle Propriété
              </Button>
              <Button 
                variant="outline"
                className="w-full"
                onClick={() => navigate('/contracts/new')}
              >
                <FileText className="mr-2 h-4 w-4" />
                Nouveau Contrat
              </Button>
              <Button 
                variant="outline"
                className="w-full"
                onClick={() => navigate('/payments/collect')}
              >
                <Wallet className="mr-2 h-4 w-4" />
                Collecter Loyer
              </Button>
              <Button 
                variant="outline"
                className="w-full"
                onClick={() => navigate('/reports')}
              >
                <FileText className="mr-2 h-4 w-4" />
                Rapports
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PropertyManagementDashboard;
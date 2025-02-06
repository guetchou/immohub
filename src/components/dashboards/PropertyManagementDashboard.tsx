import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Building2, Users, Wallet, AlertCircle, FileText, Home, Calendar, DollarSign } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

const PropertyManagementDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const { data: properties, isLoading: propertiesLoading } = useQuery({
    queryKey: ['properties'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('properties')
        .select('*');
      if (error) {
        console.error("Error fetching properties:", error);
        toast({
          title: "Erreur",
          description: "Impossible de charger les propriétés",
          variant: "destructive",
        });
        throw error;
      }
      return data;
    }
  });

  const { data: leases, isLoading: leasesLoading } = useQuery({
    queryKey: ['leases'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('lease_contracts')
        .select('*');
      if (error) {
        console.error("Error fetching leases:", error);
        toast({
          title: "Erreur",
          description: "Impossible de charger les contrats",
          variant: "destructive",
        });
        throw error;
      }
      return data;
    }
  });

  const { data: payments, isLoading: paymentsLoading } = useQuery({
    queryKey: ['payments'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('rent_payments')
        .select('*');
      if (error) {
        console.error("Error fetching payments:", error);
        toast({
          title: "Erreur",
          description: "Impossible de charger les paiements",
          variant: "destructive",
        });
        throw error;
      }
      return data;
    }
  });

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Gestion Locative</h1>
        <Button onClick={() => navigate('/properties/new')}>
          <Building2 className="mr-2 h-4 w-4" />
          Nouvelle Propriété
        </Button>
      </div>
      
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
              {paymentsLoading ? "..." : payments?.length || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              paiements enregistrés
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
              0
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
                <Home className="mr-2 h-4 w-4" />
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
                <DollarSign className="mr-2 h-4 w-4" />
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

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Derniers Contrats</CardTitle>
            </CardHeader>
            <CardContent>
              {leasesLoading ? (
                <p>Chargement...</p>
              ) : leases && leases.length > 0 ? (
                <div className="space-y-4">
                  {leases.slice(0, 5).map((lease) => (
                    <div key={lease.id} className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">Contrat #{lease.id.slice(0, 8)}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(lease.start_date).toLocaleDateString()}
                        </p>
                      </div>
                      <Button variant="ghost" onClick={() => navigate(`/contracts/${lease.id}`)}>
                        Voir
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">Aucun contrat</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Derniers Paiements</CardTitle>
            </CardHeader>
            <CardContent>
              {paymentsLoading ? (
                <p>Chargement...</p>
              ) : payments && payments.length > 0 ? (
                <div className="space-y-4">
                  {payments.slice(0, 5).map((payment) => (
                    <div key={payment.id} className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">{payment.amount.toLocaleString()} FCFA</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(payment.payment_date).toLocaleDateString()}
                        </p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        payment.status === 'completed' ? 'bg-green-100 text-green-800' : 
                        payment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                        'bg-red-100 text-red-800'
                      }`}>
                        {payment.status}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">Aucun paiement</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PropertyManagementDashboard;
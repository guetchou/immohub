import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, DollarSign, Home, Users } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

const Reports = () => {
  const { toast } = useToast();

  const { data: stats, isLoading } = useQuery({
    queryKey: ['rental-stats'],
    queryFn: async () => {
      try {
        const [properties, payments, leases] = await Promise.all([
          supabase.from('properties').select('count'),
          supabase.from('rent_payments').select('amount'),
          supabase.from('lease_contracts').select('count')
        ]);

        return {
          propertyCount: properties.count || 0,
          totalPayments: payments.data?.reduce((sum, payment) => sum + payment.amount, 0) || 0,
          leaseCount: leases.count || 0
        };
      } catch (error) {
        console.error("Error fetching stats:", error);
        toast({
          title: "Erreur",
          description: "Impossible de charger les statistiques",
          variant: "destructive",
        });
        throw error;
      }
    }
  });

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Rapports</h1>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Home className="h-5 w-5" />
              État du Patrimoine
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-2xl font-bold">
                {isLoading ? "..." : stats?.propertyCount || 0}
              </p>
              <p className="text-sm text-muted-foreground">
                propriétés en gestion
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Revenus Locatifs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-2xl font-bold">
                {isLoading ? "..." : (stats?.totalPayments || 0).toLocaleString()} FCFA
              </p>
              <p className="text-sm text-muted-foreground">
                total des loyers perçus
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Contrats
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-2xl font-bold">
                {isLoading ? "..." : stats?.leaseCount || 0}
              </p>
              <p className="text-sm text-muted-foreground">
                contrats actifs
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Reports;
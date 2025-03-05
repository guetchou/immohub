
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Home, Wallet, Calendar, CreditCard, TrendingUp, User } from "lucide-react";
import DashboardCard from "@/components/dashboards/DashboardCard";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { format, addMonths, parseISO, isAfter, isBefore, subMonths } from "date-fns";
import { fr } from "date-fns/locale";

const RentStats = () => {
  const [totalPaid, setTotalPaid] = useState<number>(0);
  const [nextPaymentDue, setNextPaymentDue] = useState<string>("À déterminer");
  const [activeLeases, setActiveLeases] = useState<number>(0);
  const [averageRent, setAverageRent] = useState<number>(0);
  const [paymentsTrend, setPaymentsTrend] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchRentStats();
    }
  }, [user]);

  const fetchRentStats = async () => {
    setLoading(true);
    try {
      // Fetch total paid in the last 12 months
      const oneYearAgo = subMonths(new Date(), 12).toISOString().split('T')[0];
      const today = new Date().toISOString().split('T')[0];
      
      const { data: paymentsData } = await supabase
        .from('rent_payments')
        .select('amount, payment_date')
        .gte('payment_date', oneYearAgo)
        .lte('payment_date', today)
        .eq(user?.role === 'TENANT' ? 'tenant_id' : 'status', user?.role === 'TENANT' ? user.id : 'completed');
      
      if (paymentsData) {
        const total = paymentsData.reduce((sum, payment) => sum + Number(payment.amount), 0);
        setTotalPaid(total);
        
        // Calculate payment trend (last 3 months vs previous 3 months)
        const lastThreeMonths = paymentsData.filter(p => 
          isAfter(parseISO(p.payment_date), subMonths(new Date(), 3))
        ).reduce((sum, payment) => sum + Number(payment.amount), 0);
        
        const previousThreeMonths = paymentsData.filter(p => 
          isBefore(parseISO(p.payment_date), subMonths(new Date(), 3)) && 
          isAfter(parseISO(p.payment_date), subMonths(new Date(), 6))
        ).reduce((sum, payment) => sum + Number(payment.amount), 0);
        
        const trend = previousThreeMonths === 0 ? 100 : ((lastThreeMonths - previousThreeMonths) / previousThreeMonths) * 100;
        setPaymentsTrend(trend);
      }
      
      // Fetch active leases
      const { data: leasesData } = await supabase
        .from('lease_contracts')
        .select('id, monthly_rent, end_date')
        .eq('status', 'active')
        .eq(user?.role === 'TENANT' ? 'tenant_id' : 'id', user?.role === 'TENANT' ? user.id : 'id') // This is just a trick to get all for landlord or filter by tenant_id for tenant
        .gte('end_date', today);
        
      if (leasesData) {
        setActiveLeases(leasesData.length);
        
        // Calculate average rent
        if (leasesData.length > 0) {
          const total = leasesData.reduce((sum, lease) => sum + Number(lease.monthly_rent), 0);
          setAverageRent(total / leasesData.length);
        }
        
        // Determine next payment due date (1st of next month)
        const nextMonth = addMonths(new Date(), 1);
        const nextPaymentDate = new Date(nextMonth.getFullYear(), nextMonth.getMonth(), 1);
        setNextPaymentDue(format(nextPaymentDate, 'dd MMMM yyyy', { locale: fr }));
      }
    } catch (error) {
      console.error("Erreur lors du chargement des statistiques:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Tabs defaultValue="overview" className="w-full">
      <TabsList className="grid grid-cols-2 mb-4">
        <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
        <TabsTrigger value="performance">Performance</TabsTrigger>
      </TabsList>
      <TabsContent value="overview" className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <DashboardCard
            title="Total payé (12 mois)"
            value={`${totalPaid.toLocaleString()} FCFA`}
            icon={Wallet}
            description="Montant total des paiements sur 12 mois"
          />
          <DashboardCard
            title="Prochain paiement"
            value={nextPaymentDue}
            icon={Calendar}
            description="Date du prochain paiement prévu"
          />
          <DashboardCard
            title="Contrats actifs"
            value={activeLeases.toString()}
            icon={Home}
            description="Nombre de contrats de location en cours"
          />
        </div>
      </TabsContent>
      <TabsContent value="performance" className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <DashboardCard
            title="Loyer moyen"
            value={`${averageRent.toLocaleString()} FCFA`}
            icon={CreditCard}
            description="Montant moyen des loyers mensuels"
          />
          <DashboardCard
            title="Évolution des paiements"
            value={`${paymentsTrend.toFixed(1)}%`}
            icon={TrendingUp}
            description="Évolution sur les 3 derniers mois"
          />
          {user?.role === 'LANDLORD' && (
            <DashboardCard
              title="Locataires actifs"
              value={activeLeases.toString()}
              icon={User}
              description="Nombre de locataires actifs"
            />
          )}
        </div>
      </TabsContent>
    </Tabs>
  );
};

export default RentStats;

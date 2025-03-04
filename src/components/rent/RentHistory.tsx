
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import RentPaymentsList from "./RentPaymentsList";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { format, parseISO, subMonths, getMonth, getYear } from "date-fns";
import { fr } from "date-fns/locale";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TrendingUp, AlertCircle, Loader2 } from "lucide-react";

const RentHistory = () => {
  const [chartData, setChartData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchPaymentData();
    }
  }, [user]);

  const fetchPaymentData = async () => {
    setLoading(true);
    try {
      // Obtenir les 12 derniers mois
      const now = new Date();
      const twelveMonthsAgo = subMonths(now, 11);
      
      let query = supabase
        .from('rent_payments')
        .select(`payment_date, amount, status`)
        .gte('payment_date', twelveMonthsAgo.toISOString().split('T')[0])
        .order('payment_date', { ascending: true });
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      // Préparer les données pour le graphique
      const monthlyData: Record<string, number> = {};
      
      // Initialiser tous les mois avec 0
      for (let i = 0; i < 12; i++) {
        const d = subMonths(now, i);
        const monthKey = format(d, 'yyyy-MM');
        monthlyData[monthKey] = 0;
      }
      
      // Remplir avec les données réelles
      if (data) {
        data.forEach(payment => {
          const date = parseISO(payment.payment_date);
          const monthKey = format(date, 'yyyy-MM');
          
          if (monthlyData[monthKey] !== undefined) {
            monthlyData[monthKey] += Number(payment.amount);
          }
        });
      }
      
      // Transformer en format pour recharts
      const formattedData = Object.entries(monthlyData)
        .sort(([aKey], [bKey]) => aKey.localeCompare(bKey))
        .map(([monthKey, total]) => {
          const [year, month] = monthKey.split('-');
          return {
            month: format(new Date(parseInt(year), parseInt(month) - 1, 1), 'MMM yyyy', { locale: fr }),
            total,
            formattedTotal: `${total.toLocaleString()} FCFA`
          };
        });
      
      setChartData(formattedData);
    } catch (error) {
      console.error("Erreur lors du chargement des données de paiement:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Évolution des Paiements
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData} margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip 
                  formatter={(value: number) => [`${value.toLocaleString()} FCFA`, 'Montant']}
                  labelFormatter={(label) => `${label}`}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="total" 
                  name="Montant (FCFA)" 
                  stroke="#4CAF50" 
                  activeDot={{ r: 8 }} 
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">Aucune donnée disponible</h3>
              <p className="text-muted-foreground mt-1">
                Effectuez des paiements pour voir leur évolution dans le temps.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <RentPaymentsList />
    </div>
  );
};

export default RentHistory;

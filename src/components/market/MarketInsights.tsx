import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { analyzeMarketTrends } from "@/utils/marketAnalysis";
import { ChartLine, ChartBar, MapPin } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface MarketTrend {
  period: string;
  averagePrice: number;
  numberOfTransactions: number;
  priceEvolution: number;
}

const MarketInsights = () => {
  const [trends, setTrends] = useState<MarketTrend[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const loadTrends = async () => {
      try {
        console.log("Loading market trends...");
        const data = await analyzeMarketTrends("Brazzaville", "month");
        setTrends(data);
      } catch (error) {
        console.error("Error loading market trends:", error);
        toast({
          title: "Erreur",
          description: "Impossible de charger les tendances du marché",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadTrends();
  }, [toast]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-48">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-real-primary" />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Prix Moyen</CardTitle>
          <ChartLine className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {trends[0]?.averagePrice.toLocaleString()} FCFA
          </div>
          <p className="text-xs text-muted-foreground">
            {trends[0]?.priceEvolution > 0 ? "+" : ""}
            {trends[0]?.priceEvolution.toFixed(1)}% depuis le mois dernier
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Transactions</CardTitle>
          <ChartBar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {trends[0]?.numberOfTransactions}
          </div>
          <p className="text-xs text-muted-foreground">
            Transactions ce mois
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Zone la plus active</CardTitle>
          <MapPin className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">Plateau</div>
          <p className="text-xs text-muted-foreground">
            35% des transactions
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default MarketInsights;
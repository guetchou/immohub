import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Line } from "@nivo/line";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";

interface PriceData {
  month: string;
  value: number;
}

interface TrendData {
  id: string;
  data: Array<{ x: string; y: number }>;
}

const MarketTrends = () => {
  const [priceData, setPriceData] = useState<PriceData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCity, setSelectedCity] = useState<string>("all");
  const { toast } = useToast();

  useEffect(() => {
    fetchPriceData();
  }, [selectedCity]);

  const fetchPriceData = async () => {
    try {
      console.log("Fetching price data for city:", selectedCity);
      let query = supabase
        .from('property_prices')
        .select(`
          price,
          created_at,
          properties!inner(city)
        `)
        .order('created_at', { ascending: true });

      if (selectedCity !== "all") {
        query = query.eq('properties.city', selectedCity);
      }

      const { data: prices, error } = await query;

      if (error) throw error;

      console.log("Received price data:", prices);

      const aggregatedData = prices.reduce((acc: PriceData[], curr) => {
        const month = new Date(curr.created_at).toLocaleDateString('fr-FR', { 
          month: 'short', 
          year: 'numeric' 
        });
        
        const existingMonth = acc.find(item => item.month === month);
        
        if (existingMonth) {
          existingMonth.value = (existingMonth.value + curr.price) / 2;
        } else {
          acc.push({ month, value: curr.price });
        }
        
        return acc;
      }, []);

      setPriceData(aggregatedData);
    } catch (error) {
      console.error('Error fetching price data:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les tendances du marché",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const chartData: TrendData[] = [
    {
      id: "Prix moyen",
      data: priceData.map(d => ({
        x: d.month,
        y: d.value,
      })),
    },
  ];

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Tendances du Marché Immobilier</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Skeleton className="h-[400px] w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tendances du Marché Immobilier</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="graph" className="space-y-4">
          <TabsList>
            <TabsTrigger value="graph">Graphique</TabsTrigger>
            <TabsTrigger value="cities">Par Ville</TabsTrigger>
          </TabsList>

          <div className="mb-4">
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="w-full p-2 border rounded"
            >
              <option value="all">Toutes les villes</option>
              <option value="Brazzaville">Brazzaville</option>
              <option value="Pointe-Noire">Pointe-Noire</option>
              <option value="Dolisie">Dolisie</option>
            </select>
          </div>

          <TabsContent value="graph" className="h-[400px]">
            <Line
              data={chartData}
              margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
              xScale={{ type: 'point' }}
              yScale={{
                type: 'linear',
                min: 'auto',
                max: 'auto',
                stacked: false,
              }}
              axisTop={null}
              axisRight={null}
              axisBottom={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: -45,
                legend: 'Mois',
                legendOffset: 36,
                legendPosition: 'middle'
              }}
              axisLeft={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: 'Prix (FCFA)',
                legendOffset: -40,
                legendPosition: 'middle'
              }}
              pointSize={10}
              pointColor={{ theme: 'background' }}
              pointBorderWidth={2}
              pointBorderColor={{ from: 'serieColor' }}
              enableGridX={false}
              colors={{ scheme: 'category10' }}
              legends={[
                {
                  anchor: 'bottom-right',
                  direction: 'column',
                  justify: false,
                  translateX: 100,
                  translateY: 0,
                  itemsSpacing: 0,
                  itemDirection: 'left-to-right',
                  itemWidth: 80,
                  itemHeight: 20,
                  itemOpacity: 0.75,
                  symbolSize: 12,
                  symbolShape: 'circle',
                  symbolBorderColor: 'rgba(0, 0, 0, .5)',
                  effects: [
                    {
                      on: 'hover',
                      style: {
                        itemBackground: 'rgba(0, 0, 0, .03)',
                        itemOpacity: 1
                      }
                    }
                  ]
                }
              ]}
            />
          </TabsContent>

          <TabsContent value="cities">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {['Brazzaville', 'Pointe-Noire', 'Dolisie'].map((city) => (
                <Card key={city}>
                  <CardHeader>
                    <CardTitle className="text-lg">{city}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-real-primary">
                      {priceData.length > 0 
                        ? `${Math.round(priceData[priceData.length - 1].value).toLocaleString()} FCFA`
                        : "Données non disponibles"}
                    </div>
                    <p className="text-sm text-gray-500">Prix moyen</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default MarketTrends;
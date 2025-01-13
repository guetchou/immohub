import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Line } from "@nivo/line";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface PriceData {
  month: string;
  value: number;
}

const MarketTrends = () => {
  const [priceData, setPriceData] = useState<PriceData[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchPriceData();
  }, []);

  const fetchPriceData = async () => {
    try {
      const { data: prices, error } = await supabase
        .from('property_prices')
        .select('price, created_at')
        .order('created_at', { ascending: true });

      if (error) throw error;

      const aggregatedData = prices.reduce((acc: PriceData[], curr) => {
        const month = new Date(curr.created_at).toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' });
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

  if (loading) {
    return <div className="flex justify-center p-8">Chargement des tendances...</div>;
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Tendances du Marché Immobilier</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[400px]">
          <Line
            width={800}
            height={400}
            data={[
              {
                id: "Prix moyen",
                data: priceData.map(d => ({
                  x: d.month,
                  y: d.value,
                })),
              },
            ]}
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
        </div>
      </CardContent>
    </Card>
  );
};

export default MarketTrends;
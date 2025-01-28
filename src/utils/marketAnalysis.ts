import { supabase } from "@/integrations/supabase/client";

interface MarketTrend {
  period: string;
  averagePrice: number;
  numberOfTransactions: number;
  priceEvolution: number;
}

export const analyzeMarketTrends = async (city: string, period: 'month' | 'quarter' | 'year'): Promise<MarketTrend[]> => {
  console.log(`Analyzing market trends for ${city} over ${period}`);
  
  const { data: prices, error } = await supabase
    .from('property_prices')
    .select(`
      price,
      created_at,
      properties!inner(city)
    `)
    .eq('properties.city', city)
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error fetching market trends:', error);
    throw error;
  }

  // Grouper les prix par période
  const groupedPrices = prices.reduce((acc: Record<string, number[]>, curr) => {
    const date = new Date(curr.created_at);
    const periodKey = period === 'month' 
      ? `${date.getFullYear()}-${date.getMonth() + 1}`
      : period === 'quarter'
      ? `${date.getFullYear()}-Q${Math.floor(date.getMonth() / 3) + 1}`
      : `${date.getFullYear()}`;

    if (!acc[periodKey]) {
      acc[periodKey] = [];
    }
    acc[periodKey].push(curr.price);
    return acc;
  }, {});

  // Calculer les tendances
  return Object.entries(groupedPrices).map(([period, prices]) => {
    const averagePrice = prices.reduce((a, b) => a + b, 0) / prices.length;
    const previousPrices = prices.slice(0, -1);
    const priceEvolution = previousPrices.length 
      ? ((averagePrice - (previousPrices.reduce((a, b) => a + b, 0) / previousPrices.length)) / averagePrice) * 100
      : 0;

    return {
      period,
      averagePrice,
      numberOfTransactions: prices.length,
      priceEvolution
    };
  });
};
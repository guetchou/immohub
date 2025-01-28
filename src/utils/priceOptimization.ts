import { supabase } from "@/integrations/supabase/client";

interface PriceFactors {
  surface: number;
  location: string;
  propertyType: string;
  features: string[];
}

interface OptimalPrice {
  price: number;
  confidence: number;
  range: {
    min: number;
    max: number;
  };
  factors: {
    name: string;
    impact: number;
  }[];
}

export const calculateOptimalPrice = async (
  propertyId: string,
  factors: PriceFactors
): Promise<OptimalPrice> => {
  console.log("Calculating optimal price for property:", propertyId);

  // Récupérer les prix moyens par m² dans la zone
  const { data: similarProperties } = await supabase
    .from('properties')
    .select(`
      surface_area,
      city,
      property_prices (
        price,
        price_type
      )
    `)
    .eq('city', factors.location)
    .eq('type_id', factors.propertyType);

  if (!similarProperties || similarProperties.length === 0) {
    throw new Error('Données insuffisantes pour le calcul');
  }

  // Calculer le prix moyen par m²
  const pricesPerSqm = similarProperties
    .filter(p => p.surface_area && p.property_prices?.[0]?.price)
    .map(p => p.property_prices[0].price / p.surface_area!);

  const avgPricePerSqm = pricesPerSqm.reduce((a, b) => a + b, 0) / pricesPerSqm.length;

  // Facteurs d'ajustement
  const priceFactors = [
    { name: 'Surface', impact: 1.0 },
    { name: 'Localisation', impact: calculateLocationImpact(factors.location) },
    ...factors.features.map(feature => ({
      name: feature,
      impact: calculateFeatureImpact(feature)
    }))
  ];

  // Calculer le prix optimal
  const basePrice = factors.surface * avgPricePerSqm;
  const totalImpact = priceFactors.reduce((acc, factor) => acc * factor.impact, 1);
  const optimalPrice = Math.round(basePrice * totalImpact);

  return {
    price: optimalPrice,
    confidence: calculateConfidence(similarProperties.length),
    range: {
      min: Math.round(optimalPrice * 0.9),
      max: Math.round(optimalPrice * 1.1)
    },
    factors: priceFactors
  };
};

const calculateLocationImpact = (location: string): number => {
  const locationFactors: Record<string, number> = {
    'Brazzaville': 1.2,
    'Pointe-Noire': 1.1,
    'Dolisie': 0.9
  };
  return locationFactors[location] || 1.0;
};

const calculateFeatureImpact = (feature: string): number => {
  const featureFactors: Record<string, number> = {
    'piscine': 1.15,
    'vue_mer': 1.2,
    'jardin': 1.1,
    'parking': 1.05,
    'securite': 1.08,
    'ascenseur': 1.03
  };
  return featureFactors[feature] || 1.0;
};

const calculateConfidence = (sampleSize: number): number => {
  if (sampleSize >= 20) return 0.95;
  if (sampleSize >= 10) return 0.85;
  if (sampleSize >= 5) return 0.75;
  return 0.6;
};
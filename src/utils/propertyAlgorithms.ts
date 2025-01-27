import { supabase } from "@/integrations/supabase/client";

interface PropertyScore {
  id: string;
  score: number;
}

export const calculatePropertyRecommendations = async (
  userId: string,
  preferences: {
    minPrice?: number;
    maxPrice?: number;
    minSurface?: number;
    maxSurface?: number;
    location?: string;
    propertyType?: string;
  }
) => {
  console.log("Calculating recommendations for user:", userId);
  
  // Récupérer l'historique des vues et favoris de l'utilisateur
  const { data: favorites } = await supabase
    .from("favorites")
    .select("property_id")
    .eq("user_id", userId);

  // Récupérer toutes les propriétés
  const { data: properties } = await supabase
    .from("properties")
    .select(`
      id,
      title,
      description,
      type_id,
      city,
      surface_area,
      property_prices (
        price,
        price_type
      )
    `);

  if (!properties) return [];

  const propertyScores: PropertyScore[] = properties.map((property) => {
    let score = 0;

    // Score basé sur les préférences de prix
    if (preferences.minPrice && preferences.maxPrice) {
      const propertyPrice = property.property_prices?.[0]?.price || 0;
      if (
        propertyPrice >= preferences.minPrice &&
        propertyPrice <= preferences.maxPrice
      ) {
        score += 30;
      }
    }

    // Score basé sur la localisation
    if (preferences.location && property.city === preferences.location) {
      score += 25;
    }

    // Score basé sur la surface
    if (
      preferences.minSurface &&
      preferences.maxSurface &&
      property.surface_area
    ) {
      if (
        property.surface_area >= preferences.minSurface &&
        property.surface_area <= preferences.maxSurface
      ) {
        score += 20;
      }
    }

    // Bonus si la propriété est dans les favoris
    if (favorites?.some((fav) => fav.property_id === property.id)) {
      score += 15;
    }

    return {
      id: property.id,
      score,
    };
  });

  return propertyScores
    .sort((a, b) => b.score - a.score)
    .slice(0, 5)
    .map((score) => score.id);
};

export const calculateOptimalPrice = async (
  propertyId: string,
  params: {
    surface: number;
    location: string;
    propertyType: string;
    features: string[];
  }
) => {
  console.log("Calculating optimal price for property:", propertyId);

  // Récupérer les prix moyens par m² dans la zone
  const { data: similarProperties } = await supabase
    .from("properties")
    .select(`
      id,
      surface_area,
      city,
      property_prices (
        price,
        price_type
      )
    `)
    .eq("city", params.location)
    .eq("type_id", params.propertyType);

  if (!similarProperties || similarProperties.length === 0) {
    return null;
  }

  // Calculer le prix moyen par m²
  const pricesPerSqm = similarProperties
    .filter(
      (p) =>
        p.surface_area &&
        p.property_prices &&
        p.property_prices[0]?.price
    )
    .map((p) => {
      const price = p.property_prices[0].price;
      return price / (p.surface_area || 1);
    });

  const avgPricePerSqm =
    pricesPerSqm.reduce((acc, curr) => acc + curr, 0) / pricesPerSqm.length;

  // Ajuster le prix en fonction des caractéristiques
  let adjustmentFactor = 1.0;
  
  // Bonus pour chaque caractéristique premium
  params.features.forEach((feature) => {
    switch (feature) {
      case "piscine":
        adjustmentFactor += 0.15;
        break;
      case "vue_mer":
        adjustmentFactor += 0.2;
        break;
      case "jardin":
        adjustmentFactor += 0.1;
        break;
      case "parking":
        adjustmentFactor += 0.05;
        break;
      default:
        break;
    }
  });

  const optimalPrice = Math.round(
    params.surface * avgPricePerSqm * adjustmentFactor
  );

  return {
    optimalPrice,
    priceRange: {
      min: Math.round(optimalPrice * 0.9),
      max: Math.round(optimalPrice * 1.1),
    },
    confidence: calculateConfidenceScore(similarProperties.length),
  };
};

const calculateConfidenceScore = (sampleSize: number): number => {
  if (sampleSize >= 20) return 0.95;
  if (sampleSize >= 10) return 0.85;
  if (sampleSize >= 5) return 0.75;
  return 0.6;
};
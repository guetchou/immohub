import { supabase } from "@/integrations/supabase/client";

interface PropertyPreferences {
  minPrice?: number;
  maxPrice?: number;
  minSurface?: number;
  maxSurface?: number;
  location?: string;
  propertyType?: string;
}

interface PropertyScore {
  id: string;
  score: number;
  matchingCriteria: string[];
}

export const getPropertyRecommendations = async (
  userId: string,
  preferences: PropertyPreferences
): Promise<PropertyScore[]> => {
  console.log("Getting property recommendations for user:", userId);

  // Récupérer l'historique des vues et favoris
  const { data: favorites } = await supabase
    .from('favorites')
    .select('property_id')
    .eq('user_id', userId);

  // Récupérer toutes les propriétés
  const { data: properties } = await supabase
    .from('properties')
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

  return properties.map(property => {
    let score = 0;
    const matchingCriteria: string[] = [];

    // Score basé sur le prix
    if (preferences.minPrice && preferences.maxPrice) {
      const propertyPrice = property.property_prices?.[0]?.price || 0;
      if (propertyPrice >= preferences.minPrice && propertyPrice <= preferences.maxPrice) {
        score += 30;
        matchingCriteria.push('Prix correspondant');
      }
    }

    // Score basé sur la localisation
    if (preferences.location && property.city === preferences.location) {
      score += 25;
      matchingCriteria.push('Localisation idéale');
    }

    // Score basé sur la surface
    if (preferences.minSurface && preferences.maxSurface && property.surface_area) {
      if (property.surface_area >= preferences.minSurface && 
          property.surface_area <= preferences.maxSurface) {
        score += 20;
        matchingCriteria.push('Surface adaptée');
      }
    }

    // Bonus si dans les favoris
    if (favorites?.some(fav => fav.property_id === property.id)) {
      score += 15;
      matchingCriteria.push('Dans vos favoris');
    }

    return {
      id: property.id,
      score,
      matchingCriteria
    };
  }).sort((a, b) => b.score - a.score);
};
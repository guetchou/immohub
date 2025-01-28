import { supabase } from "@/integrations/supabase/client";

interface NeighborhoodScore {
  name: string;
  overallScore: number;
  categories: {
    safety: number;
    accessibility: number;
    amenities: number;
    lifestyle: number;
  };
  details: {
    schools: number;
    transport: number;
    shopping: number;
    restaurants: number;
    parks: number;
  };
}

export const calculateNeighborhoodScore = async (
  neighborhoodId: string
): Promise<NeighborhoodScore> => {
  console.log("Calculating neighborhood score for:", neighborhoodId);

  // Récupérer les données du quartier
  const { data: neighborhood } = await supabase
    .from('neighborhoods')
    .select('*')
    .eq('id', neighborhoodId)
    .single();

  if (!neighborhood) {
    throw new Error('Quartier non trouvé');
  }

  // Simuler le calcul des scores (à remplacer par de vraies données)
  const calculateCategoryScore = () => Math.floor(Math.random() * 30 + 70);
  const calculateDetailScore = () => Math.floor(Math.random() * 20 + 80);

  const categories = {
    safety: calculateCategoryScore(),
    accessibility: calculateCategoryScore(),
    amenities: calculateCategoryScore(),
    lifestyle: calculateCategoryScore()
  };

  const details = {
    schools: calculateDetailScore(),
    transport: calculateDetailScore(),
    shopping: calculateDetailScore(),
    restaurants: calculateDetailScore(),
    parks: calculateDetailScore()
  };

  const overallScore = Math.floor(
    Object.values(categories).reduce((a, b) => a + b, 0) / 4
  );

  return {
    name: neighborhood.name,
    overallScore,
    categories,
    details
  };
};
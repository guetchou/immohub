import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { calculatePropertyRecommendations } from "@/utils/propertyRecommendation";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { House, Star } from "lucide-react";

interface Recommendation {
  id: string;
  score: number;
  matchingCriteria: string[];
}

const SmartRecommendations = () => {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const loadRecommendations = async () => {
      if (!user) return;

      try {
        console.log("Loading recommendations for user:", user.id);
        const data = await calculatePropertyRecommendations(user.id, {
          location: "Brazzaville",
          minPrice: 100000000,
          maxPrice: 500000000,
        });

        setRecommendations(data);
      } catch (error) {
        console.error("Error loading recommendations:", error);
        toast({
          title: "Erreur",
          description: "Impossible de charger les recommandations",
          variant: "destructive",
        });
      }
    };

    loadRecommendations();
  }, [user, toast]);

  if (!user) {
    return null;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold flex items-center gap-2">
        <Star className="h-6 w-6 text-real-primary" />
        Recommandations Personnalisées
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {recommendations.map((rec) => (
          <Card key={rec.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <House className="h-5 w-5 text-real-primary mt-1" />
                <div>
                  <div className="font-medium">Score de correspondance: {rec.score}%</div>
                  <div className="text-sm text-muted-foreground mt-1">
                    {rec.matchingCriteria.map((criteria, index) => (
                      <span key={index} className="block">• {criteria}</span>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default SmartRecommendations;
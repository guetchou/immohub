import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";

type Lifestyle = "student" | "single" | "family" | "professional";

interface LifestylePreferences {
  lifestyle: Lifestyle;
  budget: string;
  preferredAreas: string[];
  mustHaveFeatures: string[];
}

const LifestyleQuestionnaire = () => {
  const [preferences, setPreferences] = useState<LifestylePreferences>({
    lifestyle: "single",
    budget: "medium",
    preferredAreas: [],
    mustHaveFeatures: [],
  });
  const { toast } = useToast();

  const handleSubmit = async () => {
    try {
      // Save preferences to user profile
      toast({
        title: "Préférences enregistrées",
        description: "Vos préférences ont été mises à jour avec succès.",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible d'enregistrer vos préférences.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="p-6 space-y-6">
      <h3 className="text-lg font-semibold">Vos Préférences de Logement</h3>

      <div className="space-y-6">
        <div className="space-y-2">
          <Label>Votre situation</Label>
          <RadioGroup
            value={preferences.lifestyle}
            onValueChange={(value: Lifestyle) => 
              setPreferences(prev => ({ ...prev, lifestyle: value }))}
          >
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="student" id="student" />
                <Label htmlFor="student">Étudiant</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="single" id="single" />
                <Label htmlFor="single">Célibataire</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="family" id="family" />
                <Label htmlFor="family">Famille</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="professional" id="professional" />
                <Label htmlFor="professional">Professionnel</Label>
              </div>
            </div>
          </RadioGroup>
        </div>

        <div className="space-y-2">
          <Label>Budget</Label>
          <RadioGroup
            value={preferences.budget}
            onValueChange={(value) => 
              setPreferences(prev => ({ ...prev, budget: value }))}
          >
            <div className="grid grid-cols-3 gap-4">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="low" id="low" />
                <Label htmlFor="low">Économique</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="medium" id="medium" />
                <Label htmlFor="medium">Moyen</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="high" id="high" />
                <Label htmlFor="high">Premium</Label>
              </div>
            </div>
          </RadioGroup>
        </div>

        <Button onClick={handleSubmit} className="w-full">
          Enregistrer mes préférences
        </Button>
      </div>
    </Card>
  );
};

export default LifestyleQuestionnaire;
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

interface APIKeyForm {
  mtnApiKey: string;
  airtelApiKey: string;
}

const APIKeyManager = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { register, handleSubmit } = useForm<APIKeyForm>();

  const onSubmit = async (data: APIKeyForm) => {
    console.log("Submitting API keys:", data);
    setIsSubmitting(true);
    try {
      // Simulation d'une requête API
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast({
        title: "Clés API sauvegardées",
        description: "Les clés API ont été mises à jour avec succès.",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la sauvegarde des clés API.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gestion des Clés API</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="mtnApiKey">Clé API MTN Money</Label>
            <Input
              id="mtnApiKey"
              type="password"
              {...register("mtnApiKey")}
              placeholder="Entrez votre clé API MTN Money"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="airtelApiKey">Clé API Airtel Money</Label>
            <Input
              id="airtelApiKey"
              type="password"
              {...register("airtelApiKey")}
              placeholder="Entrez votre clé API Airtel Money"
            />
          </div>

          <Button 
            type="submit" 
            className="w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Sauvegarde en cours..." : "Sauvegarder les clés"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default APIKeyManager;
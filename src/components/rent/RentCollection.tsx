import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Wallet } from "lucide-react";

const RentCollection = () => {
  const [amount, setAmount] = useState("");
  const [reference, setReference] = useState("");
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // TODO: Implement actual payment processing
      toast({
        title: "Paiement enregistré",
        description: `Le paiement de ${amount} FCFA a été enregistré avec succès.`,
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors du traitement du paiement.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wallet className="h-5 w-5" />
          Collection des Loyers
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="amount">Montant (FCFA)</Label>
            <Input
              id="amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
              placeholder="Entrez le montant"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="reference">Référence du paiement</Label>
            <Input
              id="reference"
              value={reference}
              onChange={(e) => setReference(e.target.value)}
              required
              placeholder="Ex: LOYER-2024-03"
            />
          </div>

          <Button type="submit" className="w-full">
            Enregistrer le paiement
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default RentCollection;
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Wallet, Calendar } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const RentCollection = () => {
  const [amount, setAmount] = useState("");
  const [reference, setReference] = useState("");
  const [paymentDate, setPaymentDate] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase
        .from('rent_payments')
        .insert([
          {
            amount: Number(amount),
            reference,
            payment_date: paymentDate,
            status: 'completed'
          }
        ]);

      if (error) throw error;

      toast({
        title: "Paiement enregistré",
        description: `Le paiement de ${Number(amount).toLocaleString()} FCFA a été enregistré avec succès.`,
      });

      // Reset form
      setAmount("");
      setReference("");
      setPaymentDate("");
    } catch (error) {
      console.error("Error processing payment:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors du traitement du paiement.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
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
            <Label htmlFor="paymentDate">Date du paiement</Label>
            <Input
              id="paymentDate"
              type="date"
              value={paymentDate}
              onChange={(e) => setPaymentDate(e.target.value)}
              required
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

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Traitement en cours..." : "Enregistrer le paiement"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default RentCollection;
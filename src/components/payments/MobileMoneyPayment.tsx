import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

type PaymentProvider = "mtn" | "airtel";

interface PaymentFormData {
  amount: number;
  phoneNumber: string;
  provider: PaymentProvider;
}

const MobileMoneyPayment = ({ amount }: { amount: number }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [provider, setProvider] = useState<PaymentProvider>("mtn");
  const [phoneNumber, setPhoneNumber] = useState("");
  const { toast } = useToast();

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      const { data, error } = await supabase.functions.invoke('process-payment', {
        body: {
          amount,
          phoneNumber,
          provider,
        }
      });

      if (error) throw error;

      toast({
        title: "Paiement initié",
        description: "Veuillez confirmer le paiement sur votre téléphone",
      });

      console.log("Payment initiated:", data);
    } catch (error) {
      console.error("Payment error:", error);
      toast({
        title: "Erreur de paiement",
        description: "Une erreur est survenue lors du paiement",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Paiement Mobile Money</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handlePayment} className="space-y-6">
          <div className="space-y-2">
            <Label>Choisissez votre opérateur</Label>
            <RadioGroup
              value={provider}
              onValueChange={(value) => setProvider(value as PaymentProvider)}
              className="grid grid-cols-2 gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="mtn" id="mtn" />
                <Label htmlFor="mtn">MTN Mobile Money</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="airtel" id="airtel" />
                <Label htmlFor="airtel">Airtel Money</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Numéro de téléphone</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="+242 XX XXX XXXX"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              required
            />
          </div>

          <div className="pt-4">
            <Button
              type="submit"
              className="w-full"
              disabled={isProcessing}
            >
              {isProcessing ? "Traitement..." : `Payer ${amount.toLocaleString()} FCFA`}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default MobileMoneyPayment;
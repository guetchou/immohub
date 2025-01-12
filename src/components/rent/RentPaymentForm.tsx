import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/components/ui/use-toast";

const RentPaymentForm = () => {
  const [paymentMethod, setPaymentMethod] = useState("mtn");
  const [amount, setAmount] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Processing payment:", { paymentMethod, amount, phoneNumber });

    try {
      // Simulation d'une requête API de paiement
      toast({
        title: "Paiement en cours",
        description: "Veuillez confirmer le paiement sur votre téléphone",
      });
      
      // TODO: Intégrer les APIs MTN et Airtel Money ici
      
    } catch (error) {
      console.error("Payment error:", error);
      toast({
        title: "Erreur de paiement",
        description: "Une erreur est survenue lors du paiement",
        variant: "destructive",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label>Méthode de paiement</Label>
        <RadioGroup
          defaultValue="mtn"
          onValueChange={setPaymentMethod}
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
        <Label htmlFor="amount">Montant (FCFA)</Label>
        <Input
          id="amount"
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="350000"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Numéro de téléphone</Label>
        <Input
          id="phone"
          type="tel"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          placeholder="+242 XX XXX XXXX"
          required
        />
      </div>

      <Button type="submit" className="w-full">
        Payer maintenant
      </Button>
    </form>
  );
};

export default RentPaymentForm;
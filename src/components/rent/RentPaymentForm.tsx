import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card } from "@/components/ui/card";
import { processPayment, PaymentProvider } from "@/services/paymentService";
import { COMMISSION_RATES, calculateCommission, formatCurrency } from "@/utils/commissionConfig";

const RentPaymentForm = () => {
  const [paymentMethod, setPaymentMethod] = useState<PaymentProvider>("mtn");
  const [amount, setAmount] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    const baseAmount = Number(amount);
    const commission = calculateCommission(baseAmount, COMMISSION_RATES.STANDARD);
    const totalAmount = baseAmount + commission;

    try {
      const paymentStatus = await processPayment({
        amount: totalAmount,
        phoneNumber,
        provider: paymentMethod,
        description: "Paiement de loyer",
        reference: `RENT-${Date.now()}`,
      });

      console.log("Payment completed with status:", paymentStatus);
    } finally {
      setIsProcessing(false);
    }
  };

  const baseAmount = Number(amount) || 0;
  const commission = calculateCommission(baseAmount, COMMISSION_RATES.STANDARD);
  const totalAmount = baseAmount + commission;

  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label>Méthode de paiement</Label>
          <RadioGroup
            defaultValue="mtn"
            onValueChange={(value) => setPaymentMethod(value as PaymentProvider)}
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
          <Label htmlFor="amount">Montant du loyer (FCFA)</Label>
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

        {baseAmount > 0 && (
          <div className="bg-gray-50 p-4 rounded-lg space-y-2">
            <div className="flex justify-between">
              <span>Montant du loyer:</span>
              <span>{formatCurrency(baseAmount)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Frais de service (5%):</span>
              <span>{formatCurrency(commission)}</span>
            </div>
            <div className="flex justify-between font-bold border-t pt-2">
              <span>Total à payer:</span>
              <span>{formatCurrency(totalAmount)}</span>
            </div>
          </div>
        )}

        <Button 
          type="submit" 
          className="w-full"
          disabled={isProcessing}
        >
          {isProcessing ? "Traitement en cours..." : "Payer maintenant"}
        </Button>
      </form>
    </Card>
  );
};

export default RentPaymentForm;
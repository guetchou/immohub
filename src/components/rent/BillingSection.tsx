import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";

const BillingSection = () => {
  const [billingInfo, setBillingInfo] = useState({
    name: "",
    address: "",
    email: "",
    taxId: "",
  });
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Billing info updated:", billingInfo);
    toast({
      title: "Informations mises à jour",
      description: "Vos informations de facturation ont été enregistrées",
    });
  };

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold mb-6">Informations de Facturation</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Nom / Raison sociale</Label>
          <Input
            id="name"
            value={billingInfo.name}
            onChange={(e) =>
              setBillingInfo({ ...billingInfo, name: e.target.value })
            }
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="address">Adresse</Label>
          <Input
            id="address"
            value={billingInfo.address}
            onChange={(e) =>
              setBillingInfo({ ...billingInfo, address: e.target.value })
            }
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email de facturation</Label>
          <Input
            id="email"
            type="email"
            value={billingInfo.email}
            onChange={(e) =>
              setBillingInfo({ ...billingInfo, email: e.target.value })
            }
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="taxId">Numéro d'identification fiscale (optionnel)</Label>
          <Input
            id="taxId"
            value={billingInfo.taxId}
            onChange={(e) =>
              setBillingInfo({ ...billingInfo, taxId: e.target.value })
            }
          />
        </div>

        <Button type="submit">Mettre à jour</Button>
      </form>
    </Card>
  );
};

export default BillingSection;
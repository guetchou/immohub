import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const LeaseContract = () => {
  const [contract, setContract] = useState({
    startDate: "",
    endDate: "",
    monthlyRent: "",
    deposit: "",
    terms: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Contract details:", contract);
  };

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold mb-6">Contrat de Location</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="startDate">Date de début</Label>
            <Input
              id="startDate"
              type="date"
              value={contract.startDate}
              onChange={(e) =>
                setContract({ ...contract, startDate: e.target.value })
              }
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="endDate">Date de fin</Label>
            <Input
              id="endDate"
              type="date"
              value={contract.endDate}
              onChange={(e) =>
                setContract({ ...contract, endDate: e.target.value })
              }
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="monthlyRent">Loyer mensuel (FCFA)</Label>
            <Input
              id="monthlyRent"
              type="number"
              value={contract.monthlyRent}
              onChange={(e) =>
                setContract({ ...contract, monthlyRent: e.target.value })
              }
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="deposit">Caution (FCFA)</Label>
            <Input
              id="deposit"
              type="number"
              value={contract.deposit}
              onChange={(e) =>
                setContract({ ...contract, deposit: e.target.value })
              }
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="terms">Conditions particulières</Label>
          <Textarea
            id="terms"
            value={contract.terms}
            onChange={(e) => setContract({ ...contract, terms: e.target.value })}
            rows={4}
          />
        </div>

        <div className="flex justify-end space-x-4">
          <Button type="button" variant="outline">
            Aperçu PDF
          </Button>
          <Button type="submit">Enregistrer le contrat</Button>
        </div>
      </form>
    </Card>
  );
};

export default LeaseContract;
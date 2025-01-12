import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import RentPaymentForm from "./RentPaymentForm";
import RentHistory from "./RentHistory";
import LeaseContract from "./LeaseContract";
import BillingSection from "./BillingSection";
import OfflineSync from "./OfflineSync";

const RentDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const { toast } = useToast();

  console.log("RentDashboard rendered with tab:", activeTab);

  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-3xl font-bold text-real-primary">PayLOyer Dashboard</h1>
      
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="payments">Paiements</TabsTrigger>
          <TabsTrigger value="contracts">Contrats</TabsTrigger>
          <TabsTrigger value="billing">Facturation</TabsTrigger>
          <TabsTrigger value="history">Historique</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="p-4">
              <h3 className="font-semibold">Prochain Paiement</h3>
              <p className="text-2xl font-bold">350,000 FCFA</p>
              <p className="text-sm text-gray-500">Échéance: 05/05/2024</p>
            </Card>
            
            <Card className="p-4">
              <h3 className="font-semibold">Statut du Contrat</h3>
              <p className="text-green-500 font-bold">Actif</p>
              <p className="text-sm text-gray-500">Renouvellement: 12/2024</p>
            </Card>
            
            <Card className="p-4">
              <h3 className="font-semibold">Balance</h3>
              <p className="text-2xl font-bold">0 FCFA</p>
              <p className="text-sm text-gray-500">À jour</p>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="payments">
          <RentPaymentForm />
        </TabsContent>

        <TabsContent value="contracts">
          <LeaseContract />
        </TabsContent>

        <TabsContent value="billing">
          <BillingSection />
        </TabsContent>

        <TabsContent value="history">
          <RentHistory />
        </TabsContent>
      </Tabs>

      <OfflineSync />
    </div>
  );
};

export default RentDashboard;
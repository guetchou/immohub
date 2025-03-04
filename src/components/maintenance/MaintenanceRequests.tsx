
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Wrench, Plus } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import MaintenanceRequestForm from "./MaintenanceRequestForm";
import MaintenanceRequestsList from "./MaintenanceRequestsList";

const MaintenanceRequests = () => {
  const [activeTab, setActiveTab] = useState("list");
  const { user } = useAuth();

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  return (
    <div className="container mx-auto py-6 space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wrench className="h-5 w-5" />
            Demandes de Maintenance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={handleTabChange}>
            <TabsList className="mb-6">
              <TabsTrigger value="list">Liste des Demandes</TabsTrigger>
              <TabsTrigger value="create">
                <Plus className="h-4 w-4 mr-2" />
                Nouvelle Demande
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="list">
              <MaintenanceRequestsList />
            </TabsContent>
            
            <TabsContent value="create">
              <MaintenanceRequestForm onSuccess={() => setActiveTab("list")} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default MaintenanceRequests;


import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { FileText, Plus, Search } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import LeaseForm from "./LeaseForm";
import LeasesList from "./LeasesList";

const LeaseManagement = () => {
  const [activeTab, setActiveTab] = useState("list");
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    // Réinitialiser à la liste quand l'utilisateur change
    if (user) {
      setActiveTab("list");
    }
  }, [user]);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  return (
    <div className="container mx-auto py-6 space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Gestion des Contrats de Bail
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={handleTabChange}>
            <TabsList className="mb-6">
              <TabsTrigger value="list">Liste des Contrats</TabsTrigger>
              {(user?.role === 'LANDLORD' || user?.role === 'ADMIN') && (
                <TabsTrigger value="create">
                  <Plus className="h-4 w-4 mr-2" />
                  Nouveau Contrat
                </TabsTrigger>
              )}
            </TabsList>
            
            <TabsContent value="list">
              <LeasesList />
            </TabsContent>
            
            <TabsContent value="create">
              <LeaseForm onSuccess={() => setActiveTab("list")} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default LeaseManagement;

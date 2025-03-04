
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import RentCollection from "@/components/rent/RentCollection";
import RentHistory from "@/components/rent/RentHistory";
import { useAuth } from "@/contexts/AuthContext";
import { Plus, History, AlertTriangle, CreditCard, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";

const RentDashboard = () => {
  const [activeTab, setActiveTab] = useState("collection");
  const { user, hasRole } = useAuth();
  const navigate = useNavigate();

  // Rediriger l'utilisateur si pas authentifié ou pas le bon rôle
  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Gestion des Loyers</h1>
          <p className="text-muted-foreground mt-1">
            {hasRole(["LANDLORD", "ADMIN"]) 
              ? "Suivez et gérez les paiements de loyer de vos locataires" 
              : "Gérez vos paiements de loyer et consultez votre historique"}
          </p>
        </div>
        
        {hasRole(["LANDLORD", "ADMIN"]) && (
          <Button onClick={() => navigate("/properties")}>
            <Plus className="mr-2 h-4 w-4" />
            Nouvelle Propriété
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {hasRole(["LANDLORD", "ADMIN"]) ? "Revenus Mensuels" : "Loyer Mensuel"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <CreditCard className="h-5 w-5 text-muted-foreground mr-2" />
              <div className="text-2xl font-bold">350,000 FCFA</div>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {hasRole(["LANDLORD", "ADMIN"]) ? "4 locataires actifs" : "Prochain paiement: 1er du mois"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {hasRole(["LANDLORD", "ADMIN"]) ? "Taux de Perception" : "Statut"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <TrendingUp className="h-5 w-5 text-green-500 mr-2" />
              <div className="text-2xl font-bold text-green-500">
                {hasRole(["LANDLORD", "ADMIN"]) ? "95%" : "À jour"}
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {hasRole(["LANDLORD", "ADMIN"]) ? "Augmentation de 5% ce mois" : "Tous les paiements sont à jour"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {hasRole(["LANDLORD", "ADMIN"]) ? "Paiements en Retard" : "Solde Caution"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <AlertTriangle className={`h-5 w-5 ${hasRole(["LANDLORD", "ADMIN"]) ? "text-yellow-500" : "text-blue-500"} mr-2`} />
              <div className={`text-2xl font-bold ${hasRole(["LANDLORD", "ADMIN"]) ? "text-yellow-500" : "text-blue-500"}`}>
                {hasRole(["LANDLORD", "ADMIN"]) ? "1" : "700,000 FCFA"}
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {hasRole(["LANDLORD", "ADMIN"]) ? "Rappel envoyé" : "2 mois de caution"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {hasRole(["LANDLORD", "ADMIN"]) ? "Contrats Actifs" : "Contrat"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <History className="h-5 w-5 text-primary mr-2" />
              <div className="text-2xl font-bold">
                {hasRole(["LANDLORD", "ADMIN"]) ? "4" : "12 mois"}
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {hasRole(["LANDLORD", "ADMIN"]) ? "1 renouvellement à venir" : "Expire le 31/12/2024"}
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full max-w-md grid grid-cols-2">
          <TabsTrigger value="collection">
            <Plus className="mr-2 h-4 w-4" />
            {hasRole(["LANDLORD", "ADMIN"]) ? "Enregistrer Paiement" : "Effectuer Paiement"}
          </TabsTrigger>
          <TabsTrigger value="history">
            <History className="mr-2 h-4 w-4" />
            Historique
          </TabsTrigger>
        </TabsList>
        <TabsContent value="collection" className="mt-6">
          <RentCollection />
        </TabsContent>
        <TabsContent value="history" className="mt-6">
          <RentHistory />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RentDashboard;

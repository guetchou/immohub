
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Wallet, Calendar, Receipt, Loader2, PiggyBank } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import RentPaymentsList from "./RentPaymentsList";
import RentStats from "./RentStats";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const RentCollection = () => {
  const [amount, setAmount] = useState("");
  const [reference, setReference] = useState("");
  const [paymentDate, setPaymentDate] = useState("");
  const [note, setNote] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [isLoading, setIsLoading] = useState(false);
  const [tenants, setTenants] = useState<Array<{ id: string, name: string, email: string }>>([]);
  const [selectedTenant, setSelectedTenant] = useState("");
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    // Générer une référence par défaut basée sur la date
    const today = new Date();
    const month = today.getMonth() + 1;
    const year = today.getFullYear();
    setReference(`LOYER-${year}-${month.toString().padStart(2, '0')}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`);
    
    // Définir la date du jour comme date par défaut
    const formattedDate = today.toISOString().split('T')[0];
    setPaymentDate(formattedDate);
    
    // Charger la liste des locataires pour les propriétaires
    if (user?.role === 'LANDLORD' || user?.role === 'ADMIN') {
      fetchTenants();
    }
  }, [user]);

  const fetchTenants = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name')
        .in('role', ['TENANT']);
      
      if (error) throw error;
      
      if (data) {
        setTenants(data.map(tenant => ({
          id: tenant.id,
          name: tenant.full_name || 'Sans nom',
          email: '' // Nous n'utilisons pas l'email dans cette interface
        })));
      }
    } catch (error) {
      console.error("Erreur lors du chargement des locataires:", error);
      toast({
        title: "Erreur",
        description: "Impossible de charger la liste des locataires",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Vérifier si les champs obligatoires sont remplis
      if (!amount || !paymentDate) {
        throw new Error("Veuillez remplir tous les champs obligatoires");
      }

      // Déterminer l'ID du locataire (soit sélectionné par le propriétaire, soit l'utilisateur actuel si c'est un locataire)
      const tenantId = user?.role === 'TENANT' 
        ? user.id 
        : selectedTenant;

      const { data, error } = await supabase
        .from('rent_payments')
        .insert([
          {
            amount: Number(amount),
            reference,
            payment_date: paymentDate,
            status: 'completed',
            payment_method: paymentMethod,
            tenant_id: tenantId,
            note
          }
        ]);

      if (error) throw error;

      toast({
        title: "Paiement enregistré",
        description: `Le paiement de ${Number(amount).toLocaleString()} FCFA a été enregistré avec succès.`,
      });

      // Réinitialiser le formulaire
      setAmount("");
      // Générer une nouvelle référence
      const today = new Date();
      const month = today.getMonth() + 1;
      const year = today.getFullYear();
      setReference(`LOYER-${year}-${month.toString().padStart(2, '0')}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`);
      setNote("");
      setSelectedTenant("");
    } catch (error: any) {
      console.error("Erreur lors du traitement du paiement:", error);
      toast({
        title: "Erreur",
        description: error.message || "Une erreur est survenue lors du traitement du paiement.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row gap-8">
        <Card className="flex-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PiggyBank className="h-5 w-5" />
              Tableau de Bord Financier
            </CardTitle>
          </CardHeader>
          <CardContent>
            <RentStats />
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="payment-form" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="payment-form">Enregistrer un Paiement</TabsTrigger>
          <TabsTrigger value="payment-history">Historique des Paiements</TabsTrigger>
        </TabsList>
        
        <TabsContent value="payment-form" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wallet className="h-5 w-5" />
                {user?.role === 'LANDLORD' || user?.role === 'ADMIN'
                  ? "Enregistrement des Paiements de Loyer" 
                  : "Paiement de Loyer"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="amount">Montant (FCFA) *</Label>
                  <Input
                    id="amount"
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                    placeholder="Entrez le montant"
                  />
                </div>

                {(user?.role === 'LANDLORD' || user?.role === 'ADMIN') && (
                  <div className="space-y-2">
                    <Label htmlFor="tenant">Locataire *</Label>
                    <Select
                      value={selectedTenant}
                      onValueChange={setSelectedTenant}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner un locataire" />
                      </SelectTrigger>
                      <SelectContent>
                        {tenants.map((tenant) => (
                          <SelectItem key={tenant.id} value={tenant.id}>
                            {tenant.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="paymentDate">Date du paiement *</Label>
                  <Input
                    id="paymentDate"
                    type="date"
                    value={paymentDate}
                    onChange={(e) => setPaymentDate(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="paymentMethod">Méthode de paiement</Label>
                  <Select 
                    value={paymentMethod}
                    onValueChange={setPaymentMethod}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionnez une méthode" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cash">Espèces</SelectItem>
                      <SelectItem value="mobile_money">Mobile Money</SelectItem>
                      <SelectItem value="bank_transfer">Virement bancaire</SelectItem>
                      <SelectItem value="check">Chèque</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="reference">Référence du paiement</Label>
                  <Input
                    id="reference"
                    value={reference}
                    onChange={(e) => setReference(e.target.value)}
                    placeholder="Ex: LOYER-2024-03"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="note">Note</Label>
                  <Textarea
                    id="note"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Informations supplémentaires sur ce paiement"
                    rows={3}
                  />
                </div>

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Traitement en cours...
                    </>
                  ) : (
                    "Enregistrer le paiement"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="payment-history" className="space-y-4 mt-4">
          <RentPaymentsList />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RentCollection;

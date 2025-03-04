
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface LeaseFormProps {
  onSuccess: () => void;
  leaseId?: string;
}

const LeaseForm = ({ onSuccess, leaseId }: LeaseFormProps) => {
  const [properties, setProperties] = useState<any[]>([]);
  const [tenants, setTenants] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [formLoading, setFormLoading] = useState(!!leaseId);
  const { toast } = useToast();
  const { user } = useAuth();
  
  // Form data
  const [formData, setFormData] = useState({
    propertyId: "",
    tenantId: "",
    startDate: "",
    endDate: "",
    monthlyRent: "",
    depositAmount: "",
    terms: ""
  });

  useEffect(() => {
    fetchProperties();
    fetchTenants();
    
    if (leaseId) {
      fetchLeaseDetails();
    } else {
      // Set default dates for new leases
      const today = new Date();
      const endDate = new Date();
      endDate.setFullYear(today.getFullYear() + 1);
      
      setFormData(prev => ({
        ...prev,
        startDate: today.toISOString().split('T')[0],
        endDate: endDate.toISOString().split('T')[0]
      }));
    }
  }, [leaseId]);

  const fetchLeaseDetails = async () => {
    try {
      const { data, error } = await supabase
        .from('lease_contracts')
        .select('*')
        .eq('id', leaseId)
        .single();
      
      if (error) throw error;
      
      if (data) {
        setFormData({
          propertyId: data.property_id || "",
          tenantId: data.tenant_id || "",
          startDate: data.start_date || "",
          endDate: data.end_date || "",
          monthlyRent: data.monthly_rent?.toString() || "",
          depositAmount: data.deposit_amount?.toString() || "",
          terms: data.terms || ""
        });
      }
    } catch (error) {
      console.error("Erreur lors du chargement des détails du bail:", error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les détails du bail",
        variant: "destructive",
      });
    } finally {
      setFormLoading(false);
    }
  };

  const fetchProperties = async () => {
    try {
      const { data, error } = await supabase
        .from('properties')
        .select('id, title, address')
        .eq('owner_id', user?.id);
      
      if (error) throw error;
      setProperties(data || []);
    } catch (error) {
      console.error("Erreur lors du chargement des propriétés:", error);
    }
  };

  const fetchTenants = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name')
        .eq('role', 'TENANT');
      
      if (error) throw error;
      setTenants(data || []);
    } catch (error) {
      console.error("Erreur lors du chargement des locataires:", error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const leaseData = {
        property_id: formData.propertyId,
        tenant_id: formData.tenantId,
        start_date: formData.startDate,
        end_date: formData.endDate,
        monthly_rent: parseFloat(formData.monthlyRent),
        deposit_amount: parseFloat(formData.depositAmount),
        terms: formData.terms,
        owner_id: user?.id,
        status: 'active'
      };
      
      let response;
      if (leaseId) {
        response = await supabase
          .from('lease_contracts')
          .update(leaseData)
          .eq('id', leaseId);
      } else {
        response = await supabase
          .from('lease_contracts')
          .insert([leaseData]);
      }
      
      if (response.error) throw response.error;
      
      toast({
        title: leaseId ? "Contrat modifié" : "Contrat créé",
        description: leaseId
          ? "Le contrat de bail a été mis à jour avec succès."
          : "Le nouveau contrat de bail a été créé avec succès.",
      });
      
      onSuccess();
    } catch (error: any) {
      console.error("Erreur lors de l'enregistrement du contrat:", error);
      toast({
        title: "Erreur",
        description: error.message || "Une erreur est survenue lors de l'enregistrement du contrat.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (formLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="propertyId">Propriété *</Label>
            <Select
              name="propertyId"
              value={formData.propertyId}
              onValueChange={(value) => handleSelectChange("propertyId", value)}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner une propriété" />
              </SelectTrigger>
              <SelectContent>
                {properties.map((property) => (
                  <SelectItem key={property.id} value={property.id}>
                    {property.title} - {property.address}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="tenantId">Locataire *</Label>
            <Select
              name="tenantId"
              value={formData.tenantId}
              onValueChange={(value) => handleSelectChange("tenantId", value)}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un locataire" />
              </SelectTrigger>
              <SelectContent>
                {tenants.map((tenant) => (
                  <SelectItem key={tenant.id} value={tenant.id}>
                    {tenant.full_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Date de début *</Label>
              <Input
                id="startDate"
                name="startDate"
                type="date"
                value={formData.startDate}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="endDate">Date de fin *</Label>
              <Input
                id="endDate"
                name="endDate"
                type="date"
                value={formData.endDate}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="monthlyRent">Loyer mensuel (FCFA) *</Label>
              <Input
                id="monthlyRent"
                name="monthlyRent"
                type="number"
                value={formData.monthlyRent}
                onChange={handleInputChange}
                required
                placeholder="Ex: 150000"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="depositAmount">Caution (FCFA) *</Label>
              <Input
                id="depositAmount"
                name="depositAmount"
                type="number"
                value={formData.depositAmount}
                onChange={handleInputChange}
                required
                placeholder="Ex: 300000"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="terms">Conditions et termes du contrat</Label>
            <Textarea
              id="terms"
              name="terms"
              value={formData.terms}
              onChange={handleInputChange}
              placeholder="Détails du contrat, clauses spéciales..."
              rows={5}
            />
          </div>

          <div className="flex gap-4 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => onSuccess()}
            >
              Annuler
            </Button>
            
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Enregistrement...
                </>
              ) : leaseId ? (
                "Mettre à jour"
              ) : (
                "Créer le contrat"
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default LeaseForm;

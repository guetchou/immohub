
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

interface MaintenanceRequestFormProps {
  onSuccess: () => void;
  requestId?: string;
}

const MaintenanceRequestForm = ({ onSuccess, requestId }: MaintenanceRequestFormProps) => {
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [formLoading, setFormLoading] = useState(!!requestId);
  const { toast } = useToast();
  const { user } = useAuth();
  
  // Form data
  const [formData, setFormData] = useState({
    propertyId: "",
    title: "",
    description: "",
    priority: "medium",
    location: ""
  });

  useEffect(() => {
    fetchProperties();
    
    if (requestId) {
      fetchRequestDetails();
    }
  }, [requestId]);

  const fetchRequestDetails = async () => {
    // This would be implemented if we had the maintenance_requests table
    // For now, we'll just set the form loading to false
    setFormLoading(false);
  };

  const fetchProperties = async () => {
    try {
      let query = supabase.from('properties').select('id, title, address');
      
      // Filter by role
      if (user?.role === 'TENANT') {
        // For tenants, we would normally fetch only properties they're renting
        // For now, let's just assume they can see all properties
      } else if (user?.role === 'LANDLORD') {
        query = query.eq('owner_id', user.id);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      setProperties(data || []);
    } catch (error) {
      console.error("Erreur lors du chargement des propriétés:", error);
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
      // For now just simulate the submission
      setTimeout(() => {
        toast({
          title: "Demande enregistrée",
          description: "Votre demande de maintenance a été enregistrée avec succès.",
        });
        
        onSuccess();
      }, 1000);
    } catch (error: any) {
      console.error("Erreur lors de l'enregistrement de la demande:", error);
      toast({
        title: "Erreur",
        description: error.message || "Une erreur est survenue lors de l'enregistrement de la demande.",
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
            <Label htmlFor="propertyId">Propriété concernée *</Label>
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
            <Label htmlFor="title">Titre de la demande *</Label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Ex: Fuite d'eau dans la salle de bain"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="location">Emplacement spécifique *</Label>
            <Input
              id="location"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              placeholder="Ex: Salle de bain principale, cuisine..."
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="priority">Priorité</Label>
            <Select
              name="priority"
              value={formData.priority}
              onValueChange={(value) => handleSelectChange("priority", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner la priorité" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Basse</SelectItem>
                <SelectItem value="medium">Moyenne</SelectItem>
                <SelectItem value="high">Haute</SelectItem>
                <SelectItem value="emergency">Urgence</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description détaillée *</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Décrivez le problème en détail..."
              rows={5}
              required
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
                  Envoi en cours...
                </>
              ) : requestId ? (
                "Mettre à jour"
              ) : (
                "Envoyer la demande"
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default MaintenanceRequestForm;

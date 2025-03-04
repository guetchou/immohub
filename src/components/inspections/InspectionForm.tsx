
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface InspectionFormProps {
  onSuccess: () => void;
  inspectionId?: string;
}

const InspectionForm = ({ onSuccess, inspectionId }: InspectionFormProps) => {
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [formLoading, setFormLoading] = useState(!!inspectionId);
  const { toast } = useToast();
  const { user } = useAuth();
  
  // Form data
  const [formData, setFormData] = useState({
    propertyId: "",
    inspectionDate: "",
    summary: "",
    type: "entry" // entry, routine, exit
  });
  
  // Inspection items
  const [items, setItems] = useState<Array<{
    area: string;
    condition: string;
    notes: string;
    id?: string;
  }>>([]);

  useEffect(() => {
    fetchProperties();
    
    if (inspectionId) {
      fetchInspectionDetails();
    } else {
      // Set default date for new inspection
      const today = new Date();
      setFormData(prev => ({
        ...prev,
        inspectionDate: today.toISOString().split('T')[0]
      }));
      
      // Add initial empty item
      setItems([{ area: "", condition: "good", notes: "" }]);
    }
  }, [inspectionId]);

  const fetchInspectionDetails = async () => {
    // This would be implemented if we had the inspection table
    // For now, we'll just set the form loading to false
    setFormLoading(false);
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleItemChange = (index: number, field: string, value: string) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setItems(newItems);
  };
  
  const addItem = () => {
    setItems([...items, { area: "", condition: "good", notes: "" }]);
  };
  
  const removeItem = (index: number) => {
    if (items.length > 1) {
      const newItems = [...items];
      newItems.splice(index, 1);
      setItems(newItems);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // For now just simulate the submission
      setTimeout(() => {
        toast({
          title: "Inspection enregistrée",
          description: "L'inspection a été enregistrée avec succès.",
        });
        
        onSuccess();
      }, 1000);
    } catch (error: any) {
      console.error("Erreur lors de l'enregistrement de l'inspection:", error);
      toast({
        title: "Erreur",
        description: error.message || "Une erreur est survenue lors de l'enregistrement de l'inspection.",
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
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="inspectionDate">Date d'inspection *</Label>
                <Input
                  id="inspectionDate"
                  name="inspectionDate"
                  type="date"
                  value={formData.inspectionDate}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="type">Type d'inspection *</Label>
                <Select
                  name="type"
                  value={formData.type}
                  onValueChange={(value) => handleSelectChange("type", value)}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="entry">État des lieux d'entrée</SelectItem>
                    <SelectItem value="routine">Inspection de routine</SelectItem>
                    <SelectItem value="exit">État des lieux de sortie</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="summary">Résumé général</Label>
              <Textarea
                id="summary"
                name="summary"
                value={formData.summary}
                onChange={handleInputChange}
                placeholder="Résumé général de l'inspection..."
                rows={3}
              />
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Éléments inspectés</h3>
              <Button type="button" variant="outline" size="sm" onClick={addItem}>
                <Plus className="h-4 w-4 mr-2" />
                Ajouter un élément
              </Button>
            </div>
            
            <div className="space-y-4">
              {items.map((item, index) => (
                <div key={index} className="border rounded-md p-4 space-y-4">
                  <div className="flex justify-between items-start">
                    <div className="space-y-2 flex-1 mr-4">
                      <Label htmlFor={`area-${index}`}>Zone / Élément *</Label>
                      <Input
                        id={`area-${index}`}
                        value={item.area}
                        onChange={(e) => handleItemChange(index, "area", e.target.value)}
                        placeholder="Ex: Salon, Cuisine, Chambre 1..."
                        required
                      />
                    </div>
                    
                    <div className="space-y-2 w-1/3">
                      <Label htmlFor={`condition-${index}`}>État *</Label>
                      <Select
                        value={item.condition}
                        onValueChange={(value) => handleItemChange(index, "condition", value)}
                      >
                        <SelectTrigger id={`condition-${index}`}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="excellent">Excellent</SelectItem>
                          <SelectItem value="good">Bon</SelectItem>
                          <SelectItem value="fair">Moyen</SelectItem>
                          <SelectItem value="poor">Mauvais</SelectItem>
                          <SelectItem value="damaged">Endommagé</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeItem(index)}
                      disabled={items.length <= 1}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                      <span className="sr-only">Supprimer</span>
                    </Button>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor={`notes-${index}`}>Notes</Label>
                    <Textarea
                      id={`notes-${index}`}
                      value={item.notes}
                      onChange={(e) => handleItemChange(index, "notes", e.target.value)}
                      placeholder="Détails supplémentaires sur l'état..."
                      rows={2}
                    />
                  </div>
                </div>
              ))}
            </div>
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
              ) : inspectionId ? (
                "Mettre à jour"
              ) : (
                "Enregistrer l'inspection"
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default InspectionForm;

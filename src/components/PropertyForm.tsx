import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface PropertyFormProps {
  propertyId?: string;
  onSuccess?: () => void;
}

const PropertyForm = ({ propertyId, onSuccess }: PropertyFormProps) => {
  const [propertyTypes, setPropertyTypes] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { register, handleSubmit, setValue, reset } = useForm();

  useEffect(() => {
    fetchPropertyTypes();
    if (propertyId) {
      fetchPropertyDetails();
    }
  }, [propertyId]);

  const fetchPropertyTypes = async () => {
    const { data } = await supabase.from('property_types').select('*');
    setPropertyTypes(data || []);
  };

  const fetchPropertyDetails = async () => {
    if (!propertyId) return;

    const { data } = await supabase
      .from('properties')
      .select('*')
      .eq('id', propertyId)
      .single();

    if (data) {
      Object.entries(data).forEach(([key, value]) => {
        setValue(key, value);
      });
    }
  };

  const onSubmit = async (data: any) => {
    setLoading(true);
    try {
      const { error } = propertyId
        ? await supabase
            .from('properties')
            .update(data)
            .eq('id', propertyId)
        : await supabase
            .from('properties')
            .insert([{ ...data, owner_id: (await supabase.auth.getUser()).data.user?.id }]);

      if (error) throw error;

      toast({
        title: "Succès",
        description: propertyId ? "Propriété mise à jour" : "Propriété créée",
      });

      if (onSuccess) onSuccess();
      if (!propertyId) reset();
    } catch (error) {
      console.error("Error saving property:", error);
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder la propriété",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-4">
        <Input
          {...register("title")}
          placeholder="Titre de la propriété"
          required
        />

        <Textarea
          {...register("description")}
          placeholder="Description"
          className="min-h-[100px]"
        />

        <Select
          onValueChange={(value) => setValue("type_id", value)}
          required
        >
          <SelectTrigger>
            <SelectValue placeholder="Type de bien" />
          </SelectTrigger>
          <SelectContent>
            {propertyTypes.map((type) => (
              <SelectItem key={type.id} value={type.id}>
                {type.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Input
          {...register("address")}
          placeholder="Adresse"
          required
        />

        <Input
          {...register("city")}
          placeholder="Ville"
          required
        />

        <div className="grid grid-cols-2 gap-4">
          <Input
            {...register("surface_area")}
            type="number"
            placeholder="Surface (m²)"
          />
          <Input
            {...register("price")}
            type="number"
            placeholder="Prix"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Input
            {...register("bedrooms")}
            type="number"
            placeholder="Chambres"
          />
          <Input
            {...register("bathrooms")}
            type="number"
            placeholder="Salles de bain"
          />
        </div>
      </div>

      <Button type="submit" disabled={loading}>
        {loading ? "Enregistrement..." : propertyId ? "Mettre à jour" : "Créer"}
      </Button>
    </form>
  );
};

export default PropertyForm;
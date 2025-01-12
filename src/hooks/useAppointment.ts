import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { AppointmentFormData, Appointment, VisitType } from "@/types/appointment";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

export const useAppointment = () => {
  const [formData, setFormData] = useState<AppointmentFormData>({
    type: "physical",
    date: undefined,
    time: "",
    clientName: "",
    clientEmail: "",
    clientPhone: "",
    notes: "",
  });
  const { toast } = useToast();

  const updateFormData = (field: keyof AppointmentFormData, value: any) => {
    console.log(`Updating ${field}:`, value);
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const validateForm = (): boolean => {
    if (!formData.date) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner une date",
        variant: "destructive",
      });
      return false;
    }

    if (!formData.time) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner une heure",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const createAppointment = async (): Promise<Appointment | null> => {
    if (!validateForm()) return null;

    console.log("Creating appointment with data:", formData);

    // Simuler la création d'un rendez-vous (à remplacer par un appel API)
    const appointment: Appointment = {
      ...formData,
      id: Math.random().toString(36).substr(2, 9),
      propertyId: "demo-property",
      status: "pending",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    toast({
      title: "Rendez-vous planifié",
      description: `Votre visite ${formData.type === "physical" ? "physique" : "virtuelle"} est programmée pour le ${format(formData.date!, "d MMMM yyyy", { locale: fr })} à ${formData.time}`,
    });

    return appointment;
  };

  const resetForm = () => {
    setFormData({
      type: "physical",
      date: undefined,
      time: "",
      clientName: "",
      clientEmail: "",
      clientPhone: "",
      notes: "",
    });
  };

  return {
    formData,
    updateFormData,
    createAppointment,
    resetForm,
  };
};
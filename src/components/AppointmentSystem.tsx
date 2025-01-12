import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Calendar as CalendarIcon, Clock, MapPin, Video } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

type VisitType = "physical" | "virtual";
type AppointmentStatus = "pending" | "confirmed" | "cancelled" | "completed";

interface Appointment {
  id: string;
  date: Date;
  time: string;
  type: VisitType;
  propertyId: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  status: AppointmentStatus;
  notes?: string;
}

const AppointmentSystem = () => {
  const [date, setDate] = useState<Date>();
  const [appointmentData, setAppointmentData] = useState({
    type: "physical" as VisitType,
    time: "",
    clientName: "",
    clientEmail: "",
    clientPhone: "",
    notes: "",
  });
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!date) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner une date",
        variant: "destructive",
      });
      return;
    }

    // Simuler la création d'un rendez-vous
    const appointment: Appointment = {
      id: Math.random().toString(36).substr(2, 9),
      date: date,
      status: "pending",
      propertyId: "demo-property", // À remplacer par l'ID réel de la propriété
      ...appointmentData,
    };

    console.log("Nouveau rendez-vous créé:", appointment);
    
    toast({
      title: "Rendez-vous planifié",
      description: `Votre visite ${appointmentData.type === "physical" ? "physique" : "virtuelle"} est programmée pour le ${format(date, "d MMMM yyyy", { locale: fr })} à ${appointmentData.time}`,
    });

    // Réinitialiser le formulaire
    setDate(undefined);
    setAppointmentData({
      type: "physical",
      time: "",
      clientName: "",
      clientEmail: "",
      clientPhone: "",
      notes: "",
    });
  };

  const availableTimeSlots = [
    "09:00", "10:00", "11:00", "14:00", "15:00", "16:00"
  ];

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-real-primary mb-6">
        Planification de visite
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Type de visite</label>
              <div className="flex gap-4">
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="visitType"
                    value="physical"
                    checked={appointmentData.type === "physical"}
                    onChange={(e) => setAppointmentData({ 
                      ...appointmentData, 
                      type: e.target.value as VisitType 
                    })}
                    className="text-real-primary"
                  />
                  <span className="flex items-center">
                    <MapPin className="w-4 h-4 mr-1" />
                    Visite physique
                  </span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="visitType"
                    value="virtual"
                    checked={appointmentData.type === "virtual"}
                    onChange={(e) => setAppointmentData({ 
                      ...appointmentData, 
                      type: e.target.value as VisitType 
                    })}
                    className="text-real-primary"
                  />
                  <span className="flex items-center">
                    <Video className="w-4 h-4 mr-1" />
                    Visite virtuelle
                  </span>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                <CalendarIcon className="w-4 h-4 inline-block mr-1" />
                Date de visite
              </label>
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="rounded-md border"
                disabled={(date) => date < new Date()}
                locale={fr}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                <Clock className="w-4 h-4 inline-block mr-1" />
                Heure de visite
              </label>
              <select
                value={appointmentData.time}
                onChange={(e) => setAppointmentData({ ...appointmentData, time: e.target.value })}
                className="w-full p-2 border rounded-md"
                required
              >
                <option value="">Sélectionnez une heure</option>
                {availableTimeSlots.map((time) => (
                  <option key={time} value={time}>
                    {time}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Nom complet</label>
              <Input
                value={appointmentData.clientName}
                onChange={(e) => setAppointmentData({ ...appointmentData, clientName: e.target.value })}
                placeholder="Votre nom"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <Input
                type="email"
                value={appointmentData.clientEmail}
                onChange={(e) => setAppointmentData({ ...appointmentData, clientEmail: e.target.value })}
                placeholder="votre@email.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Téléphone</label>
              <Input
                type="tel"
                value={appointmentData.clientPhone}
                onChange={(e) => setAppointmentData({ ...appointmentData, clientPhone: e.target.value })}
                placeholder="Votre numéro de téléphone"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Notes / Questions</label>
              <textarea
                value={appointmentData.notes}
                onChange={(e) => setAppointmentData({ ...appointmentData, notes: e.target.value })}
                placeholder="Questions ou informations supplémentaires..."
                className="w-full p-2 border rounded-md h-32 resize-none"
              />
            </div>
          </div>
        </div>

        <Button type="submit" className="w-full bg-real-primary hover:bg-real-primary/90">
          Planifier la visite
        </Button>
      </form>
    </div>
  );
};

export default AppointmentSystem;
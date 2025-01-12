import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import VisitTypeSelector from "./appointment/VisitTypeSelector";
import TimeSlotSelector from "./appointment/TimeSlotSelector";
import ContactForm from "./appointment/ContactForm";
import { useAppointment } from "@/hooks/useAppointment";

const AppointmentSystem = () => {
  const { formData, updateFormData, createAppointment, resetForm } = useAppointment();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const appointment = await createAppointment();
    if (appointment) {
      console.log("Appointment created:", appointment);
      resetForm();
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-real-primary mb-6">
        Planification de visite
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <VisitTypeSelector
              value={formData.type}
              onChange={(value) => updateFormData("type", value)}
            />

            <div>
              <label className="block text-sm font-medium mb-2">
                <CalendarIcon className="w-4 h-4 inline-block mr-1" />
                Date de visite
              </label>
              <Calendar
                mode="single"
                selected={formData.date}
                onSelect={(date) => updateFormData("date", date)}
                className="rounded-md border"
                disabled={(date) => date < new Date()}
                locale={fr}
              />
            </div>

            <TimeSlotSelector
              value={formData.time}
              onChange={(value) => updateFormData("time", value)}
            />
          </div>

          <ContactForm
            clientName={formData.clientName}
            clientEmail={formData.clientEmail}
            clientPhone={formData.clientPhone}
            notes={formData.notes || ""}
            onChange={updateFormData}
          />
        </div>

        <Button type="submit" className="w-full bg-real-primary hover:bg-real-primary/90">
          Planifier la visite
        </Button>
      </form>
    </div>
  );
};

export default AppointmentSystem;
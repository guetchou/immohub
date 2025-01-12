import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Calendar } from "lucide-react";

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
    appointmentDate: "",
    appointmentTime: "",
    visitType: "physical", // "physical" ou "virtual"
  });
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    
    toast({
      title: "Demande envoyée",
      description: "Nous vous contacterons rapidement pour confirmer votre rendez-vous.",
    });
    
    setFormData({
      name: "",
      email: "",
      phone: "",
      message: "",
      appointmentDate: "",
      appointmentTime: "",
      visitType: "physical",
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          type="text"
          placeholder="Nom complet"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
        <Input
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
        />
      </div>
      
      <Input
        type="tel"
        placeholder="Téléphone"
        value={formData.phone}
        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
        required
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Date de visite</label>
          <Input
            type="date"
            value={formData.appointmentDate}
            onChange={(e) => setFormData({ ...formData, appointmentDate: e.target.value })}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Heure de visite</label>
          <Input
            type="time"
            value={formData.appointmentTime}
            onChange={(e) => setFormData({ ...formData, appointmentTime: e.target.value })}
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Type de visite</label>
        <div className="flex gap-4">
          <label className="flex items-center">
            <input
              type="radio"
              name="visitType"
              value="physical"
              checked={formData.visitType === "physical"}
              onChange={(e) => setFormData({ ...formData, visitType: e.target.value })}
              className="mr-2"
            />
            Visite physique
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              name="visitType"
              value="virtual"
              checked={formData.visitType === "virtual"}
              onChange={(e) => setFormData({ ...formData, visitType: e.target.value })}
              className="mr-2"
            />
            Visite virtuelle
          </label>
        </div>
      </div>

      <Textarea
        placeholder="Message ou questions supplémentaires"
        value={formData.message}
        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
        required
      />

      <Button type="submit" className="w-full bg-real-primary hover:bg-real-primary/90">
        <Calendar className="mr-2 h-4 w-4" />
        Planifier la visite
      </Button>
    </form>
  );
};

export default ContactForm;
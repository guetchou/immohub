import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Calendar, Mail, Phone, MessageSquare, MapPin } from "lucide-react";

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
    appointmentDate: "",
    appointmentTime: "",
    visitType: "physical",
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
    <form onSubmit={handleSubmit} className="space-y-6 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-real-primary" />
            Nom complet
          </label>
          <Input
            type="text"
            className="input-modern"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
            <Mail className="w-4 h-4 text-real-primary" />
            Email
          </label>
          <Input
            type="email"
            className="input-modern"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
          <Phone className="w-4 h-4 text-real-primary" />
          Téléphone
        </label>
        <Input
          type="tel"
          className="input-modern"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-real-primary" />
            Date de visite
          </label>
          <Input
            type="date"
            className="input-modern"
            value={formData.appointmentDate}
            onChange={(e) => setFormData({ ...formData, appointmentDate: e.target.value })}
            required
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
            <Clock className="w-4 h-4 text-real-primary" />
            Heure de visite
          </label>
          <Input
            type="time"
            className="input-modern"
            value={formData.appointmentTime}
            onChange={(e) => setFormData({ ...formData, appointmentTime: e.target.value })}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
          <MapPin className="w-4 h-4 text-real-primary" />
          Type de visite
        </label>
        <div className="flex gap-6">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="visitType"
              value="physical"
              checked={formData.visitType === "physical"}
              onChange={(e) => setFormData({ ...formData, visitType: e.target.value })}
              className="text-real-primary focus:ring-real-primary"
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">Visite physique</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="visitType"
              value="virtual"
              checked={formData.visitType === "virtual"}
              onChange={(e) => setFormData({ ...formData, visitType: e.target.value })}
              className="text-real-primary focus:ring-real-primary"
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">Visite virtuelle</span>
          </label>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-real-primary" />
          Message
        </label>
        <Textarea
          className="input-modern min-h-[100px]"
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          required
        />
      </div>

      <Button
        type="submit"
        className="w-full bg-real-primary hover:bg-real-primary/90 text-white btn-modern"
      >
        <Calendar className="mr-2 h-4 w-4" />
        Planifier la visite
      </Button>
    </form>
  );
};

export default ContactForm;
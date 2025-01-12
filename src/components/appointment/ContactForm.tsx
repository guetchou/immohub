import { Input } from "@/components/ui/input";

interface ContactFormProps {
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  notes: string;
  onChange: (field: string, value: string) => void;
}

const ContactForm = ({
  clientName,
  clientEmail,
  clientPhone,
  notes,
  onChange,
}: ContactFormProps) => {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">Nom complet</label>
        <Input
          value={clientName}
          onChange={(e) => onChange("clientName", e.target.value)}
          placeholder="Votre nom"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Email</label>
        <Input
          type="email"
          value={clientEmail}
          onChange={(e) => onChange("clientEmail", e.target.value)}
          placeholder="votre@email.com"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Téléphone</label>
        <Input
          type="tel"
          value={clientPhone}
          onChange={(e) => onChange("clientPhone", e.target.value)}
          placeholder="Votre numéro de téléphone"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Notes / Questions</label>
        <textarea
          value={notes}
          onChange={(e) => onChange("notes", e.target.value)}
          placeholder="Questions ou informations supplémentaires..."
          className="w-full p-2 border rounded-md h-32 resize-none"
        />
      </div>
    </div>
  );
};

export default ContactForm;
import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { useToast } from "@/components/ui/use-toast";

type TicketPriority = "low" | "medium" | "high";

interface Ticket {
  id: string;
  title: string;
  description: string;
  status: "open" | "in-progress" | "closed";
  type: string;
  priority: TicketPriority;
  createdAt: Date;
}

const TicketSystem = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [newTicket, setNewTicket] = useState({
    title: "",
    description: "",
    type: "complaint",
    priority: "medium" as TicketPriority,
  });
  const { toast } = useToast();

  const handleSubmitTicket = (e: React.FormEvent) => {
    e.preventDefault();
    const ticket: Ticket = {
      id: Date.now().toString(),
      ...newTicket,
      status: "open",
      createdAt: new Date(),
    };
    
    setTickets([ticket, ...tickets]);
    setNewTicket({
      title: "",
      description: "",
      type: "complaint",
      priority: "medium",
    });
    
    toast({
      title: "Ticket créé",
      description: "Votre ticket a été soumis avec succès.",
    });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-real-primary mb-6">Système de Tickets</h2>
      
      <form onSubmit={handleSubmitTicket} className="space-y-4 mb-8">
        <Input
          placeholder="Titre du ticket"
          value={newTicket.title}
          onChange={(e) => setNewTicket({ ...newTicket, title: e.target.value })}
          required
        />
        
        <Textarea
          placeholder="Description détaillée"
          value={newTicket.description}
          onChange={(e) => setNewTicket({ ...newTicket, description: e.target.value })}
          required
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <select
            className="w-full p-2 border rounded"
            value={newTicket.type}
            onChange={(e) => setNewTicket({ ...newTicket, type: e.target.value })}
          >
            <option value="complaint">Réclamation</option>
            <option value="support">Support technique</option>
            <option value="information">Demande d'information</option>
          </select>
          
          <select
            className="w-full p-2 border rounded"
            value={newTicket.priority}
            onChange={(e) => setNewTicket({ ...newTicket, priority: e.target.value as TicketPriority })}
          >
            <option value="low">Basse priorité</option>
            <option value="medium">Priorité moyenne</option>
            <option value="high">Haute priorité</option>
          </select>
        </div>
        
        <Button type="submit" className="w-full bg-real-primary hover:bg-real-primary/90">
          Soumettre le ticket
        </Button>
      </form>
      
      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Vos tickets</h3>
        {tickets.map((ticket) => (
          <div
            key={ticket.id}
            className="border p-4 rounded-lg hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start">
              <h4 className="font-semibold">{ticket.title}</h4>
              <span className={`px-2 py-1 rounded text-sm ${
                ticket.status === "open" ? "bg-green-100 text-green-800" :
                ticket.status === "in-progress" ? "bg-yellow-100 text-yellow-800" :
                "bg-gray-100 text-gray-800"
              }`}>
                {ticket.status}
              </span>
            </div>
            <p className="text-gray-600 mt-2">{ticket.description}</p>
            <div className="flex justify-between items-center mt-4 text-sm text-gray-500">
              <span>Priorité: {ticket.priority}</span>
              <span>{new Date(ticket.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TicketSystem;
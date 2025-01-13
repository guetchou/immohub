import { toast } from "sonner";

export type PaymentProvider = "mtn" | "airtel";
export type PaymentStatus = "pending" | "completed" | "failed";

interface PaymentRequest {
  amount: number;
  phoneNumber: string;
  provider: PaymentProvider;
  description: string;
  reference: string;
}

export const processPayment = async (paymentDetails: PaymentRequest): Promise<PaymentStatus> => {
  console.log("Processing payment:", paymentDetails);
  
  try {
    // Simuler l'appel API au fournisseur de paiement
    const response = await mockPaymentProviderAPI(paymentDetails);
    
    if (response.status === "completed") {
      toast.success("Paiement effectué avec succès");
      return "completed";
    } else {
      toast.error("Le paiement a échoué");
      return "failed";
    }
  } catch (error) {
    console.error("Payment error:", error);
    toast.error("Erreur lors du traitement du paiement");
    return "failed";
  }
};

// Simulation d'API de paiement (à remplacer par les vraies APIs MTN/Airtel)
const mockPaymentProviderAPI = async (details: PaymentRequest): Promise<{ status: PaymentStatus }> => {
  await new Promise(resolve => setTimeout(resolve, 2000)); // Simuler la latence réseau
  return { status: "completed" };
};
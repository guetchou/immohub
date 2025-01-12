import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

const OfflineSync = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [pendingSync, setPendingSync] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const syncData = async () => {
    if (!isOnline) {
      toast({
        title: "Hors ligne",
        description: "La synchronisation sera effectuée automatiquement une fois la connexion rétablie",
        variant: "destructive",
      });
      return;
    }

    try {
      setPendingSync(true);
      // Simuler une synchronisation
      await new Promise((resolve) => setTimeout(resolve, 2000));
      
      toast({
        title: "Synchronisation réussie",
        description: "Toutes les données sont à jour",
      });
    } catch (error) {
      console.error("Sync error:", error);
      toast({
        title: "Erreur de synchronisation",
        description: "Veuillez réessayer plus tard",
        variant: "destructive",
      });
    } finally {
      setPendingSync(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4">
      <Button
        onClick={syncData}
        disabled={pendingSync}
        variant={isOnline ? "default" : "destructive"}
        className="flex items-center gap-2"
      >
        {isOnline ? "Synchronisé" : "Hors ligne"}
        <div
          className={`w-2 h-2 rounded-full ${
            isOnline ? "bg-green-500" : "bg-red-500"
          }`}
        />
      </Button>
    </div>
  );
};

export default OfflineSync;
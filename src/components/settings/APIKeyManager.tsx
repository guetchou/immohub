import { useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const schema = yup.object({
  mtnApiKey: yup.string().required("Clé API MTN requise"),
  airtelApiKey: yup.string().required("Clé API Airtel requise"),
  stripeApiKey: yup.string().required("Clé API Stripe requise"),
});

type FormData = yup.InferType<typeof schema>;

const APIKeyManager = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  
  const form = useForm<FormData>({
    resolver: yupResolver(schema)
  });

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      console.log("Submitting API keys:", data);
      // Simulation de la sauvegarde des clés API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Clés API sauvegardées",
        description: "Vos clés API ont été mises à jour avec succès.",
      });
    } catch (error) {
      console.error("Error saving API keys:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de la sauvegarde des clés API.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-4"
    >
      <Card>
        <CardHeader>
          <CardTitle>Gestion des Clés API</CardTitle>
          <CardDescription>
            Configurez vos clés API pour les différents services de paiement
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="mtnApiKey"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Clé API MTN Money</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="Entrez votre clé API MTN" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="airtelApiKey"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Clé API Airtel Money</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="Entrez votre clé API Airtel" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="stripeApiKey"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Clé API Stripe</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="Entrez votre clé API Stripe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button 
                type="submit" 
                className="w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Sauvegarde en cours..." : "Sauvegarder les clés API"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default APIKeyManager;
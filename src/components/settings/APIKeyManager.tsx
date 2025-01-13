import { useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { motion } from "framer-motion";
import {
  Box,
  VStack,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Button,
  useToast,
  Card,
  CardBody,
  Text,
} from "@chakra-ui/react";

const schema = yup.object({
  mtnApiKey: yup.string().required("Clé API MTN requise"),
  airtelApiKey: yup.string().required("Clé API Airtel requise"),
  stripeApiKey: yup.string().required("Clé API Stripe requise"),
});

type FormData = yup.InferType<typeof schema>;

const APIKeyManager = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const toast = useToast();
  
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: yupResolver(schema)
  });

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      console.log("Submitting API keys:", data);
      // Ici, nous simulerons la sauvegarde des clés API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Clés API sauvegardées",
        description: "Vos clés API ont été mises à jour avec succès.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Error saving API keys:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la sauvegarde des clés API.",
        status: "error",
        duration: 5000,
        isClosable: true,
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
    >
      <Card>
        <CardBody>
          <VStack spacing={6} align="stretch">
            <Heading size="lg">Gestion des Clés API</Heading>
            <Text color="gray.600">
              Configurez vos clés API pour les différents services de paiement
            </Text>

            <form onSubmit={handleSubmit(onSubmit)}>
              <VStack spacing={4}>
                <FormControl isInvalid={!!errors.mtnApiKey}>
                  <FormLabel>Clé API MTN Money</FormLabel>
                  <Input
                    {...register("mtnApiKey")}
                    type="password"
                    placeholder="Entrez votre clé API MTN"
                  />
                  {errors.mtnApiKey && (
                    <Text color="red.500">{errors.mtnApiKey.message}</Text>
                  )}
                </FormControl>

                <FormControl isInvalid={!!errors.airtelApiKey}>
                  <FormLabel>Clé API Airtel Money</FormLabel>
                  <Input
                    {...register("airtelApiKey")}
                    type="password"
                    placeholder="Entrez votre clé API Airtel"
                  />
                  {errors.airtelApiKey && (
                    <Text color="red.500">{errors.airtelApiKey.message}</Text>
                  )}
                </FormControl>

                <FormControl isInvalid={!!errors.stripeApiKey}>
                  <FormLabel>Clé API Stripe</FormLabel>
                  <Input
                    {...register("stripeApiKey")}
                    type="password"
                    placeholder="Entrez votre clé API Stripe"
                  />
                  {errors.stripeApiKey && (
                    <Text color="red.500">{errors.stripeApiKey.message}</Text>
                  )}
                </FormControl>

                <Button
                  type="submit"
                  colorScheme="blue"
                  isLoading={isSubmitting}
                  width="full"
                >
                  Sauvegarder les clés API
                </Button>
              </VStack>
            </form>
          </VStack>
        </CardBody>
      </Card>
    </motion.div>
  );
};

export default APIKeyManager;
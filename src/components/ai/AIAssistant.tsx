import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Bot, Send, Loader2 } from "lucide-react";
import { toast } from "sonner";

const AIAssistant = () => {
  const [message, setMessage] = useState("");
  const [response, setResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const [showApiKeyInput, setShowApiKeyInput] = useState(true);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) {
      toast.error("Veuillez entrer une question");
      return;
    }

    if (!apiKey) {
      toast.error("Veuillez entrer votre clé API Perplexity");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('https://api.perplexity.ai/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama-3.1-sonar-small-128k-online',
          messages: [
            {
              role: 'system',
              content: 'Vous êtes un assistant immobilier expert. Répondez de manière précise et professionnelle aux questions concernant l\'immobilier au Congo.'
            },
            {
              role: 'user',
              content: message
            }
          ],
          temperature: 0.2,
          max_tokens: 1000,
        }),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la communication avec l\'API');
      }

      const data = await response.json();
      setResponse(data.choices[0].message.content);
      console.log("AI Response:", data);
    } catch (error) {
      console.error("Error:", error);
      toast.error("Une erreur est survenue lors de la communication avec l'IA");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="p-6 max-w-2xl mx-auto my-8">
      <div className="flex items-center gap-2 mb-6">
        <Bot className="w-6 h-6 text-real-primary" />
        <h2 className="text-xl font-semibold">Assistant Immobilier IA</h2>
      </div>

      {showApiKeyInput && (
        <div className="mb-4">
          <input
            type="password"
            placeholder="Entrez votre clé API Perplexity"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            className="w-full p-2 border rounded mb-2"
          />
          <p className="text-sm text-gray-500">
            Cette clé est temporaire et ne sera pas sauvegardée.
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <Textarea
          placeholder="Posez votre question sur l'immobilier..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="min-h-[100px]"
        />
        
        <Button 
          type="submit" 
          className="w-full"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Traitement en cours...
            </>
          ) : (
            <>
              <Send className="mr-2 h-4 w-4" />
              Envoyer
            </>
          )}
        </Button>
      </form>

      {response && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <p className="whitespace-pre-wrap">{response}</p>
        </div>
      )}
    </Card>
  );
};

export default AIAssistant;
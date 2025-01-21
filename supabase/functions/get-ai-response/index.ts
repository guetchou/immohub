import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    
    if (!openAIApiKey) {
      console.error('OpenAI API key not found');
      throw new Error('OpenAI API key not configured');
    }

    const body = await req.json();
    const { message } = body;
    
    if (!message) {
      throw new Error('Message is required');
    }

    console.log("Received message:", message);

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: `Tu es un assistant immobilier professionnel pour ImmoHub Congo.
            Tu dois aider les utilisateurs à:
            - Trouver des propriétés
            - Répondre aux questions sur le marché immobilier
            - Planifier des visites
            - Expliquer les processus immobiliers
            - Donner des conseils sur l'investissement immobilier
            Réponds toujours en français de manière professionnelle et courtoise.`
          },
          { role: 'user', content: message }
        ],
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      console.error('OpenAI API error:', await response.text());
      throw new Error('Error communicating with OpenAI API');
    }

    const data = await response.json();
    console.log("OpenAI response:", data);

    return new Response(
      JSON.stringify({ response: data.choices[0].message.content }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    );
  } catch (error) {
    console.error("Error in get-ai-response function:", error);
    return new Response(
      JSON.stringify({ 
        error: "Une erreur est survenue lors du traitement de votre demande.",
        details: error.message 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    );
  }
});
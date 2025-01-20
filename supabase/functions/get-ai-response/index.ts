import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { message } = await req.json();
    console.log("Received message:", message);

    // Call OpenAI API
    const openAIResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
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
      }),
    });

    if (!openAIResponse.ok) {
      throw new Error(`OpenAI API error: ${await openAIResponse.text()}`);
    }

    const result = await openAIResponse.json();
    const aiResponse = result.choices[0].message.content;
    console.log("AI Response:", aiResponse);

    return new Response(
      JSON.stringify({ response: aiResponse }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    );
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    );
  }
});
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { message } = await req.json()
    
    const response = await fetch(
      "https://api-inference.huggingface.co/models/facebook/blenderbot-400M-distill",
      {
        headers: { 
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({ inputs: message }),
      }
    );

    const result = await response.json();
    console.log("AI Response:", result);

    return new Response(
      JSON.stringify({ response: result[0].generated_text }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    )
  }
})
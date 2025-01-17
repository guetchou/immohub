import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { amount, phoneNumber, provider } = await req.json()

    // Log the payment request
    console.log('Processing payment:', { amount, phoneNumber, provider })

    // Here we would integrate with the actual mobile money API
    // For now, we'll simulate a successful payment
    const paymentResponse = {
      success: true,
      transactionId: `TXN-${Date.now()}`,
      status: 'pending',
      message: 'Payment initiated successfully'
    }

    return new Response(
      JSON.stringify(paymentResponse),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      },
    )
  } catch (error) {
    console.error('Error processing payment:', error)
    
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400
      },
    )
  }
})

import { corsHeaders } from '../_shared/cors.ts'

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { redirectUri } = await req.json()
    
    if (!redirectUri) {
      throw new Error('Redirect URI is required')
    }

    const lineChannelId = Deno.env.get('LINE_CHANNEL_ID')
    
    if (!lineChannelId) {
      throw new Error('LINE Channel ID not configured')
    }

    console.log('Generating LINE auth URL for redirect URI:', redirectUri)

    // Generate a secure state parameter
    const state = btoa(JSON.stringify({ 
      timestamp: Date.now(),
      nonce: crypto.randomUUID()
    }));
    
    // Create LINE Login URL
    const lineAuthUrl = new URL('https://access.line.me/oauth2/v2.1/authorize');
    lineAuthUrl.searchParams.set('response_type', 'code');
    lineAuthUrl.searchParams.set('client_id', lineChannelId);
    lineAuthUrl.searchParams.set('redirect_uri', redirectUri);
    lineAuthUrl.searchParams.set('state', state);
    lineAuthUrl.searchParams.set('scope', 'profile openid email');
    
    console.log('Generated LINE auth URL successfully');
    
    return new Response(
      JSON.stringify({
        authUrl: lineAuthUrl.toString(),
        state: state
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )

  } catch (error) {
    console.error('LINE auth URL generation error:', error)
    return new Response(
      JSON.stringify({
        error: error.message
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})

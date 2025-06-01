
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface LineTokenResponse {
  access_token: string
  token_type: string
  refresh_token: string
  expires_in: number
  scope: string
  id_token: string
}

interface LineProfileResponse {
  userId: string
  displayName: string
  pictureUrl?: string
  statusMessage?: string
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { code, redirectUri } = await req.json()
    
    if (!code) {
      throw new Error('Authorization code is required')
    }

    const lineChannelId = Deno.env.get('LINE_CHANNEL_ID')
    const lineChannelSecret = Deno.env.get('LINE_CHANNEL_SECRET')
    
    if (!lineChannelId || !lineChannelSecret) {
      throw new Error('LINE credentials not configured')
    }

    console.log('Starting LINE authentication process')
    console.log('Using redirect URI:', redirectUri)

    // Exchange authorization code for access token
    const tokenResponse = await fetch('https://api.line.me/oauth2/v2.1/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: redirectUri,
        client_id: lineChannelId,
        client_secret: lineChannelSecret,
      }),
    })

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text()
      console.error('LINE token exchange failed:', errorText)
      throw new Error(`LINE token exchange failed: ${tokenResponse.status}`)
    }

    const tokenData: LineTokenResponse = await tokenResponse.json()
    console.log('LINE token exchange successful')

    // Get user profile from LINE
    const profileResponse = await fetch('https://api.line.me/v2/profile', {
      headers: {
        'Authorization': `Bearer ${tokenData.access_token}`,
      },
    })

    if (!profileResponse.ok) {
      const errorText = await profileResponse.text()
      console.error('LINE profile fetch failed:', errorText)
      throw new Error(`LINE profile fetch failed: ${profileResponse.status}`)
    }

    const profileData: LineProfileResponse = await profileResponse.json()
    console.log('LINE profile fetch successful:', profileData.displayName)

    // Create or update user in Supabase
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })

    // Create a unique email for LINE users
    const lineEmail = `line_${profileData.userId}@line.local`
    
    // Generate a deterministic UUID from the LINE user ID
    const encoder = new TextEncoder()
    const data = encoder.encode(`line_${profileData.userId}`)
    const hashBuffer = await crypto.subtle.digest('SHA-256', data)
    const hashArray = new Uint8Array(hashBuffer)
    
    // Create UUID v4 format from hash
    const uuid = Array.from(hashArray.slice(0, 16))
      .map((b, i) => {
        if (i === 6) return ((b & 0x0f) | 0x40).toString(16).padStart(2, '0') // version 4
        if (i === 8) return ((b & 0x3f) | 0x80).toString(16).padStart(2, '0') // variant bits
        return b.toString(16).padStart(2, '0')
      })
      .join('')
    
    const properUuid = `${uuid.slice(0, 8)}-${uuid.slice(8, 12)}-${uuid.slice(12, 16)}-${uuid.slice(16, 20)}-${uuid.slice(20, 32)}`

    console.log('Generated UUID for LINE user:', properUuid)

    // Check if user already exists in auth.users
    const { data: existingUser } = await supabase.auth.admin.getUserById(properUuid)

    let user
    let sessionData
    
    if (existingUser.user) {
      console.log('Existing LINE user found in auth system')
      user = existingUser.user
      
      // Create a session for the existing user
      const { data: session, error: sessionError } = await supabase.auth.admin.generateLink({
        type: 'magiclink',
        email: lineEmail,
        options: {
          redirectTo: redirectUri
        }
      })

      if (sessionError) {
        console.error('Failed to generate session:', sessionError)
        throw new Error('Failed to create user session')
      }
      
      sessionData = session
    } else {
      console.log('Creating new LINE user in auth system with UUID:', properUuid)
      
      // Create new user in auth system
      const { data: newUser, error: userError } = await supabase.auth.admin.createUser({
        user_id: properUuid,
        email: lineEmail,
        email_confirm: true,
        user_metadata: {
          full_name: profileData.displayName,
          avatar_url: profileData.pictureUrl,
          provider: 'line',
          line_user_id: profileData.userId
        }
      })

      if (userError) {
        console.error('Failed to create auth user:', userError)
        throw new Error('Failed to create user account')
      }
      
      user = newUser.user
      console.log('Successfully created new LINE user')
      
      // Generate a session for the new user
      const { data: session, error: sessionError } = await supabase.auth.admin.generateLink({
        type: 'magiclink',
        email: lineEmail,
        options: {
          redirectTo: redirectUri
        }
      })

      if (sessionError) {
        console.error('Failed to generate session:', sessionError)
        throw new Error('Failed to create user session')
      }
      
      sessionData = session
    }

    // Generate a custom session token for the client
    const sessionToken = btoa(JSON.stringify({
      userId: properUuid,
      lineUserId: profileData.userId,
      email: lineEmail,
      name: profileData.displayName,
      avatar: profileData.pictureUrl,
      provider: 'line',
      timestamp: Date.now(),
      accessToken: tokenData.access_token
    }))

    return new Response(
      JSON.stringify({
        success: true,
        user: {
          id: properUuid,
          lineUserId: profileData.userId,
          email: lineEmail,
          name: profileData.displayName,
          avatar: profileData.pictureUrl,
          provider: 'line'
        },
        sessionToken,
        supabaseSession: sessionData
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )

  } catch (error) {
    console.error('LINE auth error:', error)
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})

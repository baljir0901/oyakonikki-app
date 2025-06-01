
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
    const lineUserString = `line_${profileData.userId}`
    const encoder = new TextEncoder()
    const data = encoder.encode(lineUserString)
    const hashBuffer = await crypto.subtle.digest('SHA-256', data)
    const hashArray = new Uint8Array(hashBuffer)
    
    // Create a proper UUID v4 format
    const hex = Array.from(hashArray).map(b => b.toString(16).padStart(2, '0')).join('')
    const properUuid = [
      hex.slice(0, 8),
      hex.slice(8, 12),
      '4' + hex.slice(13, 16), // version 4
      ((parseInt(hex.slice(16, 17), 16) & 0x3) | 0x8).toString(16) + hex.slice(17, 20), // variant bits
      hex.slice(20, 32)
    ].join('-')

    console.log('Generated UUID for LINE user:', properUuid)

    // Check if user already exists in auth.users
    const { data: existingUser } = await supabase.auth.admin.getUserById(properUuid)

    let user
    let accessToken
    let refreshToken
    
    if (existingUser.user) {
      console.log('Existing LINE user found in auth system')
      user = existingUser.user
      
      // Update user metadata if needed
      const { error: updateError } = await supabase.auth.admin.updateUserById(properUuid, {
        user_metadata: {
          full_name: profileData.displayName,
          avatar_url: profileData.pictureUrl,
          provider: 'line',
          line_user_id: profileData.userId
        }
      })

      if (updateError) {
        console.error('Failed to update user metadata:', updateError)
      }
      
    } else {
      console.log('Creating new LINE user in auth system with UUID:', properUuid)
      
      // First check if email already exists with a different user ID
      const { data: existingEmailUser, error: emailCheckError } = await supabase.auth.admin.listUsers()
      
      if (!emailCheckError) {
        const userWithSameEmail = existingEmailUser.users.find(u => u.email === lineEmail)
        if (userWithSameEmail) {
          console.log('Found existing user with same LINE email, using existing user')
          user = userWithSameEmail
          
          // Update metadata for existing user
          const { error: updateError } = await supabase.auth.admin.updateUserById(userWithSameEmail.id, {
            user_metadata: {
              full_name: profileData.displayName,
              avatar_url: profileData.pictureUrl,
              provider: 'line',
              line_user_id: profileData.userId
            }
          })

          if (updateError) {
            console.error('Failed to update existing user metadata:', updateError)
          }
        } else {
          // Create new user
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
        }
      } else {
        console.error('Error checking for existing users:', emailCheckError)
        throw new Error('Failed to verify user account')
      }
    }

    // Generate session tokens
    const { data: sessionData, error: sessionError } = await supabase.auth.admin.generateLink({
      type: 'magiclink',
      email: user.email!,
    })

    if (sessionError) {
      console.error('Failed to generate session:', sessionError)
      throw new Error('Failed to create user session')
    }
    
    const url = new URL(sessionData.properties.action_link)
    accessToken = url.searchParams.get('access_token')
    refreshToken = url.searchParams.get('refresh_token')

    console.log('Generated session tokens successfully')

    return new Response(
      JSON.stringify({
        success: true,
        user: {
          id: user.id,
          lineUserId: profileData.userId,
          email: user.email,
          name: profileData.displayName,
          avatar: profileData.pictureUrl,
          provider: 'line'
        },
        supabaseSession: {
          properties: {
            access_token: accessToken,
            refresh_token: refreshToken
          }
        }
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

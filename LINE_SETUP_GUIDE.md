# LINE Login Setup Guide for Supabase

## Your LINE Credentials:

- **Channel ID**: 2007532325
- **Channel Secret**: f7dec499a169a936676b60e2f2d79714

## Step-by-Step Setup in Supabase:

### 1. Access Supabase Auth Settings

1. Go to your Supabase dashboard: https://supabase.com/dashboard
2. Select your project: `jnulrzaltiyxgyeadtbc`
3. In the left sidebar, click on **"Authentication"**
4. Click on **"Providers"** tab

### 2. Configure LINE Provider

1. Scroll down to find **"LINE"** in the list of providers
2. Click on **"LINE"** to expand the configuration
3. Toggle **"Enable Sign in with LINE"** to ON
4. Fill in the following fields:

   **Channel ID**: `2007532325`

   **Channel Secret**: `f7dec499a169a936676b60e2f2d79714`

5. **Redirect URL** should already be set to:
   `https://jnulrzaltiyxgyeadtbc.supabase.co/auth/v1/callback`

6. Click **"Save"** to apply the changes

### 3. Update Environment Variables in Netlify

You also need to add the LINE Channel ID to your Netlify environment variables:

#### For oyakonikki-web:

1. Go to Netlify dashboard → oyakonikki-web site
2. Go to Site settings → Environment variables
3. Add new variable:
   - **Key**: `VITE_LINE_CLIENT_ID`
   - **Value**: `2007532325`
4. Click "Save"
5. Redeploy the site

#### For oyakonikki-app:

1. Go to Netlify dashboard → oyakonikki-app site
2. Go to Site settings → Environment variables
3. Add the same variable:
   - **Key**: `VITE_LINE_CLIENT_ID`
   - **Value**: `2007532325`
4. Click "Save"
5. Redeploy the site

### 4. Verify LINE Login Configuration

After completing the setup:

1. Visit your web app: https://oyakonikki-web.netlify.app
2. Click on the "LINE でログイン" button
3. It should redirect to LINE's authentication page
4. After authentication, it should redirect back to your app

### 5. Troubleshooting

If LINE login doesn't work:

1. **Check Callback URL in LINE Console**:

   - Make sure `https://jnulrzaltiyxgyeadtbc.supabase.co/auth/v1/callback` is added to your LINE channel's callback URLs

2. **Verify Environment Variables**:

   - Ensure `VITE_LINE_CLIENT_ID` is set in both Netlify sites
   - Redeploy both sites after adding the variable

3. **Check Browser Console**:
   - Look for any JavaScript errors
   - Verify the LINE client ID is being loaded correctly

### 6. Test Both Authentication Methods

Now you should be able to test:

- ✅ Google OAuth (already working)
- ✅ LINE Login (newly configured)
- ✅ Email/Password authentication

Your Oyakoni Diary Bridge app now has full authentication capabilities!

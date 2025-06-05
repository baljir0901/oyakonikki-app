# Deployment Guide for Oyakoni Diary Bridge

## Prerequisites

1. **Netlify Account**: Sign up at [netlify.com](https://netlify.com)
2. **Supabase Project**: Set up at [supabase.com](https://supabase.com)
3. **GitHub Repository**: Your code should be in a GitHub repository

## Step 1: Update Domain Configuration

Before deploying, update the domain configuration in `src/config/domains.ts`:

```typescript
export const DOMAINS = {
  // Update these with your actual Netlify domains
  MAIN_DOMAIN: "your-app-name.netlify.app",
  ADMIN_DOMAIN: "admin-your-app-name.netlify.app",

  // Keep these for local development
  LOCAL_MAIN: "localhost",
  LOCAL_ADMIN: "admin-localhost",
};
```

## Step 2: Environment Variables

Set up the following environment variables in Netlify:

### Required Environment Variables:

- `VITE_SUPABASE_URL`: Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY`: Your Supabase anonymous key
- `VITE_LINE_CLIENT_ID`: LINE Login client ID (optional)

### In Netlify Dashboard:

1. Go to Site settings → Environment variables
2. Add each variable with its corresponding value

## Step 3: Deploy to Netlify

### Option A: Connect GitHub Repository

1. In Netlify dashboard, click "New site from Git"
2. Connect your GitHub account
3. Select your repository
4. Set build settings:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
5. Click "Deploy site"

### Option B: Manual Deploy

1. Run `npm run build` locally
2. Drag and drop the `dist` folder to Netlify

## Step 4: Configure Custom Domains (Optional)

If you want custom domains instead of `.netlify.app`:

1. In Netlify dashboard → Domain settings
2. Add custom domain
3. Configure DNS records as instructed
4. Update `src/config/domains.ts` with your custom domains

## Step 5: Set Up Admin Subdomain

For the admin dashboard to work on a separate subdomain:

1. In Netlify dashboard → Domain settings
2. Add `admin.yourdomain.com` as a domain alias
3. Or use the built-in `admin-yoursite.netlify.app` format

## Step 6: Configure Authentication Providers

### Google OAuth:

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create OAuth 2.0 credentials
3. Add your Netlify domains to authorized origins
4. Update Supabase Auth settings with Google credentials

### LINE Login:

1. Go to [LINE Developers Console](https://developers.line.biz)
2. Create a LINE Login channel
3. Add your Netlify domains to callback URLs
4. Update the LINE client ID in environment variables

## Step 7: Database Setup

Ensure your Supabase database has the required tables:

```sql
-- Users profiles
CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (id)
);

-- Family invitations
CREATE TABLE family_invitations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  inviter_id UUID REFERENCES auth.users(id),
  invitee_email TEXT NOT NULL,
  inviter_role TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Subscribers
CREATE TABLE subscribers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  subscription_status TEXT DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Admin users
CREATE TABLE admin_users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## Step 8: Test Deployment

1. Visit your main domain to test user authentication
2. Visit your admin domain to test admin dashboard
3. Test all authentication flows (email, Google, LINE)
4. Verify family management features
5. Test payment integration

## Troubleshooting

### Common Issues:

1. **Build Fails**: Check that all dependencies are in `package.json`
2. **Auth Redirect Issues**: Verify redirect URLs in Supabase and OAuth providers
3. **Admin Access**: Ensure admin users are added to the `admin_users` table
4. **Environment Variables**: Double-check all required variables are set

### Logs:

- Check Netlify function logs in the dashboard
- Use browser developer tools for client-side errors
- Check Supabase logs for database issues

## Security Checklist

- [ ] Environment variables are set correctly
- [ ] OAuth redirect URLs are configured properly
- [ ] Database RLS (Row Level Security) policies are enabled
- [ ] Admin access is properly restricted
- [ ] HTTPS is enabled (automatic with Netlify)

## Performance Optimization

- [ ] Enable Netlify's asset optimization
- [ ] Configure caching headers in `netlify.toml`
- [ ] Optimize images and assets
- [ ] Enable compression

Your Oyakoni Diary Bridge app should now be successfully deployed and accessible via your Netlify domains!

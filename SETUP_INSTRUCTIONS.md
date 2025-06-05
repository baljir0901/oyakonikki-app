# Setup Instructions for Oyakoni Diary Bridge

## Step 1: Create GitHub Repository

1. Go to [GitHub](https://github.com) and sign in to your account
2. Click the "+" icon in the top right corner and select "New repository"
3. Name your repository: `oyakoni-diary-bridge`
4. Make it public or private (your choice)
5. **Do NOT** initialize with README, .gitignore, or license (we already have these)
6. Click "Create repository"

## Step 2: Push Code to GitHub

After creating the repository, run these commands in your terminal:

```bash
cd oyakoni-diary-bridge
git remote set-url origin https://github.com/baljir0901/oyakoni-diary-bridge.git
git push -u origin main
```

## Step 3: Deploy to Netlify

### Option A: Connect GitHub Repository (Recommended)

1. Go to [Netlify](https://netlify.com) and sign in
2. Click "New site from Git"
3. Choose "GitHub" and authorize Netlify
4. Select your `oyakoni-diary-bridge` repository
5. Configure build settings:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
   - **Node version**: 18 (in Environment variables)
6. Add environment variables:
   - `VITE_SUPABASE_URL`: `https://jnulrzaltiyxgyeadtbc.supabase.co`
   - `VITE_SUPABASE_ANON_KEY`: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpudWxyemFsdGl5eGd5ZWFkdGJjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkxMjk0OTgsImV4cCI6MjA2NDcwNTQ5OH0.q9_8XYopeKEK4CDl1ypRRWEhFlfrmGrNAvyrApGZMrs`
7. Click "Deploy site"

### Option B: Manual Deploy

1. Run `npm run build` in your project directory
2. Go to Netlify dashboard
3. Drag and drop the `dist` folder to deploy

## Step 4: Configure Custom Domains

### For Main App (oyakonikki-web.netlify.app):

1. In Netlify dashboard → Site settings → Domain management
2. Click "Add custom domain"
3. Enter: `oyakonikki-web.netlify.app`
4. Follow DNS configuration instructions

### For Admin App (oyakonikki-app.netlify.app):

1. Deploy the same code to a second Netlify site
2. Configure domain as: `oyakonikki-app.netlify.app`
3. The app will automatically detect the admin domain and show admin interface

## Step 5: Set Up Authentication

### Google OAuth:

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized origins:
   - `https://oyakonikki-web.netlify.app`
   - `https://oyakonikki-app.netlify.app`
   - `http://localhost:8083` (for development)
6. Add redirect URIs:
   - `https://jnulrzaltiyxgyeadtbc.supabase.co/auth/v1/callback`
7. Copy Client ID and add to Supabase Auth settings

### LINE Login:

1. Go to [LINE Developers Console](https://developers.line.biz)
2. Create a new channel (LINE Login)
3. Add callback URLs:
   - `https://jnulrzaltiyxgyeadtbc.supabase.co/auth/v1/callback`
4. Copy Channel ID and add to environment variables
5. Configure in Supabase Auth settings

## Step 6: Database Setup

Run these SQL commands in your Supabase SQL editor:

```sql
-- Enable RLS
ALTER TABLE auth.users ENABLE ROW LEVEL SECURITY;

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (id)
);

-- Create family_invitations table
CREATE TABLE IF NOT EXISTS family_invitations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  inviter_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  invitee_email TEXT NOT NULL,
  inviter_role TEXT NOT NULL CHECK (inviter_role IN ('parent', 'child')),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '7 days')
);

-- Create subscribers table
CREATE TABLE IF NOT EXISTS subscribers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  subscription_status TEXT DEFAULT 'trial' CHECK (subscription_status IN ('trial', 'active', 'cancelled', 'expired')),
  trial_ends_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '7 days'),
  subscription_ends_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create admin_users table
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Create RLS policies
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can view own invitations" ON family_invitations FOR SELECT USING (auth.uid() = inviter_id);
CREATE POLICY "Users can create invitations" ON family_invitations FOR INSERT WITH CHECK (auth.uid() = inviter_id);

CREATE POLICY "Users can view own subscription" ON subscribers FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own subscription" ON subscribers FOR UPDATE USING (auth.uid() = user_id);

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE family_invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'avatar_url');

  INSERT INTO public.subscribers (user_id)
  VALUES (NEW.id);

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

## Step 7: Test Your Deployment

1. Visit `https://oyakonikki-web.netlify.app` - should show the main login page
2. Visit `https://oyakonikki-app.netlify.app` - should show the admin login page
3. Test email registration and login
4. Test Google OAuth (once configured)
5. Test family member invitation system
6. Test subscription features

## Troubleshooting

### Build Fails:

- Check Node.js version is 18+
- Verify all environment variables are set
- Check build logs in Netlify dashboard

### Authentication Issues:

- Verify Supabase URL and key are correct
- Check OAuth provider configurations
- Ensure redirect URLs match exactly

### Database Errors:

- Run the SQL setup commands in Supabase
- Check RLS policies are enabled
- Verify table permissions

## Support

If you encounter any issues:

1. Check the browser console for errors
2. Review Netlify build logs
3. Check Supabase logs and metrics
4. Verify all environment variables are set correctly

Your Oyakoni Diary Bridge app should now be fully deployed and functional!

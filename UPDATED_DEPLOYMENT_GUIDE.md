# Updated Deployment Guide - Separate Repositories

## Repository Setup ✅ COMPLETED

Your code has been successfully pushed to both repositories:

- **Web App**: https://github.com/baljir0901/oyakonikki-web
- **Admin App**: https://github.com/baljir0901/oyakonikki-app

## Next Steps for Netlify Deployment

### Step 1: Deploy Web App (oyakonikki-web.netlify.app)

1. Go to [Netlify](https://netlify.com) and sign in
2. Click "New site from Git"
3. Choose "GitHub" and authorize Netlify
4. Select your `oyakonikki-web` repository
5. Configure build settings:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
   - **Node version**: 18
6. Add environment variables:
   ```
   VITE_SUPABASE_URL=https://jnulrzaltiyxgyeadtbc.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpudWxyemFsdGl5eGd5ZWFkdGJjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkxMjk0OTgsImV4cCI6MjA2NDcwNTQ5OH0.q9_8XYopeKEK4CDl1ypRRWEhFlfrmGrNAvyrApGZMrs
   VITE_ENABLE_LINE_LOGIN=true
   VITE_ENABLE_GOOGLE_LOGIN=true
   VITE_ENABLE_EMAIL_LOGIN=true
   ```
7. Click "Deploy site"
8. Once deployed, go to Site settings → Domain management
9. Change site name to: `oyakonikki-web`
10. Your web app will be available at: `https://oyakonikki-web.netlify.app`

### Step 2: Deploy Admin App (oyakonikki-app.netlify.app)

1. Click "New site from Git" again
2. Select your `oyakonikki-app` repository
3. Use the same build settings and environment variables as above
4. Click "Deploy site"
5. Change site name to: `oyakonikki-app`
6. Your admin app will be available at: `https://oyakonikki-app.netlify.app`

### Step 3: Verify Domain Detection

The app automatically detects which interface to show based on the domain:

- `oyakonikki-web.netlify.app` → Shows main user interface
- `oyakonikki-app.netlify.app` → Shows admin dashboard interface

### Step 4: Set Up Database (Required)

Run this SQL in your Supabase SQL editor:

```sql
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

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE family_invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can view own invitations" ON family_invitations FOR SELECT USING (auth.uid() = inviter_id);
CREATE POLICY "Users can create invitations" ON family_invitations FOR INSERT WITH CHECK (auth.uid() = inviter_id);

CREATE POLICY "Users can view own subscription" ON subscribers FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own subscription" ON subscribers FOR UPDATE USING (auth.uid() = user_id);

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

### Step 5: Configure Authentication (Optional)

#### Google OAuth:

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create OAuth 2.0 credentials
3. Add authorized origins:
   - `https://oyakonikki-web.netlify.app`
   - `https://oyakonikki-app.netlify.app`
4. Add redirect URI: `https://jnulrzaltiyxgyeadtbc.supabase.co/auth/v1/callback`
5. Add Google client ID to Supabase Auth settings

#### LINE Login:

1. Go to [LINE Developers Console](https://developers.line.biz)
2. Create LINE Login channel
3. Add callback URL: `https://jnulrzaltiyxgyeadtbc.supabase.co/auth/v1/callback`
4. Add LINE client ID to Supabase Auth settings

### Step 6: Test Your Deployment

1. **Web App**: Visit `https://oyakonikki-web.netlify.app`

   - Should show the main login page with Japanese interface
   - Test email registration and login
   - Test family management features

2. **Admin App**: Visit `https://oyakonikki-app.netlify.app`
   - Should show the admin login page
   - Test admin authentication
   - View user statistics and management features

### Step 7: Create Admin User

To access the admin dashboard, you need to add your user to the admin_users table:

```sql
-- After creating your account, run this with your user ID
INSERT INTO admin_users (user_id)
VALUES ('your-user-id-from-auth-users-table');
```

## Summary

✅ **Completed**:

- Code pushed to both GitHub repositories
- Build process tested and working
- Domain configuration set up
- Comprehensive documentation provided

🔄 **Next Steps**:

1. Deploy both repositories to Netlify
2. Set up database tables in Supabase
3. Configure authentication providers (optional)
4. Test both web and admin interfaces

Your Oyakoni Diary Bridge application is now ready for deployment!

# Setting up LINE Login with Supabase CLI

Since LINE Login is not available in the Supabase dashboard UI, we need to enable it using the Supabase CLI.

## 1. Install Supabase CLI

```bash
# Using npm
npm install -g supabase

# Or using yarn
yarn global add supabase
```

## 2. Login to Supabase

```bash
supabase login
```

## 3. Enable LINE Provider

Create a file named `auth-config.json`:

```json
{
  "id": "line",
  "provider": "line",
  "enabled": true,
  "client_id": "2007532325",
  "client_secret": "f7dec499a169a936676b60e2f2d79714",
  "redirect_uri": "https://jnulrzaltiyxgyeadtbc.supabase.co/auth/v1/callback"
}
```

Then run:

```bash
supabase auth providers update line --project-ref jnulrzaltiyxgyeadtbc --config auth-config.json
```

## Alternative Method: Using Direct API Call

If you prefer not to use the CLI, you can enable LINE Login using a direct API call:

```bash
curl -X PUT 'https://jnulrzaltiyxgyeadtbc.supabase.co/auth/v1/admin/providers/line' \
-H "apikey: YOUR_SERVICE_ROLE_KEY" \
-H "Authorization: Bearer YOUR_SERVICE_ROLE_KEY" \
-H "Content-Type: application/json" \
-d '{
  "enabled": true,
  "client_id": "2007532325",
  "client_secret": "f7dec499a169a936676b60e2f2d79714",
  "redirect_uri": "https://jnulrzaltiyxgyeadtbc.supabase.co/auth/v1/callback"
}'
```

## 4. Update Environment Variables

After enabling LINE Login, make sure your environment variables are set in Netlify:

### For oyakonikki-web:

1. Go to Site settings → Environment variables
2. Add:
   ```
   VITE_LINE_CLIENT_ID=2007532325
   ```

### For oyakonikki-app:

1. Go to Site settings → Environment variables
2. Add:
   ```
   VITE_LINE_CLIENT_ID=2007532325
   ```

## 5. Verify LINE Login Configuration

1. Visit your web app: https://oyakonikki-web.netlify.app
2. Click on the "LINE でログイン" button
3. You should be redirected to LINE's authentication page
4. After authentication, you'll be redirected back to your app

## Troubleshooting

If LINE login still doesn't work:

1. **Check LINE Developer Console**:

   - Verify the callback URL is correct
   - Make sure the Channel is properly configured
   - Check if the Channel is in development or production mode

2. **Check Supabase Configuration**:

   - Use the Supabase CLI to verify the provider status:
     ```bash
     supabase auth providers list --project-ref jnulrzaltiyxgyeadtbc
     ```

3. **Check Network Requests**:

   - Use browser developer tools to check for any errors in the Network tab
   - Look for failed requests to LINE or Supabase endpoints

4. **Check Environment Variables**:
   - Verify they are properly set in Netlify
   - Make sure the sites have been redeployed after adding variables

Need help? Contact Supabase support or refer to:

- [Supabase Auth Docs](https://supabase.com/docs/guides/auth)
- [LINE Login Docs](https://developers.line.biz/en/docs/line-login/)

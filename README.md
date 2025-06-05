# 親子日記 (Oyakoni Diary Bridge)

A family diary application that allows parents and children to share memories and experiences together.

## Features

- 🔐 **Multi-Authentication**: Email/Password, Google OAuth, LINE Login
- 👨‍👩‍👧‍👦 **Family Management**: Add family members, manage relationships
- 💳 **Subscription System**: 7-day free trial, monthly subscription
- 👑 **Admin Dashboard**: User management, analytics, subscription control
- 🌐 **Multi-Domain Support**: Separate admin and user interfaces
- 📱 **Responsive Design**: Works on desktop and mobile devices
- 🇯🇵 **Japanese Interface**: Full Japanese language support

## Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Auth, Real-time)
- **Routing**: React Router v6
- **UI Components**: Radix UI, Lucide Icons
- **Build Tool**: Vite
- **Deployment**: Netlify

## Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account
- Netlify account (for deployment)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/hellobraincode/oyakoni-diary-bridge.git
   cd oyakoni-diary-bridge
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env.local
   ```

   Edit `.env.local` with your actual values:

   ```env
   VITE_SUPABASE_URL=your-project-url.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   VITE_LINE_CLIENT_ID=your-line-client-id
   ```

4. **Start development server**

   ```bash
   npm run dev
   ```

5. **Access the application**
   - Main app: http://localhost:8083
   - Admin dashboard: http://admin-localhost:8083

## Project Structure

```
src/
├── components/           # React components
│   ├── auth/            # Authentication components
│   ├── admin/           # Admin dashboard components
│   ├── family/          # Family management components
│   ├── settings/        # Settings and payment components
│   └── ui/              # Reusable UI components
├── config/              # Configuration files
│   └── domains.ts       # Domain configuration
├── hooks/               # Custom React hooks
├── integrations/        # External service integrations
│   └── supabase/        # Supabase client and types
├── pages/               # Page components
└── types/               # TypeScript type definitions
```

## Authentication Flow

### User Authentication

1. Users can sign up/login with:
   - Email and password
   - Google OAuth
   - LINE Login
2. Email verification required for new accounts
3. Password reset functionality available

### Admin Access

- Admin users access via `admin.yourdomain.com`
- Separate authentication flow
- Admin privileges managed in database

## Family Management

- **Add Members**: Invite family members via email
- **Role Management**: Assign parent/child roles
- **Invitations**: Track pending invitations
- **Remove Members**: Remove family members when needed

## Subscription System

- **Free Trial**: 7-day trial for new users
- **Monthly Subscription**: ¥300/month after trial
- **Payment Processing**: Integrated payment system
- **Subscription Management**: Users can manage their subscriptions

## Admin Features

- **User Analytics**: Total users, new registrations, conversion rates
- **Subscription Management**: View and manage user subscriptions
- **Revenue Tracking**: Monthly revenue and subscription metrics
- **User Actions**: Suspend/activate user accounts

## Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

### Quick Deploy to Netlify

1. **Connect GitHub repository to Netlify**
2. **Set build settings**:
   - Build command: `npm run build`
   - Publish directory: `dist`
3. **Configure environment variables** in Netlify dashboard
4. **Set up custom domains** (optional)

## Configuration

### Domain Configuration

Update `src/config/domains.ts` with your actual domains:

```typescript
export const DOMAINS = {
  MAIN_DOMAIN: "your-app.netlify.app",
  ADMIN_DOMAIN: "admin-your-app.netlify.app",
  // ...
};
```

### OAuth Setup

#### Google OAuth

1. Create project in Google Cloud Console
2. Set up OAuth 2.0 credentials
3. Add authorized domains
4. Update Supabase Auth settings

#### LINE Login

1. Create channel in LINE Developers Console
2. Configure callback URLs
3. Add client ID to environment variables

## Database Schema

Required Supabase tables:

```sql
-- User profiles
CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Family invitations
CREATE TABLE family_invitations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  inviter_id UUID REFERENCES auth.users(id),
  invitee_email TEXT NOT NULL,
  inviter_role TEXT NOT NULL,
  status TEXT DEFAULT 'pending'
);

-- Subscribers
CREATE TABLE subscribers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  subscription_status TEXT DEFAULT 'active'
);

-- Admin users
CREATE TABLE admin_users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id)
);
```

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Code Style

- TypeScript for type safety
- ESLint for code quality
- Prettier for code formatting
- Tailwind CSS for styling

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support, please contact [your-email@example.com] or create an issue in the GitHub repository.

---

Made with ❤️ for families who want to preserve their precious memories together.

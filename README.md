This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

### Environment Variables

Create a `.env.local` file in the root directory and add the following environment variables:

```bash
# OpenAI API Key for AI coaching features
OPENAI_API_KEY=your_openai_api_key_here

# Google OAuth credentials for authentication
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here

# NextAuth secret (generate with: openssl rand -base64 32)
AUTH_SECRET=your_auth_secret_here

# Application URL (use http://localhost:3000 for development)
AUTH_URL=http://localhost:3000

# Supabase credentials (for user authentication and data storage)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here
```

#### Getting API Keys:

1. **OpenAI API Key**: Get it from [OpenAI Platform](https://platform.openai.com/api-keys)

2. **Supabase Credentials**:
   - Go to [Supabase](https://supabase.com) and create a new project
   - Once created, go to Settings → API
   - Copy the Project URL (for SUPABASE_URL)
   - Copy the service_role key (for SUPABASE_SERVICE_ROLE_KEY)
   - Go to SQL Editor and run the schema from `supabase/schema.sql`

3. **Google OAuth Credentials**:
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select an existing one
   - Enable Google+ API
   - Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client ID"
   - Set application type to "Web application"
   - Add authorized redirect URIs:
     - For development: `http://localhost:3000/api/auth/callback/google`
     - For production: `https://your-domain.com/api/auth/callback/google`
   - Copy the Client ID and Client Secret

4. **AUTH_SECRET**: Generate a random string using `openssl rand -base64 32`

> 📖 **For detailed deployment instructions**, see [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)

### Run the Development Server

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

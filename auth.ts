import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import { SupabaseAdapter } from "@auth/supabase-adapter"

// Validate required environment variables
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const googleClientId = process.env.GOOGLE_CLIENT_ID;
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;
const authSecret = process.env.AUTH_SECRET;
const authUrl = process.env.AUTH_URL || process.env.NEXTAUTH_URL;

// Log configuration status
console.log('🔧 NextAuth Configuration:');
console.log('  - Supabase URL:', supabaseUrl ? '✅ Set' : '❌ Missing');
console.log('  - Supabase Service Key:', supabaseServiceKey ? '✅ Set' : '❌ Missing');
console.log('  - Google Client ID:', googleClientId ? '✅ Set' : '❌ Missing');
console.log('  - Google Client Secret:', googleClientSecret ? '✅ Set' : '❌ Missing');
console.log('  - Auth Secret:', authSecret ? '✅ Set' : '❌ Missing');
console.log('  - Auth URL:', authUrl || '❌ Missing');

if (!supabaseUrl || !supabaseServiceKey) {
  console.warn('⚠️  Supabase credentials not configured. Authentication will not work properly.');
  console.warn('Please set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY environment variables.');
}

if (!googleClientId || !googleClientSecret) {
  console.error('❌ Google OAuth credentials not configured. Google sign-in will NOT work.');
  console.error('Please set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET environment variables.');
}

if (!authSecret) {
  console.warn('⚠️  AUTH_SECRET not set. Generate one with: openssl rand -base64 32');
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  // Only use SupabaseAdapter if credentials are available
  adapter: (supabaseUrl && supabaseServiceKey) ? SupabaseAdapter({
    url: supabaseUrl,
    secret: supabaseServiceKey,
  }) : undefined,
  providers: [
    Google({
      clientId: googleClientId!,
      clientSecret: googleClientSecret!,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code"
        }
      }
    }),
  ],
  pages: {
    signIn: "/login",
    error: "/login", // Redirect to login page on error
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      console.log('🔐 Sign in attempt:', {
        user: user?.email,
        provider: account?.provider
      });
      return true;
    },
    async redirect({ url, baseUrl }) {
      console.log('🔄 Redirect:', { url, baseUrl });
      // Allows relative callback URLs
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      // Allows callback URLs on the same origin
      else if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
  },
  debug: process.env.NODE_ENV === 'development',
})

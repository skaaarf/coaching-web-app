import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import { SupabaseAdapter } from "@auth/supabase-adapter"

// Validate required environment variables
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const googleClientId = process.env.GOOGLE_CLIENT_ID;
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;

if (!supabaseUrl || !supabaseServiceKey) {
  console.warn('⚠️  Supabase credentials not configured. Authentication will not work properly.');
  console.warn('Please set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY environment variables.');
}

if (!googleClientId || !googleClientSecret) {
  console.warn('⚠️  Google OAuth credentials not configured. Google sign-in will not work.');
  console.warn('Please set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET environment variables.');
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  // Only use SupabaseAdapter if credentials are available
  adapter: (supabaseUrl && supabaseServiceKey) ? SupabaseAdapter({
    url: supabaseUrl,
    secret: supabaseServiceKey,
  }) : undefined,
  providers: [
    Google({
      clientId: googleClientId || 'placeholder-client-id',
      clientSecret: googleClientSecret || 'placeholder-client-secret',
    }),
  ],
  pages: {
    signIn: "/login",
  },
})

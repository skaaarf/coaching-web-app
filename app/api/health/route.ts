import { NextResponse } from 'next/server';

/**
 * Health check endpoint to verify environment variables configuration
 */
export async function GET() {
  const checks = {
    openai: !!process.env.OPENAI_API_KEY,
    googleOAuth: {
      clientId: !!process.env.GOOGLE_CLIENT_ID,
      clientSecret: !!process.env.GOOGLE_CLIENT_SECRET,
    },
    nextAuth: {
      secret: !!process.env.AUTH_SECRET,
      url: !!process.env.AUTH_URL,
    },
    supabase: {
      serverUrl: !!process.env.SUPABASE_URL,
      serverKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
      clientUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      clientKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    },
  };

  const allGood =
    checks.openai &&
    checks.googleOAuth.clientId &&
    checks.googleOAuth.clientSecret &&
    checks.nextAuth.secret &&
    checks.nextAuth.url &&
    checks.supabase.serverUrl &&
    checks.supabase.serverKey &&
    checks.supabase.clientUrl &&
    checks.supabase.clientKey;

  return NextResponse.json({
    status: allGood ? 'healthy' : 'warning',
    timestamp: new Date().toISOString(),
    checks,
    message: allGood
      ? 'All environment variables are configured correctly'
      : 'Some environment variables are missing. Check the details above.',
  }, {
    status: allGood ? 200 : 503,
  });
}

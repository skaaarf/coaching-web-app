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
    firebaseClient: {
      apiKey: !!(process.env.NEXT_PUBLIC_FIREBASE_API_KEY || process.env.FIREBASE_API_KEY),
      authDomain: !!(process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || process.env.FIREBASE_AUTH_DOMAIN),
      projectId: !!(process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || process.env.FIREBASE_PROJECT_ID),
      appId: !!(process.env.NEXT_PUBLIC_FIREBASE_APP_ID || process.env.FIREBASE_APP_ID),
      storageBucket: !!(process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || process.env.FIREBASE_STORAGE_BUCKET),
      messagingSenderId: !!(
        process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || process.env.FIREBASE_MESSAGING_SENDER_ID
      ),
    },
    firebaseAdmin: {
      projectId: !!process.env.FIREBASE_PROJECT_ID,
      clientEmail: !!process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: !!process.env.FIREBASE_PRIVATE_KEY,
    },
  };

  const allGood =
    checks.openai &&
    checks.googleOAuth.clientId &&
    checks.googleOAuth.clientSecret &&
    checks.nextAuth.secret &&
    checks.nextAuth.url &&
    checks.firebaseClient.apiKey &&
    checks.firebaseClient.authDomain &&
    checks.firebaseClient.projectId &&
    checks.firebaseClient.appId &&
    checks.firebaseAdmin.projectId &&
    checks.firebaseAdmin.clientEmail &&
    checks.firebaseAdmin.privateKey;

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

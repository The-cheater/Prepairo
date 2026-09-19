import { createSupabaseServer } from '@/backend/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const next = requestUrl.searchParams.get('next') ?? '/dashboard';
  const errorParam = requestUrl.searchParams.get('error_description') || requestUrl.searchParams.get('error');

  // Correctly determine the public base URL across local and Vercel environments
  const host = request.headers.get('x-forwarded-host') || requestUrl.host;
  const protocol = request.headers.get('x-forwarded-proto') || (requestUrl.protocol.replace(':', '') || 'https');
  const baseUrl = `${protocol}://${host}`;

  // If Google or Supabase passed an error directly
  if (errorParam) {
    console.error('OAuth redirect returned error:', errorParam);
    return NextResponse.redirect(`${baseUrl}/login?error=${encodeURIComponent(errorParam)}`);
  }

  if (code) {
    try {
      const supabase = await createSupabaseServer();
      const { error } = await supabase.auth.exchangeCodeForSession(code);

      if (!error) {
        return NextResponse.redirect(`${baseUrl}${next}`);
      }

      // Fallback: Check if session is already active (e.g. race condition / double fetch)
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        return NextResponse.redirect(`${baseUrl}${next}`);
      }

      console.error('Supabase exchangeCodeForSession error:', error.message);
      return NextResponse.redirect(`${baseUrl}/login?error=${encodeURIComponent(error.message)}`);
    } catch (err: any) {
      console.error('OAuth exchange exception:', err);
      return NextResponse.redirect(`${baseUrl}/login?error=${encodeURIComponent(err?.message || 'Authentication failed')}`);
    }
  }

  // Return to login with error
  return NextResponse.redirect(`${baseUrl}/login?error=Could+not+authenticate+user`);
}


import { supabaseServerClient } from '@/utils/supabase/server';
import { EmailOtpType } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  console.log('GET /api/auth/callback');

  const requestUrl = new URL(request.url);
  const token_hash = requestUrl.searchParams.get('token_hash');
  const type = requestUrl.searchParams.get('type') as EmailOtpType;
  const code = requestUrl.searchParams.get('code');
  const origin = requestUrl.origin;

  const supabase = supabaseServerClient();

  if (token_hash && type) {
    // Handle OTP verification
    await supabase.auth.verifyOtp({ token_hash, type });
  } else if (code) {
    // Handle OAuth code exchange for session
    await supabase.auth.exchangeCodeForSession(code);
  }

  // URL to redirect to after the authentication process completes
  return NextResponse.redirect(`${origin}`);
}

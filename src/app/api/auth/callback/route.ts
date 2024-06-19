import { supabaseServerClient } from '@/utils/supabase/server';
import { EmailOtpType } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const token_hash = requestUrl.searchParams.get('token_hash');
  const type = requestUrl.searchParams.get('type') as EmailOtpType;
  const code = requestUrl.searchParams.get('code');
  const origin = requestUrl.origin;

  const supabase = supabaseServerClient();

  let error = null;

  try {
    if (token_hash && type) {
      // Handle OTP verification
      const { error: otpError } = await supabase.auth.verifyOtp({ token_hash, type });
      error = otpError;
      console.log('OTP verification error:', error);
    } else if (code) {
      // Handle OAuth code exchange for session
      const { error: codeError } = await supabase.auth.exchangeCodeForSession(code);
      error = codeError;
    }

    if (error) {
      throw error.message;
    }

    // URL to redirect to after the authentication process completes
    return NextResponse.redirect(origin);
  } catch (error: any) {
    console.error(error);

    // Set cookie with error message and redirect
    const response = NextResponse.redirect(`${origin}/login/error`);
    response.cookies.set('auth_error', error.message || 'An unexpected error occurred.', {
      path: '/',
      httpOnly: false,
    });
    return response;
  }
}

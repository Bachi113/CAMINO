// This component provides Google authentication using Supabase's auth UI.
// It is configured to redirect users to a specified callback URL upon successful authentication.
// The appearance of the auth button is customized according to the application's theme.

'use client';

import { supabaseBrowserClient } from '@/utils/supabase/client';
import { Auth } from '@supabase/auth-ui-react';

export default function GoogleAuth() {
  const supabase = supabaseBrowserClient();

  // Ensure the redirect URL is configured correctly in the Supabase project settings.
  // Incorrect configuration can lead to failed authentication attempts or security vulnerabilities.
  const redirectUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/callback/merchant`;

  return (
    <div className='w-full'>
      <Auth
        supabaseClient={supabase}
        onlyThirdPartyProviders={true}
        providers={['google']}
        redirectTo={redirectUrl}
        appearance={{
          extend: false,
          className: {
            button:
              'w-full py-3 rounded-md bg-gray-100 flex items-center justify-center gap-2 font-medium text-secondary border',
          },
        }}
        localization={{
          variables: {
            sign_in: {
              social_provider_text: 'Login with google',
            },
          },
        }}
      />
    </div>
  );
}

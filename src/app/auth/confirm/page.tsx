'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabaseBrowserClient } from '@/utils/supabase/client';
import { EmailOtpType } from '@supabase/supabase-js';
import Logo from '@/components/Logo';

export default function ConfirmAuth() {
  const supabase = supabaseBrowserClient();
  const searchParams = useSearchParams();
  const router = useRouter();

  const token_hash = searchParams.get('token_hash');
  const type = searchParams.get('type') as EmailOtpType;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!token_hash || !type) {
      setError('Invalid or missing token.');
      setLoading(false);
      return;
    }

    const handleMagicLinkRedirect = async () => {
      const { error } = await supabase.auth.verifyOtp({ token_hash, type });

      if (error) {
        setError('Error verifying OTP: ' + error.message);
      } else {
        router.push('/');
        setSuccess(true);
      }

      setLoading(false);
    };

    handleMagicLinkRedirect();
  }, []);

  return (
    <div className='h-screen flex flex-col'>
      <div className='w-full flex flex-col items-center mt-36'>
        <div className='m-4 md:m-0 md:min-w-[414px]'>
          <div className='space-y-6 flex flex-col items-center justify-center'>
            <Logo />
            {loading && <p className='text-sm text-subtle'>Confirming your email address...</p>}
            {error && (
              <>
                <p className='text-sm text-destructive'>Error: {error}</p>
                <p className='text-sm text-destructive'>Please try again or contact support.</p>
              </>
            )}
            {success && <p className='text-sm text-green-500'>Email address confirmed successfully.</p>}
          </div>
        </div>
      </div>
    </div>
  );
}

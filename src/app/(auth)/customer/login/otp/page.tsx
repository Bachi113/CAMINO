'use client';

import { signInWithMagicLink, verifyPhoneOtp } from '@/app/actions/login.actions';
import InputWrapper from '@/components/InputWrapper';
import { SubmitButton } from '@/components/SubmitButton';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { countryOptions } from '@/utils/contsants/country-codes';
import { supabaseBrowserClient } from '@/utils/supabase/client';
import { errorToast } from '@/utils/utils';
import Link from 'next/link';
import { useState } from 'react';
import ReactCountryFlag from 'react-country-flag';
import { MdOutlineKeyboardBackspace } from 'react-icons/md';

export default function CustomerLoginOtpPage() {
  const [selectedPhoneCode, setSelectedPhoneCode] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [email, setEmail] = useState('');
  const [isMagicLinkSent, setIsMagicLinkSent] = useState(false);

  const handleFormAction = async () => {
    const supabase = supabaseBrowserClient();

    try {
      if (!email) {
        throw 'Email is required';
      }
      if (!phoneNumber || !selectedPhoneCode) {
        throw 'Phone number is required with a valid country code.';
      }

      const country = countryOptions.find((c) => c.code === selectedPhoneCode);
      if (!country) {
        throw new Error('Please select the country code');
      }
      const fullPhoneNumber = `${country.phoneCode}${phoneNumber}`;
      setPhoneNumber(fullPhoneNumber);

      // Send OTP to the phone number
      const { error } = await supabase.auth.signInWithOtp({
        phone: fullPhoneNumber,
        options: { channel: 'sms' },
      });
      if (error) {
        throw error.message;
      }
      setIsOtpSent(true);
    } catch (error) {
      errorToast(`${error}`);
    }
  };

  const handleVerifyOtp = async (formData: FormData) => {
    const otp = formData.get('otp') as string;

    try {
      // Verify if OTP is all numbers
      if (!/^\d+$/.test(otp)) {
        throw 'OTP must contain only numbers';
      }

      // Verify the OTP
      const error = await verifyPhoneOtp(phoneNumber, otp);
      if (error) {
        throw error;
      }

      // Send magic link to verify the email
      const response = await signInWithMagicLink(email, 'customer');
      if (response) {
        throw response;
      }

      setIsMagicLinkSent(true);
    } catch (error) {
      errorToast(`${error}`);
    }
  };

  return (
    <>
      <Link href='/customer/login'>
        <Button variant='outline' className='font-normal absolute left-20 top-10'>
          <MdOutlineKeyboardBackspace className='mr-2' />
          Go back
        </Button>
      </Link>

      <div className='w-full space-y-8'>
        <p className='text-sm text-subtle text-center'>
          {isMagicLinkSent ? (
            <span>
              We have sent a magic link to <br /> <span className='font-medium'>{email}</span>
            </span>
          ) : (
            'Please enter the email & phone to login'
          )}
        </p>

        {isMagicLinkSent ? (
          <div className='flex flex-col justify-center gap-1'>
            <Link href='https://mail.google.com' target='_blank' className='block'>
              <Button size='xl'>Check your Email & Verify</Button>
            </Link>
            <Button variant='link' onClick={() => setIsMagicLinkSent(false)} className='font-normal'>
              <MdOutlineKeyboardBackspace className='mr-2' />
              Change email
            </Button>
          </div>
        ) : (
          <div className='space-y-4'>
            <form className='space-y-4'>
              <InputWrapper
                id='email'
                label='Email address'
                description='Click on continue to get the magic link'
                required>
                <Input
                  type='email'
                  id='email'
                  name='email'
                  autoFocus={true}
                  placeholder='john@gmail.com'
                  className='h-11'
                  onChange={(e) => setEmail(e.target.value)}
                />
              </InputWrapper>

              <InputWrapper id='phone' label='Phone Number' required>
                <div className='flex'>
                  <Select onValueChange={(val) => setSelectedPhoneCode(val)} value={selectedPhoneCode}>
                    <SelectTrigger disabled={isOtpSent} className='w-28 h-11 mr-2'>
                      <SelectValue placeholder='Code' />
                    </SelectTrigger>
                    <SelectContent>
                      {countryOptions.map((option) => (
                        <SelectItem key={option.code} value={option.code}>
                          <div className='flex items-center gap-2'>
                            <ReactCountryFlag
                              svg
                              countryCode={option.code}
                              style={{
                                width: '1.2em',
                                height: '1.2em',
                              }}
                            />
                            <span>{option.name}</span>
                            <span>({option.phoneCode})</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input
                    type='tel'
                    id='phone'
                    name='phone'
                    placeholder='123456789'
                    disabled={isOtpSent}
                    className='h-11 flex-1'
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                  />
                </div>
              </InputWrapper>

              {!isOtpSent && <SubmitButton formAction={handleFormAction}>Continue</SubmitButton>}
            </form>

            {isOtpSent && (
              <div className='flex flex-col justify-center gap-2'>
                <form className='space-y-4'>
                  <InputWrapper
                    id='otp'
                    label='Phone OTP'
                    description='We have sent you an OTP in the above phone number. Please enter the OTP here.'
                    required>
                    <Input
                      id='otp'
                      name='otp'
                      placeholder='123456'
                      maxLength={6}
                      minLength={6}
                      className='h-11'
                    />
                  </InputWrapper>
                  <SubmitButton formAction={handleVerifyOtp}>Verify OTP</SubmitButton>
                </form>

                <Button variant='link' onClick={() => setIsOtpSent(false)} className='font-normal'>
                  <MdOutlineKeyboardBackspace className='mr-2' />
                  Change phone number
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}

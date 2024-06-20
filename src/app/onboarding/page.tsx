import { redirect } from 'next/navigation';

export default async function Onboarding() {
  redirect('/onboarding/personal-information');

  return <></>;
}

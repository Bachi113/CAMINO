import { getUser } from '@/utils/get-user';
import { redirect } from 'next/navigation';

const Page = async () => {
  const user = await getUser();

  if (!user) {
    return redirect('/login');
  }

  return redirect('/onboarding/personal-information');
};

export default Page;

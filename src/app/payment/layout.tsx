import React from 'react';

type Props = {
  children: React.ReactNode;
};

// Custom layout for login page
const PaymentPageLayout = async ({ children }: Props) => {
  return (
    <div className='min-h-screen flex items-center justify-center bg-gradient-to-b from-white from-25% to-[#DDC3FF] p-4'>
      {children}
    </div>
  );
};

export default PaymentPageLayout;

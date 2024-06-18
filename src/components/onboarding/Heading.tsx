import React from 'react';

interface HeadingProps {
  title: string;
  icon: React.ReactNode;
  description: string;
}

const Heading = ({ title, icon, description }: HeadingProps) => {
  return (
    <div className='space-y-6 flex flex-col items-center'>
      <div className='border rounded-lg p-3'>{icon}</div>
      <div className='space-y-2 text-center'>
        <p className='text-default text-2xl font-semibold leading-7'>{title}</p>
        <p className='text-subtle text-sm font-medium leading-5'>{description}</p>
      </div>
    </div>
  );
};

export default Heading;

import Link from 'next/link';
import React from 'react';

const footer = () => {
  return (
    <div className='flex max-[400px]:flex-col flex-row justify-between items-center bg-gray-100 p-4 text-gray-600 text-xs sm:text-sm lg:text-base shadow-[0_9px_7px_10px_#00000021]'>
      <Link href="https://ssraj.vercel.app" target='_blank' className='italic font-medium underline'>Shounak Sarker</Link>
      <p className=''>
        &copy; {new Date().getFullYear()} All rights reserved.
      </p>
      <h3>shounaksarker@gmail.com</h3>
    </div>
  );
};

export default footer;
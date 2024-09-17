'use client';

import ReactPlayer from 'react-player';
import { RESOURCES } from '@/constants/Resources';

export const Videos = () => {
  return (
    <div className='pt-20 pr-0 pb-12 flex flex-col w-full h-full'>
      <strong className='text-4xl text-center uppercase mb-8 tracking-widest'>Retiro Umobi 2023</strong>
      <div className='flex justify-center'>
        <ReactPlayer url={RESOURCES.video} />
      </div>
    </div>
  )
}
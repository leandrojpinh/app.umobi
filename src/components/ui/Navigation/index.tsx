'use client';

import Image from 'next/image';
import Link from 'next/link';

import { FiLogIn, FiLogOut } from 'react-icons/fi';

import { logoUmobi } from '@/assets';
import { navigation } from "@/constants";
import { useAuth } from '@/contexts/AuthContext';
import { useApp } from '@/contexts/AppContext';


export const Navigation = () => {
  const auth = useAuth();
  const app = useApp();

  const logout = () => {
    auth.signOut();
    app.logout();
  }

  return (
    <nav className='h-20 flex items-center justify-center text-text shadow-md ease-in-out duration-200'>
      <div className='tracking-widest flex justify-between h-20 w-full max-w-7xl py-0 px-4 ease-in-out lg:px-8'>
        <div className='flex items-center cursor-pointer py-4 px-0'>
          <Link href={'/'} className='h-full '>
            <Image src={logoUmobi} alt='Logo Umobi' />
          </Link>
        </div>

        <ul className='flex items-center list-none text-center gap-8'>
          {
            auth.user.isAuthenticated && (!auth.user.isAdmin && !auth.user.isViewer) && (
              <>
                <li className='h-full flex items-center'>
                  <Link href={navigation.pages.private.registration.route}>
                    <div className='h-full uppercase items-center gap-2 flex transition-all ease-in-out duration-200 hover:opacity-70 rounded-lg max-h-10 px-2'>
                      <span>{navigation.pages.private.registration.name}</span>
                    </div>
                  </Link>
                </li>
                <li className='h-full flex items-center'>
                  <Link href={navigation.pages.private.profile.route}>
                    <div className='h-full uppercase items-center gap-2 flex transition-all ease-in-out duration-200 hover:opacity-70 rounded-lg max-h-10 px-2'>
                      <span>{navigation.pages.private.profile.name}</span>
                    </div>
                  </Link>
                </li>
              </>
            )
          }
          {auth && auth.user.isAdmin && (
            <li className='h-full flex items-center'>
              <Link href={navigation.pages.private.dashboard.route}>
                <div className='h-full uppercase items-center gap-2 flex transition-all ease-in-out duration-200 hover:opacity-70 rounded-lg max-h-10 px-2'>
                  <span>{navigation.pages.private.dashboard.name}</span>
                </div>
              </Link>
            </li>
          )}

          {auth.user.isAuthenticated ? (
            <li className='h-full flex items-center gap-2' onClick={logout}>
              <Link className='hover:opacity-70 transition-all duration-200' href={navigation.pages.public.signOut.route}>{navigation.pages.public.signOut.name}</Link>
              <FiLogOut height={36} className='text-app-primary-light' />
            </li>
          ) : (
            <>
              <li className='h-full flex items-center'>
                <Link href={navigation.pages.public.signUp.route}>
                  <div className='h-full max-h-10 cursor-pointer transition-all duration-200 flex text-app-text rounded-md items-center justify-center p-4 hover:brightness-90' style={{ background: 'var(--linear)' }}>
                    <span>{navigation.pages.public.signUp.name}</span>
                  </div>
                </Link>
              </li>
              <li className='h-full flex items-center gap-2'>
                <FiLogIn height={36} className='text-app-primary-dark' />
                <Link className='hover:opacity-70 transition-all duration-200' href={navigation.pages.public.signIn.route}>{navigation.pages.public.signIn.name}</Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  )
}
/* eslint-disable @next/next/no-img-element */

import React from 'react';
import styled from 'styled-components';
import Link from 'next/link';

import { FiLogOut } from 'react-icons/fi';
import { useAuth } from '@/context/AuthContainer';
import Image from 'next/image';
import { useApp } from '@/context/AppContext';

const Nav = styled.nav`
  color: var(--green0);
  height: 80px;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10;
  transition: 0.2s ease-in-out; 
  box-shadow: 0px 0.5px 0px #A2AAB6;
`;

const NavContainer = styled.div`
  display: flex;
  justify-content: space-between;
  height: 80px;
  z-index: 1;
  width: 100%;  
  max-width: 1200px;
  padding: 0 1rem;
  transition: .8s all ease;
  @media screen and (min-width: 830px) {
    padding: 0 2rem;
  }
  @media screen and (min-width: 1200px) {
    padding: 0;
  }
`;

const NavBrand = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 1rem 0;
`;

const NavMenu = styled.ul`
  display: flex;
  align-items: center;
  list-style: none;
  text-align: center;
  gap: 1rem;
  /* @media screen and (max-width: 830px) {
    display: none;
  } */
`;

const NavItem = styled.li`
  height: 100%;

  display: flex;
  align-items: center;

  a {
    display: flex;
    align-items: center;
    text-decoration: none;
    padding: 0 .5rem;
    height: 100%;
    cursor: pointer;
    border-bottom: 3px solid transparent;
    color: inherit;
    transition: .2s filter;
    &.active {
      border-color: var(primary-light) !important;
    }

    & :hover {
      filter: brightness(80%);
    }
  }

  button:hover, a:hover {
    filter: brightness(80%);
  }

  @media screen and (min-width: 830px) {
    padding: 0 1rem;
  }
`;

const NavLink = styled(Link)`
  height: 100%;

  a {
    display: flex;
    align-items: center;
    text-decoration: none;
    padding: 2rem;
    height: 100%;
    cursor: pointer;
    border-bottom: 3px solid transparent;
    color: inherit;
    &.active {
      border-color: var(--primary-light) !important;
    }
  }
`;

const NavLinkLogout = styled.a`
  height: 100%;

  button {
    display: flex;
    align-items: center;
    text-decoration: none;
    padding: 2rem;
    height: 100%;
    cursor: pointer;
    border-bottom: 3px solid transparent;
    color: inherit;
    &.active {
      border-color: var(--primary-light) !important;
    }
  }
`;

const SubscribeButton = styled.div`
  height: 100%;
  transition: filter .2s;
  display: flex;
  cursor: pointer;
  color: inherit;
  font-family: "Staatliches";
  letter-spacing: 0.1rem;
  font-weight: 500;

  background: var(--linear);
  border-radius: 8px;
  max-height: 2.1rem;  

  &:hover {
    filter: brightness(90%);
  }

  @media screen and (min-width: 830px) {
    max-height: 3rem;
  }
`;

const NavLinks = () => {
  const auth = useAuth();
  return (
    <>
      <NavMenu>
        {auth && auth.user.isAdmin && (
          <NavItem>
            <NavLink href={'/dashboard'}>Inscrições</NavLink>
          </NavItem>
        )}
        {/* <NavItem>
          <NavLink href={'about'}>Sobre nós</NavLink>
        </NavItem> */}
      </NavMenu>
    </>
  );
}

const SessionLinks = () => {
  return (
    <NavMenu>
      <NavItem>
        <FiLogOut height={36} color={'var(--primary-dark)'} />
        <NavLink href={'/sign-in'}>
          Entrar
        </NavLink>
      </NavItem>
      <NavItem>
        <SubscribeButton>
          <NavLink href={'/sign-up'}>
            Inscreva-se
          </NavLink>
        </SubscribeButton>
      </NavItem>
    </NavMenu>
  )
}

const Logout = () => {
  const auth = useAuth();
  const app = useApp();

  const logout = () => {
    auth.signOut();
    app.logout();
  }

  return (
    <NavMenu>
      {
        auth.user.isAuthenticated && (!auth.user.isAdmin && !auth.user.isViewer) && (
          <>
            <NavItem>
              <NavLink href={'/registration'}>Inscrições</NavLink>
            </NavItem>
            <NavItem>
              <NavLink href={'/profile'}>Perfil</NavLink>
            </NavItem>
          </>
        )
      }
      <NavItem>
        <NavLinkLogout onClick={logout}>
          Sair
        </NavLinkLogout>
        <FiLogOut height={36} color={'var(--primary-light)'} />
      </NavItem>
    </NavMenu>
  )
}

export const Navbar = () => {
  const auth = useAuth();

  return (
    <Nav>
      <NavContainer>
        <NavBrand>
          <NavLink href={'/'}>
            <picture>
              <Image src="/umobi-logo.png" height={42} width={128} alt="Umobi" objectFit='cover' />
            </picture>
          </NavLink>
        </NavBrand>
        {!auth?.user?.isAuthenticated ? (
          <>
            <NavLinks />
            <SessionLinks />
          </>
        ) : (
          <>
            {(auth?.user?.isAdmin || auth?.user?.isViewer) && <NavLinks />}
            <Logout />
          </>
        )}
      </NavContainer>
    </Nav>
  )
}
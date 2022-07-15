/* eslint-disable @next/next/no-img-element */

import React from 'react';
import styled from 'styled-components';
import Link from 'next/link';

import { FiLogOut } from 'react-icons/fi';
import { useAuth } from '@/context/AuthContainer';

const Nav = styled.nav`
  color: var(--green0);
  height: 90px;
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
  height: 90px;
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
    padding: 0 1rem;
    height: 100%;
    cursor: pointer;
    border-bottom: 3px solid transparent;
    color: inherit;
    transition: .2s filter;
    &.active {
      border-color: var(--green1) !important;
    }

    & :hover {
      filter: brightness(80%);
    }
  }

  button:hover, a:hover {
    filter: brightness(80%);
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
      border-color: var(--green1) !important;
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
      border-color: var(--green1) !important;
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
  max-height: 3rem;

  & :hover {
    filter: brightness(80%);
  }
`;

const NavLinks = () => {
  return (
    <>
      <NavMenu>
        <NavItem>
          <NavLink href={'/dashboard'}>Inscrições</NavLink>
        </NavItem>
        {/* 
        TODO: Login
        <NavItem>
          <NavLink href={'about'}>Sobre nós</NavLink>
        </NavItem> */}
      </NavMenu>
    </>
  )
}

const SessionLinks = () => {
  return (
    <NavMenu>
      <NavItem>
        <FiLogOut height={36} color={'var(--primary-dark)'} />
        <NavLink href={'/login'}>
          Entrar
        </NavLink>
      </NavItem>
      <NavItem>
        <SubscribeButton>
          <NavLink href={'/registration'}>
            Inscreva-se
          </NavLink>
        </SubscribeButton>
      </NavItem>
    </NavMenu>
  )
}

const Logout = () => {
  const auth = useAuth();

  const logout = () => {
    auth.signOut();
  }
  
  return (
    <NavMenu>
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
            <img src="/umobi-logo.png" height={42} width={128} alt="Igreja Bíblica Batista de Jardim Bandeirante" />
          </NavLink>
        </NavBrand>
        {!auth?.user?.isAuthenticated ? (
          <>
            {/* <NavLinks /> */}
            <SessionLinks />
          </>
        ) : (
          <>
          {(auth?.user?.isAdmin || auth?.user?.isViewer) &&  <NavLinks />}
          <Logout />
          </>          
        )}
      </NavContainer>
    </Nav>
  )
}
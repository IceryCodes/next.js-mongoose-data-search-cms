'use client';

import { ReactElement, useState } from 'react';

import Image from 'next/image';
import Link from 'next/link';

import { useAuth } from '@/contexts/AuthContext';
import { PageType, PageTypeMap } from '@/domains/interfaces';

import { Button } from './buttons/Button';
import VerifyBar from './VerifyBar';

const linkStyle: string =
  'font-bold text-white hover:text-[#545454] block transition-all duration-300 ease-in-out md:inline';

const Header = ({ children }: { children: ReactElement }) => {
  const { isAuthenticated, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState<boolean>(false);

  const Logout = () => {
    logout();
    setMenuOpen(false);
  };

  return (
    <>
      {/* Header Section */}
      <header className={`h-header w-full bg-[#00A7D4] fixed top-0 z-10 shadow-md`}>
        <div className="container h-full p-4 m-auto flex justify-between items-center">
          {/* Logo */}
          <Link href={process.env.NEXT_PUBLIC_BASE_URL}>
            <Image
              src="/assets/logo.png"
              alt={`${process.env.NEXT_PUBLIC_SITE_NAME} Logo`}
              width={200}
              height={100}
              className="max-h-[40px] w-auto md:max-h-[60px]"
              priority
            />
          </Link>

          {/* Mobile Hamburger Icon */}
          <Button
            element={
              <svg
                className="w-6 h-6 md:hidden"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
              </svg>
            }
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-white focus:outline-none"
          />

          {/* Navigation with Transition */}
          <nav
            className={`absolute md:static top-[65px] left-0 w-full md:w-auto bg-[#00A7D4] md:bg-transparent
            ${menuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'} 
            md:opacity-100 md:translate-y-0 md:flex transition-all duration-300 ease-in-out`}
          >
            <ul className="flex flex-col md:flex-row gap-4 p-4 md:p-0">
              {Object.keys(PageTypeMap).map((key) => {
                const pageType = PageTypeMap[key];

                if (pageType === PageType.LOGIN || pageType === PageType.REGISTER) if (isAuthenticated) return;
                if (pageType === PageType.VERIFY) return;

                return (
                  <Link key={key} href={`/${key.toLowerCase()}`} className={linkStyle} onClick={() => setMenuOpen(false)}>
                    <li>{pageType}</li>
                  </Link>
                );
              })}
              {isAuthenticated && (
                <Link href="" className={linkStyle} onClick={Logout}>
                  <li>登出</li>
                </Link>
              )}
            </ul>
          </nav>
        </div>
      </header>

      {/* Content Section */}
      <section className={`mt-header`}>{children}</section>

      <VerifyBar />
    </>
  );
};

export default Header;

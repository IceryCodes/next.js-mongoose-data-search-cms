import { useState } from 'react';

import Image from 'next/image';
import Link from 'next/link';

import Logo from '@/assets/LOGO_FFFFFF_300PX.png';

import { Button } from './buttons/Button';
import { PageTypeMap } from './interface';

const Header = ({ children }: { children: React.ReactNode }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      {/* Header Section */}
      <header className="h-[80px] w-full bg-[#00A7D4] fixed top-0 z-10 shadow-md">
        <div className="container h-full p-4 m-auto flex justify-between items-center">
          {/* Logo */}
          <Link href={process.env.NEXT_PUBLIC_BASE_URL}>
            <Image
              src={Logo}
              alt={`${process.env.NEXT_PUBLIC_SITE_NAME} Logo`}
              width={200}
              height={100}
              className="max-h-[40px] w-auto md:max-h-[60px]"
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
              {Object.keys(PageTypeMap).map((key: string) => (
                <Link
                  key={key}
                  href={`/${key.toLocaleLowerCase()}`}
                  className="font-bold text-white hover:text-[#545454] block transition-all duration-300 ease-in-out md:inline"
                >
                  <li>{PageTypeMap[key]}</li>
                </Link>
              ))}
            </ul>
          </nav>
        </div>
      </header>

      {/* Content Section */}
      <section className="mt-[80px]">{children}</section>
    </>
  );
};

export default Header;

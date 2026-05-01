"use client";
import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { ArrowRightIcon, Menu } from "lucide-react";
import { useAuth, useUser } from "@clerk/nextjs";
import Image from "next/image";

const Header = () => {
  const { user, isSignedIn } = useUser();
  const { signOut } = useAuth();
  const pathname = usePathname();

  const links: { name: string; link: string }[] = [
    { name: "Home", link: "/" },
    { name: "Series", link: "/series" },
    { name: "Films", link: "/movie" },
    { name: "New & Popular", link: "/new" },
  ];

  return (
    <header className="flex justify-between items-center py-2 px-4 sm:px-8 md:px-12 lg:px-20 relative z-50 bg-transparent">
      {/* Left Section */}
      <div className="flex items-center gap-4 sm:gap-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 sm:gap-3">
          <Image
            src="/images/logo.png"
            alt="logo"
            width={50}
            height={50}
            className="w-10 h-10 sm:w-[50px] sm:h-[50px] object-contain"
          />
          <h1 className="text-xl sm:text-2xl font-semibold text-white">
            Strimz
          </h1>
        </Link>

        {/* Nav Links (hidden on mobile) */}
        <ul className="hidden md:flex gap-6 lg:gap-8 items-center">
          {links.map((link) => (
            <li key={link.name}>
              <Link
                href={link.link}
                className={cn(
                  "text-sm font-poppins font-normal cursor-pointer capitalize transition-colors",
                  pathname === link.link
                    ? "text-white font-medium"
                    : "text-gray-300 hover:text-white"
                )}
              >
                {link.name}
              </Link>
            </li>
          ))}
        </ul>

        {/* Mobile menu icon */}
        <button className="md:hidden text-white ml-2">
          <Menu size={24} />
        </button>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-4 sm:gap-6">
        <Link
          href={`/showing`}
          className={cn(
            "text-sm font-poppins font-normal cursor-pointer capitalize hidden sm:block",
            pathname === "/showing" ? "text-[#10E305]" : "text-gray-300"
          )}
        >
          Showing now
        </Link>

        <div className="flex items-center gap-3 cursor-pointer">
          {isSignedIn ? (
            <>
              <div
                className="rounded-full font-bebas-neue text-sm w-[35px] h-[35px] sm:w-[40px] sm:h-[40px] text-dark-300 flex items-center justify-center font-light tracking-wide bg-center bg-cover"
                style={{ backgroundImage: `url(${user?.imageUrl})` }}
              />
              <h3 className="font-nunito-sans text-white text-sm sm:text-base hidden xs:block">
                {user?.firstName}
              </h3>
              <Image
                src="/icons/logout.svg"
                alt="logout"
                width={20}
                height={20}
                onClick={() => signOut()}
                className="cursor-pointer hover:opacity-80"
              />
            </>
          ) : (
            <Link
              href="/sign-in"
              className="flex items-center gap-2 text-xs sm:text-sm font-poppins rounded-full text-center px-4 sm:px-5 py-2 text-white bg-black bg-opacity-30 hover:bg-dark-100 transition"
            >
              Log in <ArrowRightIcon size={16} />
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;

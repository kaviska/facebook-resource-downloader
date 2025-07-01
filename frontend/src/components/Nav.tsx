"use client";

import { usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Logo from "../../public/logo.png";
import TranslateDropDown from "@/components/TranslateDropDown";

export default function Nav() {
  const pathname = usePathname(); // Get current route

  const handleLogoClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (pathname === "/") {
      e.preventDefault(); // Prevent default navigation
      window.location.reload(); // Force refresh
    }
  };

  return (
    <nav className=" ">
      <div className="  flex  items-center md:justify-between justify-center gap-12 mx-auto md:p-3 p-1">
        <div>
          <Link
            href="/"
            onClick={handleLogoClick}
            className="text-lg font-bold flex gap-3"
          >
            <Image src={Logo} alt="logo" width={60} height={60} className="w-[40px] md:w-[60px]" />
            <h2 className="text-[#DA08C9] md:text-[24px] text-[20px] mt-4">
              SaveFromInsta
            </h2>
          </Link>
        </div>

        <div className="ml-auto flex gap-4 mt-3 justify-center md:w-auto w-full items-center mb-4 ">
          <Link href="/blogs" className="text-lg font-medium flex gap-3">
            <h2 className="text-[#000000] md:text-[24px] text-[20px] mt-4">
              Blogs
            </h2>
          </Link>
          <div className="mt-5">
            <TranslateDropDown />
          </div>
        </div>
      </div>
    </nav>
  );
}

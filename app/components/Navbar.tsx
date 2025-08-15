"use client";
import { useTranslation } from "react-i18next";
import "@/lib/i18n";
import Link from "next/link";
import { useRef, useState } from "react";
import LanguageSwitcher from "./LanguageSwitcher";
import { useAuth } from "@/hooks/useAuth";

import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { Logo } from "./icons";
import { useBarberSlug } from "@/hooks/useBarberSlug";
import { useSignOut } from "@/app/api/auth/sign-out";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useTranslation();
  const { user } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const menuRef = useRef<HTMLDivElement>(null);
  const navLinks = [{ label: t("home.main"), href: "/" }];
  const slug = useBarberSlug();
  const { mutate: signOut } = useSignOut();

  if (user) {
    navLinks.push({
      label: t("home.dashboard"),
      href: `/barber/${slug}/dashboard`,
    });
  } else {
    navLinks.push(
      { label: t("home.signup"), href: "/signup" },
      { label: t("home.login"), href: "/login" }
    );
  }

  const handleLogout = async () => {
    await signOut();
    router.push("/");
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-white border-gray-200 dark:bg-gray-900">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <Link
          href="/"
          className="flex items-center  gap-x-3 rtl:space-x-reverse">
          <Logo />
          <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
            TarteebPro
          </span>
        </Link>

        <LanguageSwitcher
          setIsOpen={setIsOpen}
          isOpen={isOpen}
          menuRef={menuRef}
        />

        <div
          ref={menuRef}
          className={`items-center justify-between w-full md:flex md:w-auto md:order-1 ${
            isOpen ? "block" : "hidden"
          }`}
          id="navbar-language">
          <ul className="flex flex-col md:flex-row md:gap-8 rtl:space-x-reverse font-medium ps-4 pe-4 py-4 md:p-0 mt-4 md:mt-0 border border-gray-100 md:border-0 rounded-lg md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700 z-100 bg-white">
            {navLinks.map(({ label, href }) => (
              <li key={href}>
                <Link
                  href={href}
                  onClick={() => setIsOpen(false)}
                  className={`block py-2 px-3 rounded-sm md:p-0 ${
                    pathname === href
                      ? "text-white bg-blue-700 md:bg-transparent md:text-blue-700 md:dark:text-blue-500"
                      : "text-gray-900 hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
                  }`}
                  aria-current={pathname === "/" ? "page" : undefined}>
                  {label}
                </Link>
              </li>
            ))}
            {user && (
              <li className="md:ml-0">
                <button
                  onClick={handleLogout}
                  className={`block py-2 px-3 rounded-sm md:p-0 text-gray-900 hover:bg-gray-100 md:hover:bg-transparent md:hover:text-red-600 dark:text-white md:dark:hover:text-red-400 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent`}>
                  {t("home.logout")}
                </button>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

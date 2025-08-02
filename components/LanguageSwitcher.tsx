"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

type LanguageProps = {
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isOpen: boolean;
  menuRef: React.RefObject<HTMLDivElement | null>;
};

export default function LanguageSwitcher({
  setIsOpen,
  isOpen,
  menuRef,
}: LanguageProps) {
  const { i18n } = useTranslation();
  const langRef = useRef<HTMLDivElement>(null);

  const [langOpen, setLangOpen] = useState(false);
  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    setLangOpen(false);
  };
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;

      const clickedOutsideLang =
        langRef.current && !langRef.current.contains(target);
      const clickedOutsideMenu =
        menuRef.current && !menuRef.current.contains(target);

      if (clickedOutsideLang) {
        setLangOpen(false);
      }

      if (clickedOutsideMenu) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  return (
    <div className="flex items-center md:order-2 space-x-1 md:space-x-0 rtl:space-x-reverse relative">
      <button
        type="button"
        onClick={() => setLangOpen(!langOpen)}
        className="inline-flex items-center font-medium justify-center px-4 py-2 text-sm text-gray-900 dark:text-white rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:text-white">
        {i18n.language === "en" ? (
          <svg
            className="w-5 h-5 rounded-full me-3"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 3900 3900">
            <path fill="#b22234" d="M0 0h7410v3900H0z" />
            <path
              d="M0 450h7410m0 600H0m0 600h7410m0 600H0m0 600h7410m0 600H0"
              stroke="#fff"
              strokeWidth="300"
            />
            <path fill="#3c3b6e" d="M0 0h2964v2100H0z" />
          </svg>
        ) : (
          <svg
            className="w-5 h-5 rounded-full me-3"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 3900 3900">
            <rect width="3900" height="3900" fill="#006c35" />

            <path
              fill="#fff"
              d="M1010 1480c0-95 78-172 172-172h1536c95 0 172 77 172 172v186c0 95-77 172-172 172H1182c-94 0-172-77-172-172v-186z"
            />

            <path
              fill="#fff"
              d="M1250 2580h1400c50 0 90 40 90 90s-40 90-90 90H1250c-50 0-90-40-90-90s40-90 90-90z"
            />
          </svg>
        )}
        {i18n.resolvedLanguage === "ar" ? "العربية" : "English (US)"}
      </button>

      {langOpen && (
        <div
          ref={langRef}
          className="absolute right-0 top-full mt-2 w-40 bg-white border border-gray-200 rounded-md shadow-lg z-50 dark:bg-gray-800">
          <button
            onClick={() => changeLanguage("en")}
            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700">
            English (US)
          </button>
          <button
            onClick={() => changeLanguage("ar")}
            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700">
            العربية
          </button>
        </div>
      )}
      <div ref={menuRef}>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600 z-100"
          aria-controls="navbar-language"
          aria-expanded={isOpen}>
          <span className="sr-only">Open main menu</span>
          <svg
            className="w-5 h-5"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 17 14">
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M1 1h15M1 7h15M1 13h15"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}

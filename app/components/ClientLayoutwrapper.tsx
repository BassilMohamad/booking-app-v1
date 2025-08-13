"use client";

import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { dir } from "i18next";
import Navbar from "@/app/components/Navbar";
import { Toaster } from "sonner";
import { GlobalLoadingSpinner } from "./GlobalLoadingSpiner";

export default function ClientLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const { i18n } = useTranslation();

  useEffect(() => {
    document.documentElement.lang = i18n.language;
    document.documentElement.dir = dir(i18n.language);
  }, [i18n.language]);

  return (
    <div className="flex flex-col h-screen ">
      <div className="h-[10vh] shrink-0">
        <Navbar />
      </div>
      <main className="h-[90vh] overflow-auto bg-gray-100">
        {children}
        <GlobalLoadingSpinner />
      </main>
      <Toaster richColors position="top-center" expand={false} />
    </div>
  );
}

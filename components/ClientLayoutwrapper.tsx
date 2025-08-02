"use client";

import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { dir } from "i18next";
import Navbar from "@/components/Navbar";

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
    <>
      <Navbar />
      <main>{children}</main>
    </>
  );
}

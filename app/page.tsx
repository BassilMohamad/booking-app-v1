"use client";
import { Scissors } from "@/app/components/icons/index";
import { Button } from "@/app/components/ui/button";

import { useTranslation } from "react-i18next";
import "@/lib/i18n";
import Link from "next/link";
import LandingPage from "./LandingPage";

const Home = () => {
  const { t } = useTranslation();
  return <LandingPage />;
};
export default Home;

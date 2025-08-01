"use client";
import { useTranslation } from "next-i18next";
import "@/lib/i18n";
import Link from "next/link";

const Navbar = () => {
  const { t } = useTranslation();

  return (
    <nav className="sticky top-0 z-50 bg-white/30 backdrop-blur-2xl shadow-lg">
      <div className="container mx-auto flex justify-between items-center p-4">
        <div className="font-bold text-lg">تطبيق الحجوزات</div>
        <div className="space-x-4">
          <Link href="/">الرئيسية</Link>
          <Link href="/">{t("welcome")}</Link>
          <Link href="/dashboard">لوحة التحكم</Link>
          <Link href="/login">تسجيل الدخول</Link>
          <Link href="/signup">إنشاء حساب</Link>
        </div>
      </div>
    </nav>
  );
};
export default Navbar;

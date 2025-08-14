"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

export default function GA4Tracker() {
  const pathname = usePathname();

  useEffect(() => {
    // Ensure TypeScript knows about window.gtag
    if (typeof window !== "undefined" && (window as any).gtag) {
      (window as any).gtag("event", "page_view", {
        page_path: pathname,
      });
    }
  }, [pathname]);

  return null;
}

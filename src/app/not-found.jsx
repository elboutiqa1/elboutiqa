"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function NotFound() {
  useEffect(() => {
    const key = `notfound_refreshed_${window.location.pathname}`;

    if (!sessionStorage.getItem(key)) {
      sessionStorage.setItem(key, "1");
      window.location.reload();
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-6xl font-bold">404</h1>
      <p className="mt-4 text-muted-foreground">
        الصفحة التي تبحث عنها غير موجودة.
      </p>
      <Link href="/" className="mt-4 text-whatsapp">
        العودة للرئيسية
      </Link>
    </div>
  );
}
import Link from "next/link";

export default function NotFound() {
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
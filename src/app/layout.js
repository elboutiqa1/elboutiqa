import "./globals.css";
import localFont from 'next/font/local';
import NavBar from "./components/ui/NavBar";
import { Toaster } from "@/components/ui/sonner"
import { ShopProvider } from "@/Context/ShopContext";
import Footer from "./components/ui/footer"


const cairo = localFont({
  src: './assets/fonts/Cairo-VariableFont_slnt,wght.ttf',
  variable: '--font-cairo',
  style: 'normal', // 
  display: 'swap',
});


const alexandria = localFont({
  src: './assets/fonts/Alexandria-VariableFont_wght.ttf',
  variable: '--font-alexandria',
  style: 'normal',
  display: 'swap',
});


const inter = localFont({
  src: './assets/fonts/Inter-VariableFont_opsz,wght.ttf',
  variable: '--font-inter',
  style: 'normal',
  display: 'swap',
});



export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://elboutiqa.com"),
  title: {
    default: "البوتيقة | Elboutiqa - متجرك الإلكتروني في الجزائر",
    template: "%s | البوتيقة",
  },
  description:
    "متجر البوتيقة الإلكتروني في الجزائر. تسوق أفضل المنتجات، الإلكترونيات، والأجهزة الكهرومنزلية بأفضل الأسعار مع توصيل سريع لـ 58 ولاية والدفع عند الاستلام.",
  keywords: [
    "البوتيقة",
    "elboutiqa",
    "متجر إلكتروني الجزائر",
    "تسوق أونلاين",
    "أجهزة إلكترونية",
    "كهرومنزلية",
    "توصيل 58 ولاية",
    "الدفع عند الاستلام",
  ],
  authors: [{ name: "Elboutiqa" }],
  creator: "Elboutiqa",
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "ar_DZ",
    siteName: "Elboutiqa",
    title: "البوتيقة | Elboutiqa - متجرك الإلكتروني في الجزائر",
    description:
      "تسوق أفضل المنتجات والإلكترونيات بأفضل الأسعار مع توصيل سريع لـ 58 ولاية والدفع عند الاستلام.",
  },
  twitter: {
    card: "summary_large_image",
    title: "البوتيقة | Elboutiqa",
    description:
      "تسوق أفضل المنتجات والإلكترونيات بأفضل الأسعار مع توصيل سريع لجميع الولايات والدفع عند الاستلام.",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl" className={`${cairo.variable} ${alexandria.variable} ${inter.variable}`}>
      <body className="min-h-full font-cairo">
      <ShopProvider>

       

        <NavBar />
        {children}
        <Footer />
        <Toaster />
        

      </ShopProvider>
        </body>
    </html>
  );
}

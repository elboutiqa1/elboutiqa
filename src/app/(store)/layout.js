import NavBar from "@/app/components/ui/NavBar";
import Footer from "@/app/components/ui/footer";
import MetaPixel from "@/app/components/ui/MetaPixel";
import { Toaster } from "@/components/ui/sonner";

export default function StoreLayout({ children }) {
  return (
    <>
      <MetaPixel />
      <NavBar />
      <main id="main-content">{children}</main>
      <Footer />
      <Toaster />
    </>
  );
}

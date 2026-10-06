
import HeroBanner from "@/app/components/ui/HeroBanner"
import Category from "@/app/components/ui/Category"
import ProductsSection from "@/app/components/ProductsSection";
import AnnouncementBar from "@/app/components/ui/AnnouncementBar";
import HowItWork from "@/app/components/ui/HowItWork";


export default function Home() {
  return (
    <div className="min-h-screen w-full">
      {/*hero section Swiper*/}
      <HeroBanner/>
      <Category  />
      <AnnouncementBar/>
      <ProductsSection/>
      <HowItWork/>
  
    </div>
  );
}

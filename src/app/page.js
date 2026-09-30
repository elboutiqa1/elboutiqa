
import HeroBanner from "./components/ui/HeroBanner"
import Category from "./components/ui/Category"
import ProductsSection from "./components/ProductsSection";
import AnnouncementBar from "./components/ui/AnnouncementBar";
import HowItWork from "./components/ui/HowItWork";


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

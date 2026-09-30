import { Truck, Banknote, ShoppingCart } from 'lucide-react';
import Link from 'next/link';
const AnnouncementItems = () => (


<div className="flex items-center flex-row-reverse gap-3 md:gap-4 px-2 shrink-0 text-background">
    <span className="flex items-center justify-center flex-row-reverse whitespace-nowrap gap-1.5 md:gap-3 text-[14px] md:text-lg font-extrabold">
      <span>التوصيل إلى 58 ولاية</span>
      <Truck className="w-4 h-4 md:w-7 md:h-7 shrink-0" />
    </span>
    <span className="text-md text-surface/80 select-none">|</span>
    <span className="flex items-center justify-center flex-row-reverse whitespace-nowrap gap-1.5 md:gap-3 text-[14px] md:text-lg font-extrabold">
      <span>الدفع عند الإستلام</span>
      <Banknote className="w-4 h-4 md:w-7 md:h-7 shrink-0" />
    </span>
    <span className="text-md text-surface/80 select-none">|</span>
    <Link
      href="#products"
      className="underline decoration-2 underline-offset-7 whitespace-nowrap flex items-center justify-center flex-row-reverse gap-1.5 md:gap-3 text-[14px] md:text-xl font-extrabold font-alexandria cursor-pointer hover:text-secondary active:text-secondary transition-all duration-200 ease-in-out"
    >
      <span>أطلب الآن</span>
      <ShoppingCart className="w-4 h-4 md:w-7 md:h-7 shrink-0" />
    </Link>
    <span className="text-md text-surface/80 select-none md:hidden ">|</span>
  </div>
);


export default function AnnouncementBar() {
  return (
    <div className=" z-50 overflow-hidden w-full bg-primary-hover text-surface select-none h-[40px] md:h-[50px] border-b border-slate-800">
      {/* Mobile Continuous Marquee */}
      <div className="md:hidden flex overflow-hidden py-2">
        <div className={` animate-marquee-mobile-rtl flex items-center`}>
          <AnnouncementItems />
          <AnnouncementItems />
          <AnnouncementItems />
          <AnnouncementItems />
        </div>
      </div>

      {/* Desktop Centered Static Bar */}
      <div className="hidden md:flex items-center justify-center py-2 h-full">
        <AnnouncementItems  />
      </div>
    </div>
  );
}
'use client';
import Image from "next/image";
import Link from "next/link";
import { Swiper, SwiperSlide } from 'swiper/react';
import {
  Navigation,
  Scrollbar,
  Autoplay,
  Mousewheel,
  EffectCoverflow,
} from 'swiper/modules';


import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/scrollbar';
import 'swiper/css/effect-coverflow';



{/*import pictures*/}

import Img1 from '@/app/assets/pictures/6in1.png'
import Img2 from '@/app/assets/pictures/11in1.png'
import Product from "@/app/product/page";

const SLIDES = [
  {
   name:'6in1',
   Img:Img1 
  },
  { 
  name:'11in1',
   Img:Img2 
  },
 

];

export default function HeroBanner() {


  const swiperSettings = {
    className: "flex items-center justify-center w-full lg:max-w-[1600px] lg:mx-auto md:rounded-lg",
    modules: [Navigation, Scrollbar, Autoplay, Mousewheel, EffectCoverflow],
    loop: true,
    autoHeight: true,
    grabCursor: true,
    shortSwipes: false,
    observer: true,
    observeParents: true,
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev"
    },
    effect: "coverflow",
    scrollbar: {
      draggable: true,
      hide: false,
    },
    zoom: {
      maxRatio: 3,
      minRatio: 1,
    },
  };

  return (
    <div id="offers" className="relative w-full mt-[90px]  ">


      {/*banner background*/}
      {/* opacity of dark background*/}
      <div
  className="absolute inset-0 -z-10 h-[112%] bg-slate-950 pointer-events-none"
  style={{
    WebkitMaskImage:
      "linear-gradient(to bottom, black 80%, rgba(0,0,0,0.9) 88%, rgba(0,0,0,0.5) 95%, transparent 100%)",
    maskImage:
      "linear-gradient(to bottom, black 80%, rgba(0,0,0,0.9) 88%, rgba(0,0,0,0.5) 95%, transparent 100%)",
  }}
  >

        {/* layers of dark background */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-amber-500/10 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-red-600/10 via-transparent to-transparent" />
        {/*layers of white square background*/}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff09_1px,transparent_1px),linear-gradient(to_bottom,#ffffff09_1px,transparent_1px)] bg-[size:48px_48px]" />
      </div>

      <div className="w-full z-30 relative overflow-hidden max-w-[1200px] mx-auto">
        <Swiper {...swiperSettings} className="w-full">
        {SLIDES.map((slide, index) => (
          <SwiperSlide key={index}>
            {/*banners pictures*/}
            <div className="relative w-full flex flex-col justify-center items-center text-center">
              <Image
                src={slide.Img}
                alt={`عرض خاص ${slide.name}`}
                priority={index === 0}
                className="w-full h-auto block "
              />
              <Link
                href={`/product/${slide.name}`}
                aria-label={`أطلبه الآن - عرض ${slide.name}`}
                className="w-[100px] md:w-[150px] h-[40px] md:h-[50px] py-3 px-5 bg-primary hover:bg-primary-hover
                 flex justify-center items-center rounded-full text-xs md:text-lg font-bold text-background absolute bottom-4 md:bottom-7 left-1/2 -translate-x-1/2 border-2 border-background transition-all duration-200 cursor-pointer shadow-md"
              >
                أطلبه الآن
              </Link>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      {/* Custom buttons*/}
        <button type="button" aria-label="الشريحة السابقة" className="swiper-button-prev !text-background !w-10 !h-10 !p-3 bg-primary-hover hover:bg-primary rounded-full border border-background after:!text-xl transition-opacity duration-200 cursor-pointer" />
        <button type="button" aria-label="الشريحة التالية" className="swiper-button-next !text-background !w-10 !h-10 !p-3 bg-primary-hover hover:bg-primary rounded-full border border-background after:!text-xl transition-opacity duration-200 cursor-pointer" />


    </div>
  </div>
  );
}







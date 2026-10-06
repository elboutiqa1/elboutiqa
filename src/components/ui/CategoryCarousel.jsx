import * as React from "react"
import Image from "next/image"
import Link from "next/link"

import { Card, CardContent } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

export function CategoryCarousel({ categories = [] }) {
  if (!categories || categories.length === 0) {
    return null;
  }

  return (
    <Carousel
      dir="ltr"
      opts={{
        direction: "ltr",
      }}
      className="w-[75%] max-w-[1000px] "
    >
      <CarouselContent className="-ml-1  ">
        {categories.map((category, index) => (
          <CarouselItem
            key={category._id || index}
            className="basis-1/2 sm:basis-1/4 lg:basis-1/5 xl:basis-1/6 mx-auto"
          >
            <div className="py-2  group flex justify-center items-center flex-col ">
              <Card
                className="rounded-full h-25 w-25 md:h-30 md:w-30  bg-background
               group-hover:bg-primary-hover group-active:bg-primary-hover  ring-0  
                   transition-all duration-300 cursor-pointer  border-2 border-border overflow-hidden
               "
              >
                <CardContent className="flex justify-center items-center h-full w-full p-0">
                  <Link
                    href={"/category?category=" + (category.slug || category.name)}
                    className="w-full h-full flex justify-center items-center"
                  >
                    {category.image ? (
                      <Image
                        src={category.image}
                        alt={category.name}
                        width={200}
                        height={200}
                        quality={100}
                        className="w-[65%] h-[65%]  scale-120 lg:scale-100 h-auto object-cover group-hover:scale-120 transition-all duration-300 cursor-pointer"
                      />
                    ) : (
                      <div className="w-full h-full bg-slate-100 flex items-center justify-center text-xs text-text-muted">
                        {category.name?.slice(0, 2)}
                      </div>
                    )}
                  </Link>
                </CardContent>
              </Card>
              <h2 className="text-lg lowercase font-extrabold font-cairo text-center mt-2 text-primary transition-colors duration-300  group-hover:text-primary-hover">
                {category.name}
              </h2>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious
        size="lg"
        className="bg-primary-hover text-white ml-1 border-none "
      />
      <CarouselNext
        size="lg"
        className="bg-primary-hover text-white mr-1 border-none "
      />
    </Carousel>
  );
}

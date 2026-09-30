import { CategoryCarousel } from "@/components/ui/CategoryCarousel";


import img1 from "@/app/assets/category/hub.avif"
import img2 from "@/app/assets/category/mannette.avif"
import img3 from "@/app/assets/category/electronique.avif"
import img4 from "@/app/assets/category/electromenage.avif"

  const categories= [
        {
            name: "Hub",
            image: img1,
        },
        {
            name: "Gaming",
            image: img2,
        },
        {
            name: "Electronique",
            image: img3,
        },
        {
            name: "Electromenage",
            image: img4,
        }, 
     ];

export default function Category({className}) {
    
  
       
  
    return (
        <div id="categories" className={`w-full  flex flex-col gap-2 lg:gap-3 justify-center items-center mt-4  pt-4 sm:pt-15 md:pb-4 bg-background border-2
           border-primary
        border-r-0 border-l-0 ${className}`}>

  
            <h1 className="text-3xl lg:text-4xl font-extrabold font-alexandria text-primary ">التصنيفات</h1>
             <h1 className="font-bold text-text-muted text-sm lg:text-lg mb-3">إختصر البحث عن منتجك :</h1>
            <CategoryCarousel categories={categories} />
           
        </div>
    );
}
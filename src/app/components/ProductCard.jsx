"use client"
import Image from "next/image"
import Link from "next/link"
import { ShoppingCart ,Heart,} from 'lucide-react';
import { toast } from "sonner"
import { useShop } from "@/Context/ShopContext";

export default function ProductCard({id,name,description,price,oldPrice=0,quantity=0,img}) {
      const product={id,name,description,price,oldPrice,quantity,img}
      const {addToCart,toggleFavorite, favorites,cart,removeFavorite,removeFromCart} = useShop();

      const isFavorite = favorites.some(
     item => item.id === product.id
      );

      const isCart = cart.some(
     item => item.id === product.id
      );

    return(
        <div className=" relative w-full h-full flex justify-center items-center flex-col
        gap-2  bg-background border-[1px] border-border rounded-xl
         px-3 pt-1 pb-2 sm:pb-3 overflow-hidden
        ">

        {oldPrice !==0 &&<div className="absolute text-sm sm:text-md top-2 left-2  py-1 px-3 bg-primary text-background font-semibold rounded-2xl  z-30">
            {Math.round((price*100/oldPrice))}%
          </div>}

           {/*product image*/}
            <Link href={`/product/${product.id}`} className="w-full h-full flex  justify-center items-center z-10 overflow-hidden">
                <Image src={img} alt={name}  className="object-cover  w-60 h-auto hover:scale-110  transition-all duration-200 " />
            </Link>


               {/*product info*/}            
            <div className="w-full flex flex-1  flex-col justify-center items-center  gap-2  z-20">


                {/*product details*/}
                <div className="w-full flex flex-col  items-center justify-center gap-1 sm:gap-2">
                 <Link href={`/product/${product.id}`} className="text-sm sm:text-xl font-bold font-alexandria text-primary-hover line-clamp-2 hover:text-primary transition-all duration-200 cursor-pointer">{name}</Link>
                 <p className="text-start text-text-muted text-sm lg:text-lg line-clamp-2">{description}</p>
                 
                 {/* price*/}
                 <div className="w-full flex justify-center max-w-[200px] items-center gap-1 sm:gap-3 ">
                     <p className="text-primary text-xl sm:text-2xl font-extrabold line-clamp-1">{price}دج</p> 
                    {oldPrice !==0 &&<p className="text-text-muted text-sm sm:text-lg  line-clamp-1 line-through">{oldPrice}دج</p> } 
                 </div>
                


                </div>

                {/*buttons*/}  
                <div className="w-full flex  items-center justify-center gap-1 sm:gap-5  mt-auto">

        <Link href={`/product/${product.id}`}  className="w-[55%] h-[40px] sm:h-[50px] bg-primary-hover flex justify-center items-center
        rounded-xl text-md sm:text-xl font-bold   text-background hover:bg-primary transition-all duration-200 cursor-pointer active:bg-primary active:text-background
        ">شراء</Link>


        <div className="w-fit flex items-center justify-center gap-1 sm:gap-2 ">
        {/*favorite button*/}
         <div className={` bg-background p-2 sm:p-3 rounded-4xl text-primary-hover
             hover:text-red border-2 border-border hover:border-red active:text-red active:border-red transition-all 
             duration-200 cursor-pointer ${isFavorite ? "text-red border-red " : " text-primary-hover border-border"} `}
             onClick={() => {
               if(isFavorite){
                toggleFavorite(product); toast.error("تمت إزالة المنتج من المفضلة") 
              }else{
                toggleFavorite(product); toast.success("تمت إضافة المنتج إلى المفضلة")  
              }}}>
            <Heart strokeWidth={3} className={`size-4 sm:size-6  ${isFavorite ? "fill-red" : ""}`}/>
          </div> 

        {/*add to cart button*/}
        <div className={`flex items-center justify-center gap-1 sm:gap-2  p-3 rounded-4xl 
          transition-all duration-200 cursor-pointer
          ${isCart ? "bg-background text-primary-hover hover:text-primary hover:bg-background" : "bg-primary-hover text-background  hover:bg-primary active:bg-primary active:text-background"} `}
          onClick={() => {
            if(!isCart){
                addToCart(product); toast.success("تمت إضافة المنتج إلى السلة")
            }else{
                removeFromCart(product); 
                toast.error("تمت إزالة المنتج من السلة") 
            }
            }}>

            <ShoppingCart className='size-4 sm:size-6' />
          </div> 
        </div>
        </div>


            </div>
        </div>
    )
}
"use client"

import Image from 'next/image';
import logo from '@/app/assets/pictures/logo.webp'
import { useState, useEffect, useRef ,useContext} from 'react'
import Link from 'next/link';
import { ShoppingCart,ShoppingCartMinus ,Heart,HeartOff ,Search,Menu,BookOpenText, ArrowLeft, } from 'lucide-react';
import { FaWhatsapp ,FaFacebook ,FaInstagram} from "react-icons/fa";
import { useShop } from "@/Context/ShopContext";
import { toast } from "sonner"
import { scrollToSection } from '@/lib/utils';

import { 
  Sheet,
  SheetTrigger,
  SheetClose,
  SheetContent,

} from "@/components/ui/sheet";



export default function NavBar() {
    const [showNavbar,setShowNavbar] = useState(true);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const lastScrollY = useRef(0);
    const[search,setSearch]=useState("")
    const {addToCart,toggleFavorite, favorites,cart,removeFavorite,removeFromCart ,decreaseQuantity,getItemQuantity} = useShop();
    const [quantity,setQuantity] = useState(1);
    const totalPrice = cart?.reduce((acc, item) => {
      return acc + (item.price * getItemQuantity(item.id));
    }, 0) || 0;
    

    const totalItemsCount = cart.reduce((total, item) => {
      return total + (Number(item.quantity) || 1);
    }, 0);



      function isCart(id){
        return cart.some(
     item => item.id === id
      );
      }


  
    useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY <= 0) {
        setShowNavbar(true);
        lastScrollY.current = 0;
        return;
      }

      if (currentScrollY < 50) {
        setShowNavbar(true);
      } else if (Math.abs(currentScrollY - lastScrollY.current) > 10) {
        if (currentScrollY > lastScrollY.current) {
          setShowNavbar(false);
        } else {
          setShowNavbar(true);
        }
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [setShowNavbar]);

  


  const navItems=( 
    <ul className="
    flex justify-center items-center lg:flex-row  lg:gap-4 2xl:gap-6  lg:text-xl 2xl:text-2xl font-extrabold text-primary 
    flex-col h-full text-3xl gap-7 mt-10 lg:mt-0
    ">
    <li className='group relative ' >
    <Link 
      href="/"  
      onClick={(e) => {
        scrollToSection(e, "/");
        setIsMenuOpen(false);
      }}
      className='block hover:text-primary-hover transition-all duration-200'
    >
      الرئيسية
    </Link>
    <span className="absolute rounded-full w-full lg:w-0 group-hover:w-full h-[3px] bg-primary-hover start-0 bottom-0 translate-y-[7px] transition-all duration-300 ease-in-out"></span>
    </li>
    <li className='group relative '>
    <Link 
      href="/#categories" 
      onClick={(e) => {
        scrollToSection(e, "/#categories");
        setIsMenuOpen(false);
      }} 
      className='hover:text-primary-hover transition-all duration-200'
    >
      التصنيفات
    </Link>
    <span className="absolute rounded-full w-0 group-hover:w-full h-[3px] bg-primary-hover start-0 bottom-0 translate-y-[7px] transition-all duration-300 ease-in-out"></span>
    </li>
    <li className='group relative '>
    <Link 
      href="/#products" 
      onClick={(e) => {
        scrollToSection(e, "/#products");
        setIsMenuOpen(false);
      }} 
      className='hover:text-primary-hover transition-all duration-200'
    >
      المنتجات
    </Link>
    <span className="absolute rounded-full w-0 group-hover:w-full h-[3px] bg-primary-hover start-0 bottom-0 translate-y-[7px] transition-all duration-300 ease-in-out"></span>
    </li>
    <li className='group relative '>
    <Link 
      href="/#footer" 
      onClick={(e) => {
        scrollToSection(e, "/#footer");
        setIsMenuOpen(false);
      }} 
      className='hover:text-primary-hover transition-all duration-200'
    >
      إتصل بنا
    </Link>
    <span className="absolute rounded-full w-0 group-hover:w-full h-[3px] bg-primary-hover start-0 bottom-0 translate-y-[7px] transition-all duration-300 ease-in-out"></span>
    </li>

    </ul>
  )
    

    return(
         <nav
        className={`fixed z-40 top-0  h-[90px] flex items-center justify-between w-full 
          px-[2%]  xl:px-[10%] border-[1px] border-border  border-t-0 border-r-0 border-l-0  xl:pl-0
             transition-transform ease-in-out duration-300 bg-background
             ${showNavbar ? "translate-y-0" : "-translate-y-[135px]"}`}
      >

        {/*nav logo*/}
        <Link
          href="/"
          className="w-fit flex items-center justify-center gap-1.5 sm:gap-2.5 cursor-pointer "
          onClick={(e) => {
            scrollToSection(e, "/");
          }}
        >
            
            <h1 className="text-xl sm:text-3xl font-bold font-alexandria text-primary  tracking-tight max-[400px]:text-sm">
            elboutiqa
            </h1>
            <div className="h-[36px] w-[2px] rounded-full bg-primary/70"></div>
            <Image src={logo} priority alt="" className='w-10 h-10 md:w-15 md:h-15 max-[400px]:w-8 max-[400px]:h-8' />
            
        </Link>

        {/*navbar desktop*/}
        <div className="hidden lg:flex">
            {navItems}
        </div>


        <div className='w-fit flex justify-center  items-center gap-1.5 sm:gap-5'>


         {/*search*/}
          <Sheet>
          {/*open search button*/}
          <SheetTrigger aria-label="البحث عن منتج">
          <div  className=" bg-background p-3 rounded-4xl text-primary-hover
          hover:text-primary border-2 border-border hover:border-primary active:text-primary active:border-primary transition-all duration-200 cursor-pointer 
          ">
            <Search strokeWidth={3} className='size-6 '  />
          </div> 
          </SheetTrigger>

  <SheetContent side='bottom' className="min-w-full min-h-[75vh] border-none " buttonColor={"primary-hover"} buttonColorHover={"primary"}>
      <div className='h-full w-full py-5'>
        <h1 className='text-primary font-alexandria text-3xl font-bold w-full text-center'>البحث عن منتج</h1>

        <div className='w-full h-full flex items-center justify-center mt-20 gap-2 sm:gap-5 '>
         <input value={search} onChange={(e)=>setSearch(e.target.value)} type="text" placeholder='أدخل إسم المنتج...' aria-label="أدخل إسم المنتج" className='w-[250px] sm:w-[400px] h-[50px] text-md font-bold p-5 rounded-full border border-primary-hover focus:border-primary active:border-primary transition-all duration-200 ' />
         <SheetClose asChild>
         <Link href={`/search?search=${search}`} className='flex items-center justify-center w-[80px] sm:w-[100px] h-[50px] rounded-full bg-primary text-background font-bold hover:bg-primary-hover active:bg-primary-hover transition-all duration-200 cursor-pointer'>بحث</Link>
         </SheetClose>
        </div>
      
      <div className='h-full w-full flex flex-col items-center justify-center mt-30 mb-10 '>
        <Search  className='size-30 opacity-30 text-primary'  />
        <h2 className='text-lg sm:text-xl font-alexandria font-bold text-primary opacity-50 mt-3'>ابحث عن منتجك المفضل</h2>
      </div>

      </div>
  </SheetContent>
         </Sheet>




         {/*favorite*/}
          <Sheet >
          {/*open favorite button*/}
          <SheetTrigger aria-label="عرض قائمة المفضلة">
          <div className="group bg-background p-3 rounded-4xl text-primary-hover
          hover:text-red border-2 border-border hover:border-red active:text-red active:border-red transition-all duration-200 cursor-pointer 
           ">
            
            <Heart strokeWidth={3} className='size-6 '  />


          </div> 
          </SheetTrigger>

  <SheetContent side='bottom' className="min-w-full min-h-[75vh] max-h-[75vh] sm:min-h-[90vh] sm:max-h-[90vh] border-none  " buttonColor={"red"} buttonColorHover={"red"}>
      <div className=" text-red   flex justify-center items-center absolute left-1/2 top-3 translate-x-[-50%]">
            <Heart strokeWidth={3} className='size-10 '  />
          </div> 


    <div className=' min-h-full  w-full flex flex-col justify-center items-center flex-1 mt-15 border-t-[1px] border-border '>  
         
         {/*empty favorite*/}
          {favorites.length===0 ?(

            <div className='  h-full w-full flex flex-col items-center justify-center gap-1'>
            <HeartOff strokeWidth={3}  className='size-10 text-red' />
            <p className='text-lg  font-semibold text-red'  >لا توجد منتجات مفضلة</p>
            <SheetClose asChild>
            <button className='mt-4 bg-red hover:bg-red-hover active:bg-red-hover transition-all duration-200 text-background font-alexandria  rounded-full  py-2 px-4 cursor-pointer'>عرض المزيد</button>
            </SheetClose>
          </div>
            
          ):(
            <div className="flex h-full w-full max-w-[1100px] items-center justify-start flex-1 gap-2 flex-col  px-1 sm:px-5 sm:py-5 overflow-y-auto"> 

            {favorites.map((favorite)=>(
              
            <div key={favorite.id} className='w-full  flex items-center justify-between gap-5 p-4  border-[1px] border-border rounded-xl bg-background   '>
            {/*image*/}
              <Link href='#' className='max-w-60 h-full flex  justify-start sm:pr-10 items-center z-10 overflow-hidden'>
                <Image src={favorite.img} alt={favorite.name} className='object-cover  w-30 sm:w-40 h-auto hover:scale-110  transition-all duration-200 
                
                '/>
              </Link>
             
            <div className=" flex justify-center items-center gap-5 flex-1 ">

            
             {/*name*/}
              <div className=' max-w-[500px] flex justify-center items-center flex-col flex-1 '>
                <h2 className='text-sm sm:text-xl  font-bold font-alexandria text-primary-hover line-clamp-2'>{favorite.name}</h2>
                <p className='text-start text-text-muted text-sm lg:text-lg line-clamp-2'>{favorite.description}</p>
             </div>
            {/*price*/}
              <div >
              <h2 className='text-primary p-2 text-xl sm:text-3xl font-extrabold line-clamp-1'>{favorite.price}دج</h2>
            </div>
           </div> 



              {/*buttons*/}
              <div className='h-full flex flex-col items-center justify-center gap-2 sm:gap-3 '>
               {/*add to cart button*/}
               {/*add to cart button*/}
        <div className={`flex items-center justify-center gap-1 sm:gap-2  p-3 rounded-4xl 
          transition-all duration-200 cursor-pointer
          ${isCart(favorite.id) ? "bg-background text-primary-hover hover:text-primary hover:bg-background" : "bg-primary-hover text-background  hover:bg-primary active:bg-primary active:text-background"} `}
          onClick={() => {
            if(!isCart(favorite.id)){
                addToCart(favorite); toast.success("تمت إضافة المنتج إلى السلة")
            }else{
                removeFromCart(favorite); 
                toast.error("تمت إزالة المنتج من السلة") 
            }
            }}>

            <ShoppingCart className='size-4 sm:size-6' />
          </div> 

                {/*remove button*/}
          <div className=" bg-background p-2 sm:p-3 rounded-4xl text-primary-hover
             hover:text-red border-2 border-border hover:border-red active:text-red active:border-red transition-all 
             duration-200 cursor-pointer text-red border-red"
             onClick={() => {toggleFavorite(favorite); toast.error("تمت إزالة المنتج من المفضلة")}}>
            <HeartOff strokeWidth={3} className='size-4 sm:size-6 '/>
          </div> 
              </div>


              

            </div>
            ))}

            </div>
          )}
         
          
          
          {/*footer*/}


    </div>
  </SheetContent>
         </Sheet>


          {/*cart*/}
         <Sheet>
          {/*open cart button*/}
          <SheetTrigger aria-label="عرض سلة التسوق">
          <div className='flex items-center justify-center gap-2 bg-primary-hover p-4 sm:py-3 sm:px-4 rounded-4xl text-background
          hover:bg-primary active:bg-primary active:text-background transition-all duration-200 cursor-pointer
          '>
            <ShoppingCart className='size-6' />
          <span className='font-bold text-lg hidden sm:block  '>السلة</span>
          </div> 
          </SheetTrigger>

  <SheetContent side='left' className="min-w-full sm:min-w-1/3 border-none p-0 overflow-hidden flex flex-col h-full" buttonColor={"primary-hover"} buttonColorHover={"primary"}>
    <div className='flex flex-col h-full w-full bg-background overflow-hidden'>

          {/*header*/}
          <div className='p-5 w-full relative shrink-0 border-b border-border/40'>
            <div className="flex items-center gap-3 w-full justify-center ">
            <h1 className='font-alexandria font-bold text-lg text-primary-hover  '>سلة التسوق</h1>
            <span className='text-sm font-bold text-background bg-primary-hover px-2.5 py-0.5 rounded-full min-w-6 text-center shadow-xs'>{totalItemsCount}</span>
            </div>
            
            <div className='h-[2px] w-[80%] absolute bottom-0 start-0 end-0 mx-auto  bg-primary-hover/70'></div>
          </div>
        
        {/*cart product*/}
        {/*empty cart*/}
        {cart.length === 0 ? (

          <div className='h-full flex-1 w-full flex flex-col items-center justify-center gap-2 py-8 px-4 text-center'>
            <div className='p-4 bg-slate-100 rounded-full text-primary mb-2'>
              <ShoppingCartMinus className='size-10' />
            </div>
            <p className='text-lg font-bold font-alexandria text-primary'>السلة فارغة</p>
            <p className='text-sm text-text-muted'>لم تقم بإضافة أي منتج إلى سلة التسوق بعد</p>

            <SheetClose asChild>
              <button className='mt-4 bg-primary-hover hover:bg-primary transition-all duration-200 text-background font-alexandria font-semibold rounded-full py-2.5 px-6 cursor-pointer text-sm shadow-sm'>
                عرض المزيد
              </button>
            </SheetClose>
          </div>
        ):
        <div className="flex h-full w-full items-center justify-start flex-1 gap-2 flex-col px-2 overflow-y-auto min-h-0 py-2"> 
        {cart.map((product)=>(


           <div key={product.id} className='relative w-full max-w-[1100px] min-h-30 flex items-center justify-center gap-1 py-2 mt-2 px-1   border-[1px] border-border rounded-xl  

           '>
            {/*image*/}
            <SheetClose asChild>
              <Link href={`/product/${product.id}`} className='h-full  flex   justify-center  items-center z-10 overflow-hidden'>
                <Image src={product.img} alt={product.name} className='object-cover  w-30 sm:w-25 h-auto  hover:scale-110  transition-all duration-200 
                
                '/>
              </Link>
             </SheetClose>
            <div className=" flex justify-center items-center gap-5 flex-1 ">

            
             {/*name*/}
              <div className='w-fit flex justify-center items-center flex-col flex-1'>
                <SheetClose asChild>
                <Link href={`/product/${product.id}`} className='w-fit flex justify-center items-center flex-col flex-1'>
                <h2 className='text-sm sm:text-md  font-bold font-alexandria text-primary-hover line-clamp-2'>{product.name}</h2>
                </Link>
                </SheetClose>
                {/*<p className='text-start text-text-muted text-sm line-clamp-2'>{product.description}</p>*/}
             </div>
            {/*price*/}
              <div >
              <h2 className=' text-primary p-2 mb-2 text-lg sm:text-xl font-extrabold line-clamp-1'>{product.price*quantity}دج</h2>
            </div>
           </div> 



              {/*buttons*/}
              <div className='h-full flex flex-col items-center justify-center gap-2 sm:gap-3 '>
               {/*remove from cart button*/}
        <button
          type="button"
          aria-label={`إزالة ${product.name} من السلة`}
          className="absolute top-0 left-0 flex items-center justify-center gap-1 sm:gap-2  p-3 rounded-4xl 
          transition-all duration-200 cursor-pointer
           text-primary-hover hover:text-primary  "
          onClick={() => {
                removeFromCart(product); 
                toast.error("تمت إزالة المنتج من السلة") 
            }
            }>

            <ShoppingCartMinus className='size-6 ' />
          </button> 


              {/*quantity*/}
              <div className="absolute bottom-1 left-2 flex w-[80px]  items-center justify-center gap-2 border-2  border-border bg-background rounded-3xl">
                <button type="button" aria-label="زيادة الكمية" className='p-1 text-primary-hover  flex  items-center justify-center cursor-pointer' onClick={()=>addToCart(product)}>+</button>
                <span className='text-primary-hover text-md sm:text-lg font-extrabold line-clamp-1'>{getItemQuantity(product.id)}</span>
                <button type="button" aria-label="تقليل الكمية" className='p-1 text-primary-hover flex  items-center justify-center cursor-pointer' onClick={()=>decreaseQuantity(product)}>-</button>
              </div>
              </div>


              

            </div>
        ))
        }
        </div>
}
          {/*footer*/}
          {cart.length > 0 && (
            <div className="shrink-0 w-full bg-background border-t border-border p-4 sm:p-5 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] flex flex-col gap-3.5">
              
              {/* Total Price Section */}
              <div className="bg-background border border-border/80 rounded-2xl p-3.5 flex flex-col gap-2">
                <div className="flex items-center justify-between text-xs text-text-muted font-medium">
                  <span>عدد العناصر في السلة</span>
                  <span className="font-alexandria font-bold text-primary bg-background px-2.5 py-0.5 rounded-full border border-border">
                    {totalItemsCount} {totalItemsCount === 1 ? 'منتج' : 'منتجات'}
                  </span>
                </div>

                <div className="flex items-baseline justify-between pt-2 border-t border-dashed border-border">
                  <span className="font-alexandria font-bold text-base sm:text-lg text-primary-hover">
                    السعر الكلي:
                  </span>

                  
                  <div className="flex items-baseline items-center gap-1 text-primary">
                  <span className='text-xs text-text-muted font-medium'>
                    سعر التوصيل +
                  </span>

                    <span className="font-alexandria font-extrabold text-2xl sm:text-3xl tracking-tight text-primary-hover">
                      {totalPrice}
                    </span>
                    <span className="font-bold text-sm sm:text-base text-primary">دج</span>
                  </div>
                </div>
              </div>

              {/* Checkout and Continue Shopping Buttons */}
              <div className="flex flex-col gap-2.5 w-full">
                {/* Checkout Button */}
                <SheetClose asChild >
                <Link
                  href="/checkout"
                  className="w-full h-12 bg-primary-hover hover:bg-primary active:scale-[0.99] text-background font-alexandria font-bold text-base rounded-xl flex items-center justify-center gap-2.5 shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer group"
                >
                  <span>إجراء الطلب</span>
                  <ArrowLeft className="size-5 transition-transform duration-200 group-hover:-translate-x-1" />
                </Link>
                </SheetClose>
                {/* Continue Shopping Button */}
                <SheetClose asChild>
                  <button
                    className="w-full h-11 bg-background hover:bg-slate-50 active:scale-[0.99] text-primary hover:text-primary-hover font-alexandria font-semibold text-sm sm:text-base rounded-xl border border-border hover:border-primary/50 flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer"
                  >
                    <span>متابعة التسوق</span>
                  </button>
                </SheetClose>
              </div>

              {/* Trust Reassurance */}
              <div className="flex items-center justify-center gap-3 text-[11px] text-text-muted/80 pt-0.5">
                <span>الدفع عند الاستلام</span>
                <span>•</span>
                <span>التوصيل إلى 58 ولاية</span>
              </div>

            </div>
          )}

    </div>
  </SheetContent>
         </Sheet>



         {/*menu*/}
          <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
          {/*open menu button*/}
          <SheetTrigger aria-label="فتح القائمة الرئيسية">
          <div className=" bg-background p-3 rounded-4xl text-primary-hover 
          hover:text-primary border-2 border-border hover:border-primary active:text-primary active:border-primary transition-all duration-200 cursor-pointer 
           block lg:hidden">
            <Menu strokeWidth={3} className='size-6 '  />
          </div> 
          </SheetTrigger>


     <SheetContent side='bottom' className="min-w-full min-h-[75vh] border-none " buttonColor={"primary-hover"} buttonColorHover={"primary"}>
    <div className=' min-h-full  w-full '>  


      
          {/*nav items*/}
          
          <div className='relative min-h-[70vh] flex flex-col justify-center  w-full '>
           <BookOpenText strokeWidth={2} className='absolute top-0  left-1/2 -translate-x-1/2 translate-y-1/2 size-20 text-primary ' />
            {navItems}
          </div>
          
          {/*footer*/}
          
          <div className='flex items-center justify-center gap-4 mb-5 bg-primary-hover rounded-full p-3 w-fit mx-auto
          border-[1px] border-border 
          '>
            <Link href={"https://www.facebook.com/elboutiqa"} aria-label="صفحة فيسبوك" className='bg-background p-1.5 rounded-full border-[1px] border-border btn-hover btn-active'> <FaFacebook className='size-9 text-facebook active:text-facebook-hover '/> </Link>
            <Link href={"https://www.instagram.com/el_boutiqa"} aria-label="صفحة انستغرام" className='bg-background p-1.5 rounded-full border-[1px] border-border btn-hover btn-active'> <FaInstagram className='size-9 text-instagram active:text-instagram-hover '/> </Link>
            <Link href={"https://wa.me/213660184286"} aria-label="تواصل عبر واتساب" className='bg-background p-1.5 rounded-full border-[1px] border-border btn-hover btn-active'> <FaWhatsapp className='size-9 text-whatsapp active:text-whatsapp-hover '/> </Link>
          </div>

    </div>
     </SheetContent>
         </Sheet>
      </div>

     
        


        </nav>
    );
}

import Link from "next/link";
import { MoveLeft ,SearchAlert } from "lucide-react";
import ProductCard from "./ProductCard";
import { productsItems } from "@/lib/products";



export default function ProductsSection({title="المنتجات",search="",category="",description=true,className}) {

 const filteredProducts = search?.trim()
  ? productsItems.filter((product) =>
      product.name.toLowerCase().includes(search.trim().toLowerCase())
    )
  : category?.trim()
    ? productsItems.filter((product) =>
        product.category.toLowerCase().includes(category.trim().toLowerCase())
      )
    : productsItems;

    return(
        <div id="products" className={`mt-10 sm:mt-20  ${className}`}>
          
            {/*section title*/}
            <div className="w-full text-center flex justify-center items-center flex-col gap-2 lg:gap-3">

            <div className="relative flex justify-center items-center  ">
             <h1 className="text-2xl lg:text-4xl font-extrabold font-alexandria text-primary ">{title}</h1>
              {title!=="المنتجات" && <span className="absolute -left-14 p-3 h-10 w-10 bg-primary rounded-full text-background text-xl font-bold flex items-center justify-center">{filteredProducts.length}</span>}
                </div>

              {description && <h2 className="font-bold text-text-muted text-sm lg:text-lg ">أفضل جودة مقابل السعر</h2>}
            </div>
            

            {/*products grid*/}
          
            <div className="relative grid grid-cols-2 gap-2 sm:gap-4 lg:grid-cols-3 xl:grid-cols-4 mt-10 px-3 max-w-[1500px] mx-auto
           
            ">
               {title==='المنتجات' && <Link href="/product" className="flex items-center gap-2 absolute left-5 hover:text-primary transition-all duration-200 -top-10 z-30 font-bold text-sm sm:text-xl text-primary  ">عرض الجميع <MoveLeft strokeWidth={3}/></Link>}
                {title!=="المنتجات" && <Link href="/" className="flex items-center gap-2 mt-2 absolute left-5 hover:text-primary transition-all duration-200 -top-10 z-30 font-bold text-sm sm:text-xl text-primary  ">العودة<MoveLeft strokeWidth={3}/></Link>}
              {filteredProducts.map((product) => (
                <ProductCard
                key={product.id}
                id={product.id}
                name={product.name}
                description={product.description}
                price={product.price}
                oldPrice={product.oldPrice}
                img={product.img}
                />
                ))}
            </div>

            {/*no result*/}
            {filteredProducts.length===0 &&
            <h1 className="text-2xl lg:text-3xl  font-cairo text-text-muted w-full text-center flex justify-center items-center gap-3 opacity-60 ">لا توجد منتجات <SearchAlert className="size-10 md:size-13"/></h1>
            }
            
        </div>
    )
}
    
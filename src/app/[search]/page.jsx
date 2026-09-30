
import ProductsSection from "../components/ProductsSection";
import {MoveLeft} from "lucide-react"




import Link from "next/link";
export default async function Search({searchParams}){


  const params = await searchParams;
  const search = params.search;

    return(
        <div className="min-h-screen mt-[130px]  w-full  relative  ">
            
            <ProductsSection description={false} title={`نتائج البحث عن : ${search}`} search={search} />
            
        </div>
    )
}

import Category from "../components/ui/Category";
import ProductsSection from "../components/ProductsSection";

export default async function categorySection({searchParams} ) {

    const params = await searchParams;
    const category = params.category;
    
    console.log(category)
    return (
        <div className="mt-20 ">
            <Category className="!border-none "/>
            <ProductsSection description={false}  category={category} title={"الصنف : "+category} className="!mt-10"/>
        </div>
    );
}
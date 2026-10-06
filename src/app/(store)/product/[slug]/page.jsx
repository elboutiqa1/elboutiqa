import ShowProduct from "@/app/components/ui/ShowProduct";
import { getProductBySlug } from "@/lib/products";
import { notFound } from "next/navigation";

export default async function ShowProductPage({ params }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) notFound();

  return (
    <div className="min-h-screen mt-[90px] w-full bg-background">
      <ShowProduct product={product} />
    </div>
  );
}
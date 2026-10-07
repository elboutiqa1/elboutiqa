import ShowProduct from "@/app/components/ui/ShowProduct";
import { getProductBySlug } from "@/lib/products";
import { notFound, redirect } from "next/navigation";

export default async function ShowProductPage({ params }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) notFound();

  // إذا وُجد المنتج عبر slug قديم → redirect دائم للرابط الجديد
  if (product._redirectSlug) {
    redirect(`/product/${encodeURIComponent(product._redirectSlug)}`);
  }

  return (
    <div className="min-h-screen mt-[90px] w-full bg-background">
      <ShowProduct product={product} />
    </div>
  );
}
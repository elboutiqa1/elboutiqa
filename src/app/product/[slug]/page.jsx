"use client";

import { useParams } from "next/navigation";
import ShowProduct from "@/app/components/ui/ShowProduct";
import { getProductById } from "@/lib/products";

export default function ShowProductPage() {
  const params = useParams();
  const slug = params?.slug;
  const product = getProductById(slug);

  return (
    <main className="min-h-screen mt-[90px] w-full bg-background">
      
      <ShowProduct product={product} />
    </main>
  );
}
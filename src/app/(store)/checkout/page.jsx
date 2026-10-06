"use client"
import FormeSection from "@/app/components/ui/formeSection";
import { useShop } from "@/Context/ShopContext";
import Link from "next/link";
import Image from "next/image";
import { Trash2, Minus, Plus, ShoppingCart,  PackageCheck, PackageX } from "lucide-react";

export default function CartFormePage() {

  const { addToCart, cart, removeFromCart, decreaseQuantity } = useShop();

  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="w-full mt-[130px] ">
      {/* Breadcrumb */}
      <nav className="flex items-center mr-5 gap-2 text-xs sm:text-sm text-text-muted mb-6 sm:mb-8 font-cairo">
        <Link href="/" className="hover:text-primary transition-colors">
          الرئيسية
        </Link>
        <span>/</span>
        <span className="text-primary font-semibold truncate max-w-[220px] sm:max-w-md">
          السلة
        </span>
      </nav>

      {/* product section*/}
      <div className="w-full max-w-4xl mx-auto px-3 sm:px-0 mb-8">
        <div className="rounded-2xl sm:rounded-3xl border border-border bg-background shadow-xl overflow-hidden">
          {/* العنوان */}
          <div className="bg-primary text-background px-4 sm:px-8 py-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-background text-primary flex items-center justify-center shadow-md">
              <ShoppingCart className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold font-alexandria text-background">
                سلة المشتريات
              </h2>
              <p className="text-xs sm:text-sm text-background/80 font-cairo">
                {totalItems} {totalItems > 1 ? "منتجات" : "منتج"} في السلة
              </p>
            </div>
          </div>

          {cart.length === 0 ? (
            <div className="p-8 sm:p-12 text-center flex flex-col items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-border/30 flex items-center justify-center">
                <ShoppingCart className="w-8 h-8 text-text-muted" />
              </div>
              <p className="text-text-muted font-cairo text-sm sm:text-base">
                السلة فارغة حالياً
              </p>
              <Link
                href="/product"
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary text-background font-bold hover:bg-primary-hover transition-colors text-sm"
              >
                تصفح المنتجات
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {cart.map((product) => (
                <div
                  key={product.id}
                  className="flex relative items-center gap-3 sm:gap-5 p-4 sm:p-5  transition-colors"
                >

                


                  {/* صورة المنتج */}
                  <div className="shrink-0">
                    <Image
                      src={product.img}
                      alt={product.name}
                      width={80}
                      height={80}
                      className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-xl border border-border bg-background"
                    />
                  </div>

                  {/* تفاصيل المنتج */}
                  <div className="flex-1 min-w-0 space-y-1.5">
                    <h3 className="font-alexandria font-bold text-sm sm:text-base text-primary-hover line-clamp-2 leading-snug">
                      {product.name}
                    </h3>
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-primary font-bold text-sm sm:text-lg font-cairo">
                        {product.price.toLocaleString()} دج
                      </p>
                      {product.selectedOption && (
                        <span className="text-xs font-semibold font-alexandria bg-primary/10 text-primary px-2 py-0.5 rounded-md border border-primary/20">
                          الخيار: {product.selectedOption}
                        </span>
                      )}
                    </div>
                  </div>


             {/*instock */}
              {/* product  stock*/}
            <div className="flex  items-center gap-2 text-xs font-bold text-whatsapp">
            {product.inStock ? <span className="flex items-center gap-1">
                <PackageCheck className="w-4 h-4 text-whatsapp" />
              </span> : <span className="flex items-center gap-1 text-red">
                <PackageX className="w-4 h-4 text-red" />
                 إحذف للمتابعة
              </span>}
                </div>

                  {/* الكمية + حذف */}
                  <div className="flex  items-center gap-4 shrink-0">
                    {/* تحكم في الكمية */}
                    <div className="flex items-center border border-border rounded-lg bg-background overflow-hidden">
                      <button
                        onClick={() => decreaseQuantity(product)}
                        className="px-2 sm:px-2.5 py-1.5 text-primary-hover  cursor-pointer"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="px-3 py-1.5 font-bold text-md font-cairo font-bold text-primary min-w-[32px] text-center">
                        {product.quantity}
                      </span>
                      <button
                        onClick={() => addToCart(product)}
                        className="px-2 sm:px-2.5 py-1.5 text-primary-hover cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* زر الحذف */}
                    <button
                      onClick={() => removeFromCart(product)}
                      className="flex items-center  gap-1.5 text-red hover:text-red-hover transition-colors text-xs font-cairo cursor-pointer"
                    >
                      <Trash2 className="w-6 h-6" />
                    </button>
                  </div>
                </div>
              ))}

              {/* ملخص الإجمالي */}
              <div className="p-4 sm:p-5 bg-background">
                <div className="flex items-center justify-between">
                  <span className="font-alexandria font-bold text-base sm:text-lg text-primary-hover">
                    إجمالي السعر :
                  </span>
                  <span className="font-extrabold font-alexandria text-xl sm:text-2xl text-primary">
                   <span className="text-text-muted text-sm font-cairo">سعر التوصيل + </span> {totalPrice.toLocaleString()} دج
                  </span>
                </div>
                <p className="text-xs text-text-muted font-cairo mt-1">
                  * سعر التوصيل يُحدد بعد اختيار الولاية في الاستمارة أسفله
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* استمارة الطلب */}
      {totalItems ===0 || cart.filter((product) => !product.inStock).length !== 0 ? null : <FormeSection totalPrice={totalPrice} /> }
      
    </div>
  );
}
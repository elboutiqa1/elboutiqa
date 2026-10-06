"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  Heart, 
  ShoppingCart, 
  Share2, 
  ArrowDown,
  Check, 
  Truck, 
  ShieldCheck, 
  SlidersHorizontal,
  ChevronRight, 
  ChevronLeft,
  ArrowUp,
  PackageCheck,
  PackageX
} from "lucide-react";
import { toast } from "sonner";
import { useShop } from "@/Context/ShopContext";
import FormeSection from "./formeSection";

export default function ShowProduct({ product }) {
  // extract options / sizes / variants
  const productOptions = (product?.options && product.options.length > 0)
    ? product.options
    : (product?.sizes && product.sizes.length > 0)
      ? product.sizes
      : (product?.variants && product.variants.length > 0)
        ? product.variants
        : (product?.colors && product.colors.length > 0)
          ? product.colors
          : [];

  const getInitialOption = (p) => {
    if (p?.options && p.options.length > 0) {
      const first = p.options[0];
      return typeof first === "object" ? (first.name || first.label || "") : String(first);
    }
    if (p?.sizes && p.sizes.length > 0) return String(p.sizes[0]);
    if (p?.variants && p.variants.length > 0) return String(p.variants[0]);
    if (p?.colors && p.colors.length > 0) return String(p.colors[0]);
    return "";
  };

  const [selectedOption, setSelectedOption] = useState(() => getInitialOption(product));

  useEffect(() => {
    setSelectedOption(getInitialOption(product));
  }, [product?.id, product?._id, product?.slug]);

  // find selected option object to get custom price/oldPrice if defined
  const selectedOptionObj = productOptions.find((opt) => {
    const optName = typeof opt === "object" ? (opt.name || opt.label) : String(opt);
    return optName === selectedOption;
  });

  const currentPrice = (typeof selectedOptionObj === "object" && selectedOptionObj?.price !== undefined)
    ? Number(selectedOptionObj.price)
    : Number(product?.price || 0);

  const currentOldPrice = (typeof selectedOptionObj === "object" && selectedOptionObj?.oldPrice !== undefined)
    ? Number(selectedOptionObj.oldPrice)
    : Number(product?.oldPrice || 0);

  // calculate discount percentage
  const discountPercent = currentOldPrice && currentOldPrice > currentPrice
    ? Math.round(((currentOldPrice - currentPrice) / currentOldPrice) * 100)
    : 0;

  const currentProduct = {
    ...product,
    id: product?.id || product?._id,
    _id: product?._id || product?.id,
    slug: product?.slug || product?._id || product?.id,
    price: currentPrice,
    oldPrice: currentOldPrice,
    selectedOption,
  };

  // import array images of product
  const images = product?.images && product.images.length > 0 
    ? product.images 
    : (product?.img ? [product.img] : []);

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);

  const { addToCart, toggleFavorite, favorites, cart, removeFromCart } = useShop();

  const productId = product?.id || product?._id;
  const isFavorite = favorites.some((item) => (item.id === productId) || (product?.slug && item.slug === product.slug));
  const isInCart = cart.some((item) => 
    ((item.id === productId) || (product?.slug && item.slug === product.slug)) && 
    (!item.selectedOption || item.selectedOption === selectedOption)
  );

  const currentImg = images[activeImageIndex] || product?.img;

  const nextImage = () => {
    setActiveImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setActiveImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const scrollToOrderForm = () => {
    const el = document.getElementById("order-form-section");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleShare = () => {
    if (typeof window !== "undefined" && navigator.share) {
      navigator.share({
        title: product?.name,
        url: window.location.href,
      }).catch(() => {});
    } else {
      if (typeof window !== "undefined") {
        navigator.clipboard?.writeText(window.location.href);
        toast.success("تم نسخ رابط المنتج إلى الحافظة");
      }
    }
  };

  return (
    <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
      {/* (Breadcrumb) */}
      <nav className="flex items-center gap-2 text-xs sm:text-sm text-text-muted mb-6 sm:mb-8 font-cairo">
        <Link href="/" className="hover:text-primary transition-colors">
          الرئيسية
        </Link>
        <span>/</span>
        <Link href="/#products" className="hover:text-primary transition-colors">
          المنتجات
        </Link>
        <span>/</span>
        <span className="text-primary font-semibold truncate max-w-[220px] sm:max-w-md">
          {product?.name}
        </span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-12 mt-10 gap-8 lg:gap-12 items-start">
        {/* gallery section */}
        <div className="lg:col-span-6 flex flex-col gap-4">
          {/* main image */}
          <div className="relative w-full aspect-square bg-background rounded-2xl sm:rounded-3xl border border-border overflow-hidden flex items-center justify-center shadow-sm group">
            {/* discount and stock tags */}
            <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-20 flex flex-col gap-2">
              {discountPercent > 0 && (
                <span className="text-sm sm:text-md top-2 left-2 py-1 px-2 bg-primary text-background font-semibold rounded-2xl z-30">
                  خصم {discountPercent}%
                </span>
              )}
            </div>

            {/* main image buttons*/}
            <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-20 flex items-center gap-2">
              <button
                type="button"
                onClick={handleShare}
                className="w-10 h-10 rounded-full bg-background/90 backdrop-blur-md border border-border text-primary hover:text-primary-hover transition-all flex items-center justify-center shadow-sm cursor-pointer"
                title="مشاركة المنتج"
              >
                <Share2 className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => {
                  toggleFavorite(currentProduct);
                  if (isFavorite) {
                    toast.error("تمت إزالة المنتج من المفضلة");
                  } else {
                    toast.success("تمت إضافة المنتج إلى المفضلة");
                  }
                }}
                className={`w-10 h-10 rounded-full bg-background/90 backdrop-blur-md border transition-all flex items-center justify-center shadow-sm cursor-pointer hover:scale-105 ${
                  isFavorite 
                    ? "text-red border-red" 
                    : "border-border text-primary hover:text-red hover:border-red"
                }`}
                title="إضافة للمفضلة"
              >
                <Heart className={`w-5 h-5 ${isFavorite ? "fill-red" : ""}`} />
              </button>
            </div>

            {/* selectioned image*/}
            <div className="relative w-full h-full p-4 sm:p-8 flex items-center justify-center">
              {currentImg && (
                <Image
                  src={currentImg}
                  alt={product?.name || "Product"}
                  fill
                  priority
                  className="object-contain p-4 group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              )}
            </div>

            {/* image pagination */}
            {images.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={prevImage}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-background/80 hover:bg-background text-primary border border-border shadow-md flex items-center justify-center transition-all opacity-80 hover:opacity-100 z-20 cursor-pointer"
                  aria-label="الصورة السابقة"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  onClick={nextImage}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-background/80 hover:bg-background text-primary border border-border shadow-md flex items-center justify-center transition-all opacity-80 hover:opacity-100 z-20 cursor-pointer"
                  aria-label="الصورة التالية"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
              </>
            )}

            {/* مؤشر عدد الصور */}
            {images.length > 1 && (
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 px-3 py-1 rounded-full bg-primary/70 backdrop-blur-sm text-background text-xs font-semibold">
                {activeImageIndex + 1} / {images.length}
              </div>
            )}
          </div>

          {/* مصغرات الصور (Thumbnails) */}
          {images.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveImageIndex(idx)}
                  className={`relative w-20 h-20 sm:w-24 sm:h-24 rounded-xl border-2 overflow-hidden flex-shrink-0 bg-background p-1 transition-all cursor-pointer mt-2 mx-2 ${
                    activeImageIndex === idx
                      ? "border-primary scale-102 shadow-md"
                      : "border-border hover:border-primary/40 opacity-75 hover:opacity-100"
                  }`}
                >
                  <Image
                    src={img}
                    alt={`${product?.name} - صورة ${idx + 1}`}
                    fill
                    className="object-contain p-1"
                    sizes="96px"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* product details*/}
        <div className="lg:col-span-6 flex flex-col gap-7">


          {/* product category and stock*/}
        
            <div className="flex items-center gap-2 text-xs font-bold text-whatsapp">
            {product.inStock ? <span className="flex items-center gap-1">
                <PackageCheck className="w-4 h-4 text-whatsapp" />
                متوفر في المخزون
              </span> : <span className="flex items-center gap-1 text-red">
                <PackageX className="w-4 h-4 text-red" />
                غير متوفر في المخزون
              </span>}
            </div>
          


          {/* عنوان المنتج */}
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold font-alexandria text-primary leading-tight">
            {product?.name}
          </h1>

          {/* قسم الأسعار */}
          <div className="p-4 sm:p-5 rounded-2xl bg-background border border-border/70 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-baseline gap-3">
              <span className="text-3xl sm:text-4xl font-extrabold font-alexandria text-primary">
                {currentPrice} دج
              </span>
              {currentOldPrice !== 0 && currentOldPrice > currentPrice && (
                <span className="text-lg sm:text-xl text-text-muted line-through">
                  {currentOldPrice} دج
                </span>
              )}
            </div>

            {discountPercent > 0 && (
              <span className="px-3 py-1.5 rounded-xl bg-red/10 text-red font-bold text-sm border border-red/20">
                وفرت {currentOldPrice - currentPrice} دج
              </span>
            )}
          </div>

          {/* قسم اختيار الخيارات / المقاسات (Desktop) */}
          {productOptions.length > 0 && (
            <div className="space-y-3 p-4 rounded-2xl bg-background border border-border/80">
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm font-bold font-alexandria text-primary flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-primary" />
                  <span>الخيارات المتاحة / المقاس:</span>
                </span>
                {selectedOption && (
                  <span className="text-xs font-semibold font-alexandria text-primary bg-primary/10 px-2.5 py-1 rounded-lg border border-primary/20 truncate max-w-[200px]">
                    المحدد: {selectedOption}
                  </span>
                )}
              </div>

              <div className="flex flex-wrap gap-2.5">
                {productOptions.map((opt, idx) => {
                  const optName = typeof opt === "object" ? (opt.name || opt.label) : String(opt);
                  const optPrice = typeof opt === "object" ? opt.price : null;
                  const isSelected = selectedOption === optName;

                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSelectedOption(optName)}
                      className={`relative flex items-center gap-2 px-3.5 py-2 rounded-xl border-2 transition-all duration-200 cursor-pointer text-xs sm:text-sm font-alexandria font-semibold select-none ${
                        isSelected
                          ? "border-primary bg-primary text-background shadow-md shadow-primary/20 scale-[1.02]"
                          : "border-border bg-background text-text hover:border-primary/50 hover:bg-background/80"
                      }`}
                    >
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-all ${
                        isSelected ? "border-background bg-background text-primary" : "border-border"
                      }`}>
                        {isSelected && <Check className="w-2.5 h-2.5 stroke-[3] text-primary" />}
                      </div>
                      <span>{optName}</span>
                      {optPrice && (
                        <span className={`text-[11px] px-1.5 py-0.5 rounded font-bold ${
                          isSelected ? "bg-background/20 text-background" : "bg-primary/10 text-primary"
                        }`}>
                          {optPrice} دج
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* تحديد الكمية */}
          <div className="flex items-center gap-4 py-2">
            <span className="text-md font-bold text-primary">الكمية:</span>
            <div className="flex items-center border-2 border-border rounded-xl bg-background overflow-hidden shadow-sm">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="w-10 h-10 flex items-center justify-center text-xl font-bold text-primary hover:bg-background transition-colors cursor-pointer"
              >
                -
              </button>
              <span className="w-10 h-10 flex items-center justify-center font-bold text-xl font-alexandria text-primary border-x border-border">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity((q) => q + 1)}
                className="w-10 h-10 flex items-center justify-center text-xl font-bold text-primary hover:bg-background transition-colors cursor-pointer"
              >
                +
              </button>
            </div>
            <span className="text-md font-bold text-text-muted">
              (المجموع: <strong className="text-primary">{currentPrice * quantity} دج</strong>)
            </span>
          </div>

          {/* وصف مختصر للمنتج */}
          <div className="hidden sm:block text-sm sm:text-base text-text-muted leading-relaxed font-cairo">
            <p>{product?.description}</p>
          </div>

          {/* المميزات السريعة */}
          {product?.features && product.features.length > 0 && (
            <div className="space-y-2 py-2 hidden sm:block">
              <h4 className="text-sm font-bold font-alexandria text-primary">
                أبرز المميزات:
              </h4>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm sm:text-md text-text">
                {product.features.map((feat, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-whatsapp text-primary flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-3 h-3 text-primary stroke-[3]" />
                    </span>
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* أزرار الشراء والإضافة للسلة */}
          <div className="hidden sm:flex flex-row items-stretch gap-2 sm:gap-3 pt-2">
            {/* زر الطلب المباشر - ينزل مباشرة للفورم */}
            <button
              type="button"
              onClick={scrollToOrderForm}
              className="flex-1 h-13 sm:h-14 rounded-xl bg-primary text-background hover:bg-primary-hover active:scale-[0.99] font-alexandria font-bold text-base sm:text-lg transition-all duration-200 shadow-lg shadow-primary/25 sm:flex hidden items-center justify-center gap-2 cursor-pointer"
            >
              {product.inStock ? <span>اطلب الآن</span> : <span>تواصل معنا لطلب خاص</span>}
              <ArrowDown className="w-5 h-5" />
            </button>

            {/* زر الإضافة إلى السلة */}
            <div className={`h-14 w-14 flex items-center justify-center rounded-full 
              transition-all duration-200 cursor-pointer
              ${isInCart ? "bg-background text-primary hover:text-primary-hover hover:bg-background" : "bg-primary text-background hover:bg-primary-hover active:bg-primary-hover active:text-background"}`}
              onClick={() => {
                if (!isInCart) {
                  addToCart(currentProduct); 
                  toast.success("تمت إضافة المنتج إلى السلة");
                } else {
                  removeFromCart(currentProduct); 
                  toast.error("تمت إزالة المنتج من السلة");
                }
              }}
            >
              <ShoppingCart className='size-4 sm:size-6' />
            </div> 
          </div>

          {/* شارات الضمان والخدمة */}
          <div className="hidden sm:flex justify-center items-center w-full gap-3 pt-4 border-t border-border">
            <div className="flex flex-col items-center text-center p-3 rounded-xl bg-background border border-border/50">
              <Truck className="w-5 h-5 text-primary mb-1" />
              <span className="text-xs font-bold text-primary">توصيل سريع</span>
              <span className="text-[10px] text-text-muted">لكل الولايات</span>
            </div>

            <div className="flex flex-col items-center text-center p-3 rounded-xl bg-background border border-border/50">
              <ShieldCheck className="w-5 h-5 text-primary mb-1" />
              <span className="text-xs font-bold text-primary">دفع عند الاستلام</span>
              <span className="text-[10px] text-text-muted">بعد المعاينة</span>
            </div>
          </div>
        </div>
      </div>

      {/* قسم استمارة الطلب (FormeSection) مباشرة أسفل المنتج */}
     { product.inStock && <FormeSection 
        product={currentProduct} 
        quantity={quantity} 
        onQuantityChange={setQuantity}
        selectedOption={selectedOption}
        onOptionChange={setSelectedOption}
      />
       }

      {/* main section of product (Mobile) */}
      <div className="block sm:hidden grid grid-cols-1 lg:grid-cols-12 mt-10 gap-8 lg:gap-12 items-start">
        <div className="lg:col-span-6 flex flex-col gap-7">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs font-bold text-whatsapp">
              {product.inStock ? <span className="flex items-center gap-1">
                <PackageCheck className="w-4 h-4 text-whatsapp" />
                متوفر في المخزون
              </span> : <span className="flex items-center gap-1 text-red">
                <PackageX className="w-4 h-4 text-red" />
                غير متوفر في المخزون
              </span>}
            </div>
          </div>

          {/* عنوان المنتج */}
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold font-alexandria text-primary leading-tight">
            {product?.name}
          </h1>

          {/* قسم الأسعار */}
          <div className="p-4 sm:p-5 rounded-2xl bg-background border border-border/70 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-baseline gap-3">
              <span className="text-3xl sm:text-4xl font-extrabold font-alexandria text-primary">
                {currentPrice} دج
              </span>
              {currentOldPrice !== 0 && currentOldPrice > currentPrice && (
                <span className="text-lg sm:text-xl text-text-muted line-through">
                  {currentOldPrice} دج
                </span>
              )}
            </div>

            {discountPercent > 0 && (
              <span className="px-3 py-1.5 rounded-xl bg-red/10 text-red font-bold text-sm border border-red/20">
                وفرت {currentOldPrice - currentPrice} دج
              </span>
            )}
          </div>

          {/* قسم اختيار الخيارات / المقاسات (Mobile) */}
          {productOptions.length > 0 && (
            <div className="space-y-3 p-4 rounded-2xl bg-background border border-border/80">
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm font-bold font-alexandria text-primary flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-primary" />
                  <span>الخيارات المتاحة / المقاس:</span>
                </span>
                {selectedOption && (
                  <span className="text-xs font-semibold font-alexandria text-primary bg-primary/10 px-2.5 py-1 rounded-lg border border-primary/20 truncate max-w-[170px]">
                    المحدد: {selectedOption}
                  </span>
                )}
              </div>

              <div className="flex flex-wrap gap-2">
                {productOptions.map((opt, idx) => {
                  const optName = typeof opt === "object" ? (opt.name || opt.label) : String(opt);
                  const optPrice = typeof opt === "object" ? opt.price : null;
                  const isSelected = selectedOption === optName;

                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSelectedOption(optName)}
                      className={`relative flex items-center gap-2 px-3 py-2 rounded-xl border-2 transition-all duration-200 cursor-pointer text-xs font-alexandria font-semibold select-none ${
                        isSelected
                          ? "border-primary bg-primary text-background shadow-md shadow-primary/20 scale-[1.02]"
                          : "border-border bg-background text-text hover:border-primary/50"
                      }`}
                    >
                      <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center transition-all ${
                        isSelected ? "border-background bg-background text-primary" : "border-border"
                      }`}>
                        {isSelected && <Check className="w-2.5 h-2.5 stroke-[3] text-primary" />}
                      </div>
                      <span>{optName}</span>
                      {optPrice && (
                        <span className={`text-[10px] px-1 py-0.5 rounded font-bold ${
                          isSelected ? "bg-background/20 text-background" : "bg-primary/10 text-primary"
                        }`}>
                          {optPrice} دج
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* وصف مختصر للمنتج */}
          <div className="text-sm sm:text-base text-text-muted leading-relaxed font-cairo">
            <p>{product?.description}</p>
          </div>

          {/* المميزات السريعة */}
          {product?.features && product.features.length > 0 && (
            <div className="space-y-2 py-2">
              <h4 className="text-sm font-bold font-alexandria text-primary">
                أبرز المميزات:
              </h4>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm sm:text-md text-text">
                {product.features.map((feat, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-whatsapp text-primary flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-3 h-3 text-primary stroke-[3]" />
                    </span>
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* أزرار الشراء والإضافة للسلة */}
          <div className="flex flex-row items-stretch gap-2 sm:gap-3 pt-2">
            {/* زر الطلب المباشر */}
          
            <button
              type="button"
              onClick={scrollToOrderForm}
              className="flex-1 h-13 sm:h-14 rounded-xl bg-primary text-background hover:bg-primary-hover active:scale-[0.99] font-alexandria font-bold text-base sm:text-lg transition-all duration-200 shadow-lg shadow-primary/25 flex items-center justify-center gap-2 cursor-pointer"
            >
              {product.inStock ? <span>اطلب الآن</span> : <span>تواصل معنا لطلب خاص</span>}

              <ArrowUp className="w-5 h-5" />
            </button>

            {/* زر الإضافة إلى السلة */}
            <div className={`h-14 w-14 flex items-center justify-center rounded-full 
              transition-all duration-200 cursor-pointer
              ${isInCart ? "bg-background text-primary hover:text-primary-hover hover:bg-background" : "bg-primary text-background hover:bg-primary-hover active:bg-primary-hover active:text-background"}`}
              onClick={() => {
                if (!isInCart) {
                  addToCart(currentProduct); 
                  toast.success("تمت إضافة المنتج إلى السلة");
                } else {
                  removeFromCart(currentProduct); 
                  toast.error("تمت إزالة المنتج من السلة");
                }
              }}
            >
              <ShoppingCart className='size-4 sm:size-6' />
            </div> 
          </div>

          {/* شارات الضمان والخدمة */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-border">
            <div className="flex flex-col items-center text-center p-3 rounded-xl bg-background border border-border/50">
              <Truck className="w-5 h-5 text-primary mb-1" />
              <span className="text-xs font-bold text-primary">توصيل سريع</span>
              <span className="text-[10px] text-text-muted">لكل الولايات</span>
            </div>

            <div className="flex flex-col items-center text-center p-3 rounded-xl bg-background border border-border/50">
              <ShieldCheck className="w-5 h-5 text-primary mb-1" />
              <span className="text-xs font-bold text-primary">دفع عند الاستلام</span>
              <span className="text-[10px] text-text-muted">بعد المعاينة</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

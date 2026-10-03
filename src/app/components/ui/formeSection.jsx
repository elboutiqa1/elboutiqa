"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { 
  User, 
  Phone, 
  MapPin, 
  Building2, 
  FileText, 
  Truck, 
  ShieldCheck, 
  CheckCircle2, 
  ShoppingBag,
  Sparkles,
  ArrowRight,
  SlidersHorizontal
} from "lucide-react";
import { toast } from "sonner";
import { useShop } from "@/Context/ShopContext";

import deliveryRatesData from '@/app/assets/tarifs_livraison_ecom_delivery.json';
import communesData from '@/app/assets/communes.json';

const WILAYA_AR_NAMES = {
  1: 'أدرار',
  2: 'الشلف',
  3: 'الأغواط',
  4: 'أم البواقي',
  5: 'باتنة',
  6: 'بجاية',
  7: 'بسكرة',
  8: 'بشار',
  9: 'البليدة',
  10: 'البويرة',
  11: 'تمنراست',
  12: 'تبسة',
  13: 'تلمسان',
  14: 'تيارت',
  15: 'تيزي وزو',
  16: 'الجزائر',
  17: 'الجلفة',
  18: 'جيجل',
  19: 'سطيف',
  20: 'سعيدة',
  21: 'سكيكدة',
  22: 'سيدي بلعباس',
  23: 'عنابة',
  24: 'قالمة',
  25: 'قسنطينة',
  26: 'المدية',
  27: 'مستغانم',
  28: 'المسيلة',
  29: 'معسكر',
  30: 'ورقلة',
  31: 'وهران',
  32: 'البيض',
  33: 'إليزي',
  34: 'برج بوعريريج',
  35: 'بومرداس',
  36: 'الطارف',
  37: 'تندوف',
  38: 'تيسمسيلت',
  39: 'الوادي',
  40: 'خنشلة',
  41: 'سوق أهراس',
  42: 'تيبازة',
  43: 'ميلة',
  44: 'عين الدفلى',
  45: 'النعامة',
  46: 'عين تموشنت',
  47: 'غرداية',
  48: 'غليزان',
  49: 'تيميمون',
  50: 'برج باجي مختار',
  51: 'أولاد جلال',
  52: 'بني عباس',
  53: 'عين صالح',
  54: 'عين قزام',
  55: 'تقرت',
  56: 'جانت',
  57: 'المغير',
  58: 'المنيعة',
};

const DELIVERY_WILAYAS = deliveryRatesData.tarifs.map((t) => ({
  code: String(t.code),
  name: t.wilaya,
  ar_name: WILAYA_AR_NAMES[t.code] || t.wilaya,
  domicile: t.domicile,
  stop_desk: t.stop_desk,
}));

export default function FormeSection({ 
  product, 
  quantity = 1, 
  onQuantityChange,
  totalPrice = 0,
  selectedOption = "",
  onOptionChange,
}) {
  const shop = useShop();
  const cart = shop?.cart || [];

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [wilayaCode, setWilayaCode] = useState("");
  const [commune, setCommune] = useState("");
  const [customCommune, setCustomCommune] = useState("");
  const [address, setAddress] = useState("");
  const [note, setNote] = useState("");
  const [deliveryType, setDeliveryType] = useState("home"); // 'home' | 'desk'
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Extract available options if any
  const productOptions = (product?.options && product.options.length > 0)
    ? product.options
    : (product?.sizes && product.sizes.length > 0)
      ? product.sizes
      : (product?.variants && product.variants.length > 0)
        ? product.variants
        : (product?.colors && product.colors.length > 0)
          ? product.colors
          : [];

  // Communes list for the selected wilaya
  const availableCommunes = useMemo(() => {
    if (!wilayaCode) return [];
    return communesData[wilayaCode] || [];
  }, [wilayaCode]);

  // Selected Wilaya Object (contains delivery prices)
  const selectedWilayaObj = useMemo(() => {
    return DELIVERY_WILAYAS.find((w) => w.code === wilayaCode);
  }, [wilayaCode]);

  const productPrice = product?.price || 0;

  const itemsTotal = product 
    ? productPrice * quantity 
    : (totalPrice || cart.reduce((sum, item) => sum + item.price * item.quantity, 0));

  const shippingFee = selectedWilayaObj
    ? deliveryType === 'desk'
      ? selectedWilayaObj.stop_desk
      : selectedWilayaObj.domicile
    : 0;

  const grandTotal = itemsTotal + shippingFee;

  const handleWilayaChange = (e) => {
    const code = e.target.value;
    setWilayaCode(code);
    setCommune("");
    setCustomCommune("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!fullName.trim() || fullName.trim().length < 3) {
      toast.error("يرجى إدخال الاسم واللقب بشكل صحيح (3 أحرف على الأقل)");
      return;
    }

    const cleanPhone = phone.replace(/\s+/g, '');
    const phoneRegex = /^(05|06|07|02)[0-9]{8}$/;
    if (!phoneRegex.test(cleanPhone)) {
      toast.error("يرجى إدخال رقم هاتف جزائري صحيح (05/06/07/02)");
      return;
    }

    if (!wilayaCode) {
      toast.error("يرجى اختيار الولاية");
      return;
    }

    const finalCommune = commune === 'custom' ? customCommune.trim() : commune.trim();
    if (!finalCommune) {
      toast.error("يرجى اختيار أو كتابة البلدية / المدينة");
      return;
    }

    setIsSubmitting(true);

    const wilayaDisplay = selectedWilayaObj
      ? `${selectedWilayaObj.ar_name} (${selectedWilayaObj.code})`
      : wilayaCode;

    const deliveryTypeLabel = deliveryType === 'home'
      ? 'توصيل لباب المنزل'
      : 'استلام من مكتب التوصيل';

    try {
      const response = await fetch('/api/order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fullName: fullName.trim(),
          phone: cleanPhone,
          wilayaDisplay,
          commune: finalCommune,
          deliveryTypeLabel,
          shippingFee,
          grandTotal,
          address: address.trim(),
          note: note.trim(),
          product,
          cart,
          quantity,
          selectedOption: selectedOption || '',
          options: selectedOption || '',
          الخيارات: selectedOption || '',
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (response.ok && data.success) {
        setIsSubmitted(true);
        toast.success("تم استلام طلبك بنجاح! سنتصل بك قريباً لتأكيد الإرسال.");

        // Meta Pixel - Purchase
        if (typeof window !== "undefined" && window.fbq) {
          window.fbq('track', 'Purchase', {
            value: Number(grandTotal),
            currency: 'DZD',
            content_name: product?.name || 'Order',
          });
        }
      } else {
        const errorMsg = data.error || 'حدث خطأ أثناء إرسال الطلب، يرجى المحاولة مرة أخرى.';
        console.error('Order API Error:', errorMsg);
        toast.error(errorMsg);
      }
    } catch (error) {
      console.error('Order Request Error:', error);
      toast.error('تعذر الاتصال بالخادم، يرجى التحقق من اتصال الإنترنت.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setIsSubmitted(false);
    setFullName("");
    setPhone("");
    setWilayaCode("");
    setCommune("");
    setCustomCommune("");
    setAddress("");
    setNote("");
    setDeliveryType("home");
  };

  return (
    <div id="order-form-section" className="w-full max-w-4xl mx-auto mt-12 sm:mt-16 px-3 sm:px-0">
      <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl border border-border bg-background shadow-xl">
        {/* شريط علوي مميز */}
        <div className="bg-primary text-background px-4 sm:px-8 py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-background text-primary flex items-center justify-center font-bold shadow-md">
              <ShoppingBag className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl  font-bold font-alexandria text-background">
                استمارة الطلب السريع
              </h2>
              <p className="text-xs sm:text-sm text-background/80 font-cairo">
                الدفع عند الاستلام 100%   
              </p>
            </div>
          </div>
        </div>

        {isSubmitted ? (
          <div className="p-8 sm:p-12 text-center flex flex-col items-center justify-center gap-4 bg-background/40">
            <div className="w-16 h-16 rounded-full bg-whatsapp/10 text-whatsapp flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-bold font-alexandria text-primary-hover">
              شكراً لثقتكم بنا! تم تسجيل طلبك بنجاح
            </h3>
            <p className="text-text-muted max-w-md text-sm sm:text-base">
              سيتصل بك فريق خدمة العملاء خلال ساعات قليلة لتأكيد العنوان وموعد تسليم الطلبية.
            </p>
            <div className="p-4 rounded-xl bg-background border border-border w-full max-w-md text-right text-sm space-y-1.5">
              {product ? (
                <>
                  <p><span className="text-text-muted">المنتج:</span> <strong className="text-primary">{product?.name}</strong></p>
                  {selectedOption && (
                    <p><span className="text-text-muted">الخيارات:</span> <strong className="text-primary">{selectedOption}</strong></p>
                  )}
                  <p><span className="text-text-muted">الكمية:</span> <strong>{quantity}</strong></p>
                </>
              ) : (
                <p><span className="text-text-muted">عدد المنتجات:</span> <strong>{cart.reduce((s, i) => s + i.quantity, 0)}</strong></p>
              )}
              <p><span className="text-text-muted">المبلغ الإجمالي مع التوصيل:</span> <strong className="text-primary">{grandTotal.toLocaleString()} دج</strong></p>
            </div>
            <button
              onClick={handleReset}
              className="mt-2 inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary text-background font-bold hover:bg-primary-hover transition-colors text-sm cursor-pointer"
            >
              طلب منتج آخر <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 sm:p-8 space-y-6">
            {/* ملخص المنتج المصغر في الفورم */}
            {product && (
              <div className="p-3.5 sm:p-4 rounded-xl bg-background border border-border space-y-3">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    {product.img && (
                      <Image 
                        src={product.img} 
                        alt={product.name} 
                        width={64}
                        height={64}
                        className="w-14 h-14 sm:w-16 sm:h-16 object-cover rounded-lg border border-border bg-background"
                      />
                    )}
                    <div>
                      <h4 className="font-alexandria font-bold text-sm sm:text-base text-primary-hover line-clamp-1">
                        {product.name}
                      </h4>
                      <div className="flex flex-wrap items-center gap-2 mt-0.5">
                        <p className="text-primary font-bold text-sm sm:text-base">
                          {product.price} دج
                        </p>
                        {selectedOption && (
                          <span className="text-xs font-semibold font-alexandria bg-primary/10 text-primary px-2 py-0.5 rounded-md border border-primary/20">
                            الخيار: {selectedOption}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* تحكم في الكمية داخل الفورم */}
                  {onQuantityChange && (
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-text-muted hidden sm:inline">الكمية:</span>
                      <div className="flex items-center border border-border rounded-lg bg-background overflow-hidden">
                        <button
                          type="button"
                          onClick={() => onQuantityChange(Math.max(1, quantity - 1))}
                          className="px-2.5 py-1 text-primary-hover hover:bg-border/60 transition-colors font-bold cursor-pointer"
                        >
                          -
                        </button>
                        <span className="px-3 py-1 font-bold text-sm text-primary min-w-[28px] text-center">
                          {quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => onQuantityChange(quantity + 1)}
                          className="px-2.5 py-1 text-primary-hover hover:bg-border/60 transition-colors font-bold cursor-pointer"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* خيارات المنتج السريعة داخل الفورم */}
                {productOptions.length > 0 && onOptionChange && (
                  <div className="pt-2.5 border-t border-border/60 flex flex-col sm:flex-row sm:items-center gap-2">
                    <span className="text-xs font-bold text-primary flex items-center gap-1 shrink-0">
                      <SlidersHorizontal className="w-3.5 h-3.5 text-primary" />
                      <span>الخيارات / المقاس:</span>
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {productOptions.map((opt, idx) => {
                        const optName = typeof opt === "object" ? (opt.name || opt.label) : String(opt);
                        const isSelected = selectedOption === optName;
                        return (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => onOptionChange(optName)}
                            className={`px-2.5 py-1 rounded-lg border text-xs font-semibold transition-all cursor-pointer ${
                              isSelected 
                                ? "border-primary bg-primary text-background shadow-xs font-bold"
                                : "border-border bg-background text-text hover:border-primary/50"
                            }`}
                          >
                            {optName}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* حقول الإدخال */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
              {/* الاسم الكامل */}
              <div className="space-y-2">
                <label className="text-xs sm:text-sm font-bold text-primary flex items-center gap-1.5">
                  <User className="w-4 h-4 text-text-muted" />
                  <span>الاسم الكامل</span>
                  <span className="text-red">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="مثال: محمد بن علي"
                    className="w-full h-11 sm:h-12 px-3.5 sm:px-4 rounded-xl border border-border bg-background text-text focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all text-sm"
                  />
                </div>
              </div>

              {/* رقم الهاتف */}
              <div className="space-y-2">
                <label className="text-xs sm:text-sm font-bold text-primary flex items-center gap-1.5">
                  <Phone className="w-4 h-4 text-text-muted" />
                  <span>رقم الهاتف</span>
                  <span className="text-red">*</span>
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    required
                    dir="ltr"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="06 XX XX XX XX / 05 / 07"
                    className="w-full h-11 sm:h-12 px-3.5 sm:px-4 rounded-xl border border-border bg-background text-text focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all text-sm text-right placeholder:text-right"
                  />
                </div>
              </div>

              {/* الولاية */}
              <div className="space-y-2">
                <label className="text-xs sm:text-sm font-bold text-primary flex items-center gap-1.5">
                  <Building2 className="w-4 h-4 text-text-muted" />
                  <span>الولاية</span>
                  <span className="text-red">*</span>
                </label>
                <div className="relative">
                  <select
                    value={wilayaCode}
                    onChange={handleWilayaChange}
                    className="w-full h-11 sm:h-12 px-3.5 sm:px-4 rounded-xl border border-border bg-background text-text focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all text-sm cursor-pointer appearance-none"
                  >
                    <option value="">-- إختر الولاية (58 ولاية متاحة) --</option>
                    {DELIVERY_WILAYAS.map((w) => (
                      <option key={w.code} value={w.code}>
                        {w.code} - {w.ar_name} ({w.name})
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-text-muted text-xs">
                    ▼
                  </div>
                </div>
              </div>

              {/* البلدية */}
              <div className="space-y-2">
                <label className="text-xs sm:text-sm font-bold text-primary flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-text-muted" />
                  <span>البلدية / المدينة</span>
                  <span className="text-red">*</span>
                </label>
                <div className="relative">
                  {availableCommunes.length > 0 ? (
                    <select
                      value={commune}
                      onChange={(e) => setCommune(e.target.value)}
                      disabled={!wilayaCode}
                      className="w-full h-11 sm:h-12 px-3.5 sm:px-4 rounded-xl border border-border bg-background text-text focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all text-sm cursor-pointer appearance-none disabled:opacity-50"
                    >
                      <option value="">-- إختر البلدية --</option>
                      {availableCommunes.map((c, i) => (
                        <option key={i} value={c}>
                          {c}
                        </option>
                      ))}
                      <option value="custom">بلدية أخرى (كتابة يدوية)</option>
                    </select>
                  ) : (
                    <input
                      type="text"
                      value={commune}
                      onChange={(e) => setCommune(e.target.value)}
                      disabled={!wilayaCode}
                      placeholder="أدخل اسم البلدية أو الدائرة"
                      className="w-full h-11 sm:h-12 px-3.5 sm:px-4 rounded-xl border border-border bg-background text-text focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all text-sm disabled:opacity-50"
                    />
                  )}
                  {availableCommunes.length > 0 && (
                    <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-text-muted text-xs">
                      ▼
                    </div>
                  )}
                </div>

                {/* حقل كتابة يدوية للبلدية */}
                {commune === 'custom' && (
                  <input
                    type="text"
                    value={customCommune}
                    onChange={(e) => setCustomCommune(e.target.value)}
                    placeholder="أكتب اسم بلديتك هنا..."
                    className="w-full h-11 sm:h-12 px-3.5 sm:px-4 rounded-xl border border-primary/30 bg-background text-text focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all text-sm"
                  />
                )}
              </div>

              {/* نوع التوصيل */}
              <div className="space-y-2 sm:col-span-2">
                <label className="text-xs sm:text-sm font-bold text-primary flex items-center gap-1.5">
                  <Truck className="w-4 h-4 text-text-muted" />
                  <span>نوع الاستلام والتوصيل</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* توصيل للمنزل */}
                  <div
                    onClick={() => setDeliveryType('home')}
                    className={`cursor-pointer rounded-xl p-3.5 border-2 transition-all flex items-center gap-3 select-none ${
                      deliveryType === 'home'
                        ? 'bg-background border-primary shadow-md'
                        : 'bg-background border-border hover:border-primary/40'
                    }`}
                  >
                    <Truck className={`w-5 h-5 shrink-0 ${deliveryType === 'home' ? 'text-primary' : 'text-text-muted'}`} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <span className={`font-bold text-xs sm:text-sm truncate ${deliveryType === 'home' ? 'text-primary' : 'text-text-muted'}`}>
                          توصيل إلى باب المنزل
                        </span>
                        {selectedWilayaObj ? (
                          <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded border border-primary/20 shrink-0">
                            {selectedWilayaObj.domicile.toLocaleString()} دج
                          </span>
                        ) : (
                          <span className="text-[10px] text-text-muted bg-border/40 px-1.5 py-0.5 rounded shrink-0">
                            حسب الولاية
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-text-muted truncate">
                        يسلمك عامل التوصيل الطرد في عنوانك
                      </div>
                    </div>
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${deliveryType === 'home' ? 'border-primary bg-primary' : 'border-border'}`}>
                      {deliveryType === 'home' && <div className="w-1.5 h-1.5 rounded-full bg-background" />}
                    </div>
                  </div>

                  {/* استلام من المكتب */}
                  <div
                    onClick={() => setDeliveryType('desk')}
                    className={`cursor-pointer rounded-xl p-3.5 border-2 transition-all flex items-center gap-3 select-none ${
                      deliveryType === 'desk'
                        ? 'bg-background border-primary shadow-md'
                        : 'bg-background border-border hover:border-primary/40'
                    }`}
                  >
                    <Building2 className={`w-5 h-5 shrink-0 ${deliveryType === 'desk' ? 'text-primary' : 'text-text-muted'}`} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <span className={`font-bold text-xs sm:text-sm truncate ${deliveryType === 'desk' ? 'text-primary' : 'text-text-muted'}`}>
                          استلام من مكتب التوصيل
                        </span>
                        {selectedWilayaObj ? (
                          <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded border border-primary/20 shrink-0">
                            {selectedWilayaObj.stop_desk.toLocaleString()} دج
                          </span>
                        ) : (
                          <span className="text-[10px] text-text-muted bg-border/40 px-1.5 py-0.5 rounded shrink-0">
                            حسب الولاية
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-text-muted truncate">
                        تستلم بنفسك من أقرب مكتب في بلديتك
                      </div>
                    </div>
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${deliveryType === 'desk' ? 'border-primary bg-primary' : 'border-border'}`}>
                      {deliveryType === 'desk' && <div className="w-1.5 h-1.5 rounded-full bg-background" />}
                    </div>
                  </div>
                </div>
              </div>

              {/* العنوان بالتفصيل */}
              <div className="space-y-2 sm:col-span-2">
                <label className="text-xs sm:text-sm font-bold text-primary flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-text-muted" />
                  <span>العنوان بالتفصيل</span>
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="اسم الشارع أو الحي، رقم العمارة أو المنزل..."
                  className="w-full h-11 sm:h-12 px-3.5 sm:px-4 rounded-xl border border-border bg-background text-text focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all text-sm"
                />
              </div>

              {/* ملاحظة إضافية */}
              <div className="space-y-2 sm:col-span-2">
                <label className="text-xs sm:text-sm font-bold text-primary flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-text-muted" />
                  <span>ملاحظة إضافية (اختياري)</span>
                </label>
                <textarea
                  rows={3}
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="أي تعليمات تفضلها بخصوص التوصيل أو وقت الاتصال..."
                  className="w-full p-3 sm:p-3.5 rounded-xl border border-border bg-background text-text focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all text-sm resize-none"
                />
              </div>
            </div>

            {/* تفاصيل الأسعار والسعر الإجمالي */}
            <div className="p-4 sm:p-5 rounded-2xl bg-background border border-border/80 space-y-3">
              <h3 className="font-alexandria font-bold text-base text-primary-hover pb-2 border-b border-border flex items-center justify-between">
                <span>ملخص التكلفة</span>
              </h3>

              <div className="space-y-2 text-sm">

              {totalPrice !==0 &&
                <div className="flex items-center justify-between text-text-muted">
                  <span>سعر المنتجات :</span>
                  <span className="font-semibold text-text">{totalPrice} دج</span>
                 
                </div>
               }

               {totalPrice ===0 &&
                <div className="flex items-center justify-between text-text-muted">
                  <span>سعر المنتجات ({quantity} {quantity > 1 ? 'قطع' : 'قطعة'}):</span>
                  <span className="font-semibold text-text">{itemsTotal} دج</span>
                 
                </div>
               }
                <div className="flex items-center justify-between text-text-muted">
                  <span className="flex items-center gap-1.5">
                    <Truck className="w-4 h-4 text-primary" />
                    <span>سعر التوصيل:</span>
                  </span>
                  {selectedWilayaObj ? (
                    <span className="font-semibold text-primary">
                      {shippingFee.toLocaleString()} دج
                      <span className="text-xs text-text-muted mr-1">
                        ({deliveryType === 'home' ? 'للمنزل' : 'من المكتب'})
                      </span>
                    </span>
                  ) : (
                    <span className="text-xs text-text-muted">
                      يُحدد بعد اختيار الولاية
                    </span>
                  )}
                </div>

                <div className="pt-2 border-t border-border flex items-center justify-between">
                  <span className="text-base sm:text-lg font-bold font-alexandria text-primary-hover">
                    السعر الإجمالي:
                  </span>
                  <span className="text-xl sm:text-2xl font-extrabold font-alexandria text-primary">
                    {grandTotal} دج
                  </span>
                </div>
              </div>
            </div>

            {/* زر تأكيد الطلب */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-12 sm:h-14 rounded-xl bg-primary text-background hover:bg-primary-hover active:scale-[0.99] font-alexandria font-bold text-base sm:text-lg transition-all duration-200 shadow-lg shadow-primary/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 border-2 border-background border-t-transparent rounded-full animate-spin"></span>
                  <span>جاري تسجيل الطلب...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-3">
                  <ShieldCheck className="w-7 h-7 text-background" />
                  <span>تأكيد الطلب الآن</span>
                </div>
              )}
            </button>

            {/* شارات الثقة */}
            <div className="flex justify-center items-center gap-3 pt-2 text-center  text-xs text-text-muted">
              <div className="flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-background">
                <Truck className="w-4 h-4 text-primary" />
                <span>توصيل سريع لباب المنزل</span>
              </div>
              <div className="flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-background">
                <ShieldCheck className="w-4 h-4 text-primary" />
                <span>الدفع بعد الاستلام والمعاينة</span>
              </div>
            
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

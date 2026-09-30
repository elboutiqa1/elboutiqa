

import e1 from "@/app/assets/products/e1.png"
import e2 from "@/app/assets/products/e2.png"
import e3 from "@/app/assets/products/e3.png"
import e4 from "@/app/assets/products/e4.jpeg"


import w1 from "@/app/assets/products/w1.jpeg"
import w2 from "@/app/assets/products/w2.jpeg"
import w3 from "@/app/assets/products/w3.jpeg"


import h11 from "@/app/assets/products/h11.png"
import h6 from "@/app/assets/products/h6.png"

export const productsItems = [
  {
    id: 1,
    name: "Imprimante Ticket de Caisse Thermique Xprinter XP-C260M – USB + LAN",
    description: "طابعة التذاكر الحرارية Xprinter XP-C260M، حل عملي وفعال لطباعة تذاكر البيع، الفواتير والطلبات بسرعة وجودة واضحة. مناسبة للمحلات، المطاعم، المقاهي ومختلف نقاط البيع.",
    price: 15900,
    oldPrice: 0,
    img: e4,
    images: [e1, e2, e3, e4],
    category: "Electronique",
    inStock: true,
    features: [
      "طباعة حرارية مباشرة بدون حبر",
      "سرعة طباعة عالية",
      "تدعم ورق حراري بعرض 80 مم",
      "الاتصال عبر USB",
      "الاتصال عبر LAN / Ethernet",
      "منفذ خاص بـ Cash Drawer",
      "قاطع تلقائي للورق",
      "دعم طباعة الباركود وQR Code",
      "مناسبة لأنظمة نقاط البيع والفوترة",
      "تنبيه صوتي أثناء التشغيل والطباعة",
      "مناسبة للاستعمال في المحلات والمطاعم والمقاهي"
    ]
  },
  {
    id: 2,
    name: "Air Mouse Télécommande avec Clavier QWERTY Intégré",
    description:  "ريموت كنترول ذكي مع لوحة مفاتيح QWERTY مدمجة، يجمع بين وظائف جهاز التحكم عن بعد ولوحة المفاتيح في جهاز واحد، لتسهيل التحكم في التلفاز الذكي، أجهزة Android TV وTV Box والأجهزة المتوافقة.",
    price: 1900,
    oldPrice: 0,
    img: w1,
    images: [w1, w2, w3],
    category: "Electronique",
    inStock: true,
    features: [
      "جهاز تحكم عن بعد عملي وسهل الاستخدام",
      "لوحة مفاتيح QWERTY مدمجة",
      "وظيفة Air Mouse للتحكم بالمؤشر",
      "أزرار مخصصة للتحكم في الوسائط",
      "أزرار للتنقل والتحكم داخل القوائم",
      "مناسب لأجهزة Smart TV وAndroid TV وTV Box المتوافقة",
      "تصميم مدمج ومريح للاستعمال اليومي"
    ]
  },
  {
    id: 3,
    name: "Adaptateur + Hub USB-C 11-en-1",
    description: "محول USB-C متعدد الوظائف TC429، يوفر لك مجموعة من المنافذ في جهاز واحد، ويسمح بتوسيع إمكانيات الحاسوب المحمول أو الجهاز المتوافق مع USB-C بسهولة.",
    price: 7400,
    oldPrice: 0,
    img: h11,
    images: [h11],
    category: "Hub",
    inStock: true,
    features: [
      "3 منافذ USB 3.2 بسرعة تصل إلى 10Gbps",
      "منفذ HDMI 4K@60Hz",
      "منفذ DisplayPort",
      "منفذ VGA",
      "منفذ RJ45 Gigabit Ethernet 1000Mbps",
      "قارئ بطاقات SD",
      "قارئ بطاقات TF / microSD",
      "منفذ USB-C Power Delivery حتى 100W",
      "منفذ Audio 3.5mm",
      "منفذ USB-C Data",
      "تصميم عملي ومناسب للعمل والدراسة والاستعمال الاحترافي",
      "التوافق: أجهزة الكمبيوتر المحمولة والأجهزة اللوحية وغيرها من الأجهزة التي تدعم USB-C مع الوظائف المطلوبة"
    ]
  },
  {
    id: 4,
    name: "Adaptateur + Hub USB-C 6-en-1",
    description: "محول USB-C متعدد الوظائف TC428، يوفر لك 6 منافذ في جهاز واحد لتوسيع إمكانيات الحاسوب المحمول والأجهزة المتوافقة مع USB-C.",
    price: 5200,
    oldPrice: 0,
    img: h6,
    images: [h6],
    category: "Hub",
    inStock: true,
    features: [
      "3 منافذ USB 3.2 لنقل البيانات بسرعة عالية",
      "منفذ HDMI واحد يدعم دقة تصل إلى 4K@60Hz",
      "منفذ RJ45 Gigabit Ethernet بسرعة تصل إلى 1000Mbps",
      "منفذ USB-C PD للشحن",
      "اتصال عبر USB-C",
      "تصميم مدمج وخفيف وسهل الحمل",
      "مناسب للعمل، الدراسة والاستعمال اليومي",
      "التوافق: أجهزة الكمبيوتر المحمولة والأجهزة اللوحية وغيرها من الأجهزة التي تدعم USB-C والوظائف المطلوبة"
    ]
  }
];

export function getProductById(id) {
  if (!id) return productsItems[0];
  const found = productsItems.find((p) => String(p.id) === String(id));
  return found || productsItems[0];
}

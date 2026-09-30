import img1 from "@/app/assets/products/1.jpg";
import img2 from "@/app/assets/products/2.jpg";
import img3 from "@/app/assets/products/3.jpg";
import img4 from "@/app/assets/products/4.jpg";
import img5 from "@/app/assets/products/5.jpg";
import img6 from "@/app/assets/products/6.jpg";
import img7 from "@/app/assets/products/7.jpg";
import img8 from "@/app/assets/products/8.webp";

export const productsItems = [
  {
    id: 1,
    name: "Adaptateur HDMI , RJ45, USB 3.0, SD/TF",
    description: "Docking Station USB Hub متعدد الوظائف ✨ كلشي فـ Hub واحد لتحسين تجربة جهازك! HDMI Input، منفذ RJ45 (100Mb) للأنترنت الثابت، قارئ بطاقات SD/TF، و 2 منافذ Type-C. مثالي للـ Laptop، PC، وحتى بعض الهواتف. عملي فالدار، الخدمة، ولا حتى في السفر.",
    price: 25000,
    oldPrice: 29000,
    img: img1,
    images: [img1, img2, img4, img8],
    rating: 4.9,
    reviewsCount: 38,
    category: "Hub",
    inStock: true,
    features: [
      "منفذ HDMI يدعم 4K عالي الدقة",
      "منفذ RJ45 سريع للاتصال المستقر بالإنترنت",
      "قارئ بطاقات ذاكرة SD و TF فائق السرعة",
      "تصميم من الألمنيوم المتين لتبديد الحرارة بسرعة",
      "متوافق مع MacBook، Windows والأجهزة اللوحية"
    ]
  },
  {
    id: 2,
    name: "Adaptateur 8in2 - SD Card",
    description: "Un seul adaptateur pour tout connecter ! Ce hub 8-en-1 vous permet d’ajouter ports USB 3.0, 2.0, lecteur carte SD/TF, audio jack 3.5mm et USB-C. تصميم أنيق وفعّال بزاف وعملي للغاية لجميع الأجهزة الحديثة.",
    price: 1200,
    oldPrice: 1600,
    img: img2,
    images: [img2, img1, img4],
    rating: 4.8,
    reviewsCount: 24,
    category: "Electronique",
    inStock: true,
    features: [
      "8 منافذ متعددة في جهاز صغير ومحمول",
      "منفذ صوت 3.5mm Aux للسماعات الخارجية",
      "نقل بيانات عالي السرعة حتى 5Gbps عبر USB 3.0",
      "هيكل معدني أنيق ومقاوم للصدمات"
    ]
  },
  {
    id: 3,
    name: "مُبرّد الهاتف المحمول K20",
    description: "حل عملي لتبريد هاتفك المحمول مع مُبرّد K20 الفعّال بتقنية التبريد شبه الموصل مع إضاءة RGB أنيقة، يحافظ على برودة الجهاز أثناء اللعب المكثف.",
    price: 2500,
    oldPrice: 3200,
    img: img3,
    images: [img3, img5, img6],
    rating: 4.7,
    reviewsCount: 19,
    category: "gaming",
    inStock: true,
    features: [
      "تبريد فوري خلال ثوانٍ معدودة",
      "إضاءة RGB ديناميكية مذهلة",
      "صوت هادئ جداً بدون أي تشويش",
      "مشبك تثبيت سيليكوني آمن لا يخدش الهاتف"
    ]
  },
  {
    id: 4,
    name: "Adaptateur HDMI , RJ45, USB 3.0, SD/TF Pro",
    description: "Docking Station USB Hub متعدد الوظائف فائق الأداء. كل ما تحتاجه في قطعة واحدة لتحسين تجربة جهازك سواء للعمل أو الترفيه.",
    price: 2500,
    oldPrice: 3500,
    img: img4,
    images: [img4, img1, img2],
    rating: 4.9,
    reviewsCount: 52,
    category: "hub",
    inStock: true,
    features: [
      "دعم الشحن السريع PD بقوة تصل إلى 100W",
      "مخرج HDMI بدقة 4K@60Hz",
      "منافذ USB 3.0 متعددة",
      "حماية مدمجة ضد ارتفاع الجهد والحرارة"
    ]
  },
  {
    id: 5,
    name: "مُبرّد الهاتف المحمول K20 gaming Edition",
    description: "حل عملي واحترافي لتبريد هاتفك المحمول مع مُبرّد K20 بإصدار خاص للاعبين، قوة مضاعفة وثبات ممتاز.",
    price: 2500,
    oldPrice: 0,
    img: img5,
    images: [img5, img3, img6],
    rating: 4.8,
    reviewsCount: 15,
    category: "Electronique",
    inStock: true,
    features: [
      "مروحة تيربو قوية وسريعة الدوران",
      "شاشة رقمية لعرض درجة حرارة المعالج",
      "وزن خفيف وتصميم مريح لليدين"
    ]
  },
  {
    id: 6,
    name: "مُبرّد الهاتف المحمول K20 Ice Master",
    description: "حافظ على أعلى فريمات وأداء مستقر لهاتفك في ألعابك المفضلة بفضل نظام التبريد المزدوج المتطور.",
    price: 2500,
    oldPrice: 3500,
    img: img6,
    images: [img6, img7, img3],
    rating: 4.9,
    reviewsCount: 41,
    category: "gaming",
    inStock: true,
    features: [
      "لوحة تبريد عريضة تغطي مساحة أكبر من ظهر الهاتف",
      "كفاءة عالية تمنع تقطيع الألعاب وهبوط الإطارات",
      "مناسب لجميع مقاسات الهواتف الذكية"
    ]
  },
  {
    id: 7,
    name: "مُبرّد الهاتف المحمول K20 Silent Fan",
    description: "تبريد قوي بصمت تام وتصميم عصري متوافق مع كافة الهواتف الذكية بنظامي Android و iOS.",
    price: 2500,
    oldPrice: 3000,
    img: img7,
    images: [img7, img5, img6],
    rating: 4.6,
    reviewsCount: 22,
    category: "Electronique",
    inStock: true,
    features: [
      "تشغيل فائق الهدوء",
      "بطارية مدمجة قابلة لإعادة الشحن عبر Type-C",
      "إضاءة ليد زرقاء مريحة للعين"
    ]
  },
  {
    id: 8,
    name: "Adaptateur Multi-Hub USB 3.0 Ultra",
    description: "Docking Station USB Hub متعدد الوظائف خفيف الوزن وعالي الجودة، يسهل حمله في أي حقيبة.",
    price: 2500,
    oldPrice: 3500,
    img: img8,
    images: [img8, img1, img4],
    rating: 4.8,
    reviewsCount: 30,
    category: "Electronique",
    inStock: true,
    features: [
      "منافذ USB فائقة السرعة",
      "حجم مدمج ومناسب للسفر والعمل المتنقل",
      "توصيل فوري Plug & Play بدون تعريفات"
    ]
  }
];

export function getProductById(id) {
  if (!id) return productsItems[0];
  const found = productsItems.find((p) => String(p.id) === String(id));
  return found || productsItems[0];
}

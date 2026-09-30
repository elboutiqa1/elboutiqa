import {
  PackageCheck,
  Truck,
  PhoneCall,
  Check,
} from "lucide-react";

const steps = [
  {
    number: "01",
    icon: PackageCheck,
    title: "أنت تطلب",
    description:
      "اختر المنتج الذي يناسبك وأرسل طلبك بسهولة من خلال الموقع.",
  },
  {
    number: "02",
    icon: Truck,
    title: "نحن نرسل",
    description:
      "نقوم بتجهيز طلبك وإرساله مع شركة التوصيل إلى عنوانك.",
  },
  {
    number: "03",
    icon: PhoneCall,
    title: "نؤكد معك",
    description:
      "سيتواصل معك عامل التوصيل لتأكيد الطلب وتسليمه لك.",
  },
];

export default function HowItWork() {
  return (
    <section
      dir="rtl"
      className="relative overflow-hidden bg-background py-15 sm:py-25"
    >
      {/* Decorative background */}
      <div className="pointer-events-none absolute -right-32 top-20 h-72 w-72 rounded-full bg-secondary/10 blur-3xl" />
      <div className="pointer-events-none absolute top-20 -left-20 h-72 w-72 rounded-full bg-secondary/10 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">

        {/* Header */}
        <div className="mx-auto mb-16 max-w-2xl text-center">


          <h2
            className="
              font-cairo text-3xl font-black
              tracking-tight text-primary
              sm:text-4xl lg:text-5xl
            "
          >
            كيف تمر رحلتك في موقعنا؟
          </h2>

          <p
            className="
              mt-5 font-cairo
             leading-8 text-text-muted
              text-lg sm:text-xl
            "
          >
            ثلاث خطوات بسيطة تفصلك عن استلام طلبك بكل سهولة.
          </p>
        </div>

        {/* Steps */}
        <div className="relative">

          {/* Connecting line */}
          <div
            className="
              absolute right-[16.66%] left-[16.66%]
              top-[48px]
              hidden h-px
              bg-border
              lg:block
            "
          />

          <div className="grid gap-4 md:grid-cols-3 lg:gap-8">

            {steps.map((step) => {
              const Icon = step.icon;

              return (
                <div
                  key={step.number}
                  className="group relative"
                >
                  <div
                    className="
                      relative h-full
                      rounded-3xl
                      border border-border
                      bg-background
                      p-7
                      text-center
                      shadow-sm
                      transition-all duration-300

                      hover:-translate-y-1
                      hover:border-secondary/40
                      hover:shadow-lg
                    "
                  >

                    {/* Icon */}
                    <div className="relative mx-auto mb-7 w-fit">

                      {/* Outer circle */}
                      <div
                        className="
                          flex h-24 w-24
                          items-center justify-center
                          rounded-full
                          border-8 border-secondary/10
                          bg-background
                          shadow-sm
                        "
                      >
                        <div
                          className="
                            flex h-14 w-14
                            items-center justify-center
                            rounded-full
                            bg-secondary
                            text-primary
                            transition-transform duration-300
                            group-hover:scale-110
                          "
                        >
                          <Icon
                            size={25}
                            strokeWidth={2.2}
                          />
                        </div>
                      </div>

                      {/* Number */}
                      <span
                        className="
                          absolute -right-2 -top-2
                          flex h-9 w-9
                          items-center justify-center
                          rounded-full
                          bg-primary
                          text-xs font-black
                          text-white
                          ring-4 ring-background
                        "
                      >
                        {step.number}
                      </span>
                    </div>

                    {/* Title */}
                    <h3
                      className="
                        font-cairo
                        text-xl font-black
                        text-primary
                      "
                    >
                      {step.title}
                    </h3>

                    {/* Description */}
                    <p
                      className="
                        mx-auto mt-3
                        max-w-sm
                        font-cairo
                        text-sm leading-7
                        text-text-muted
                        sm:text-base
                      "
                    >
                      {step.description}
                    </p>
                  </div>
                </div>
              );
            })}

          </div>
        </div>

        {/* Bottom badge */}
        <div className="mt-10 flex justify-center">

          <div
            className="
              inline-flex items-center gap-3
              rounded-full
              border border-border
              bg-background
              px-5 py-3
              font-cairo
              text-sm font-bold
              text-primary
            "
          >
            <span
              className="
                flex h-7 w-7
                items-center justify-center
                rounded-full
                bg-secondary
                text-primary
              "
            >
              <Check size={16} strokeWidth={3} />
            </span>

            الدفع عند الاستلام
          </div>

        </div>
      </div>
    </section>
  );
}
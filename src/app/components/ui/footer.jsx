"use client";

import Link from "next/link";
import {
  FaFacebook,
  FaInstagram,
  FaWhatsapp,
} from "react-icons/fa";

import Image from "next/image";
import logo from "@/app/assets/pictures/logo.webp"
import { scrollToSection } from "@/lib/utils";

const navLinks = [
  {
    label: "الرئيسية",
    href: "/",
  },
  {
    label: "التصنيفات",
    href: "/#categories",
  },
  {
    label: "المنتجات",
    href: "/#products",
  },
  {
    label: "العروض",
    href: "/#offers",
  },
];

const socialLinks = [
  {
    label: "Facebook",
    href: "https://www.facebook.com/elboutiqa",
    icon: FaFacebook,
    className:
      "hover:bg-facebook hover:border-facebook",
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/el_boutiqa",
    icon: FaInstagram,
    className:
      "hover:bg-instagram hover:border-instagram",
  },
  {
    label: "WhatsApp",
    href: "https://wa.me/213660184286",
    icon: FaWhatsapp,
    className:
      "hover:bg-whatsapp hover:border-whatsapp",
  },
];

export default function Footer() {
  return (
    <footer
    id="footer"
      dir="rtl"
      className="border-t border-border bg-primary text-white mt-15 sm:mt-25"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">

        {/* Main Footer */}
        <div className="grid gap-12 py-14 md:grid-cols-3 md:items-center">

          {/* Store */}
          <div className="text-center md:text-right flex flex-col items-center">
        <div className="flex items-center gap-1.5">
             <Image src={logo}  alt="" className="w-10 h-10 " />
            <Link
              href="/"
              onClick={(e) => scrollToSection(e, "/")}
              className="
                inline-block
                text-3xl font-black
                tracking-tight
                transition-opacity
                hover:opacity-80
              "
            >
              elboutiqa
            </Link>
        </div>
           

            <p
              className="
                mx-auto mt-4 max-w-sm
                font-cairo
                text-md leading-7
                text-white opacity-60
                md:mx-0 text-center
              "
            >
              متجرك الإلكتروني في الجزائر،
              نوفر لك منتجات مختارة مع خدمة
              التوصيل والدفع عند الاستلام.
            </p>
          </div>

          {/* Navigation */}
          <div className="text-center">
            <h3 className="mb-3 font-cairo text-md font-bold">
              روابط سريعة
            </h3>

            <nav
              className="
                flex flex-wrap
                items-center justify-center
                gap-x-7 gap-y-3
                font-cairo text-md
              "
            >
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={(e) => scrollToSection(e, link.href)}
                  className="
                    text-white opacity-65
                    transition-colors font-bold
                    hover:text-secondary
                  "
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Social Media */}
          <div className="flex flex-col justify-center items-center md:text-left">
            <h3 className="mb-3 font-cairo text-md font-bold">
              تابعنا على
            </h3>

            <div className="flex justify-center gap-3 md:justify-start">
              {socialLinks.map((social) => {
                const Icon = social.icon;

                return (
                  <a
                    key={social.label}
                    href={social.href}
                    aria-label={social.label}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`
                      flex h-11 w-11
                      items-center justify-center
                      rounded-full
                      border border-white/10
                      bg-white/5
                      text-white/70
                      transition-all duration-200
                      hover:text-white
                      ${social.className}
                    `}
                  >
                    <Icon size={19} />
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-white/10" />

        {/* Bottom */}
        <div
          className="
            w-full
            py-6
            text-center
          "
        >
          <p className="font-cairo text-sm text-white opacity-40">
            © 2026 elboutiqa. جميع الحقوق محفوظة.
          </p>

          
        </div>

      </div>
    </footer>
  );
}
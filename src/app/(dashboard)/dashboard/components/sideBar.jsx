"use client";

import Link from "next/link";
import {
  LayoutDashboard,
  Package,
  Tags,
  ShoppingCart,
  Settings,
  Cable,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { CustomTrigger } from "./CustomTrigger";
import logo from "@/app/assets/pictures/logo.webp";
import Image from "next/image";

const items = [
  {
    title: "accueil",
    url: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "category",
    url: "/dashboard/category",
    icon: Tags,
  },
  {
    title: "products",
    url: "/dashboard/products",
    icon: Package,
  },
  {
    title: "orders",
    url: "/dashboard/orders",
    icon: ShoppingCart,
  },
];

export function AppSidebar() {
  const { open, openMobile, isMobile, setOpenMobile } = useSidebar();
  const isOpen = isMobile ? openMobile : open;

  const handleLinkClick = () => {
    if (isMobile) {
      setOpenMobile(false);
    }
  };

  return (
    <Sidebar
      side="left"
      className="py-4 z-50 min-w-20 border-r-[1px] border-r-text-muted/10 bg-background"
      collapsible="icon"
    >
      <SidebarHeader className="flex justify-center gap-15 items-center flex-row-reverse mb-3">
        <CustomTrigger />

        {!isOpen && (
          <Image
            src={logo}
            className="w-10 h-auto object-cover absolute top-7 right-0 left-0 mx-auto"
            alt="logo"
          />
        )}
        <div
          className={`flex relative justify-center items-center flex-col ${
            isOpen ? "block" : "hidden"
          }`}
        >
          <div className="flex justify-center items-center flex-row gap-1">
            <Image src={logo} className="w-10 h-auto object-cover" alt="logo" />
            <h1 className="text-primary font-alexandria font-extrabold text-xl">
              elboutiqa
            </h1>
          </div>
          <h2 className="text-lg absolute -bottom-5 left-10 md:left-auto md:-right-25 font-semibold text-text-muted w-full">
            Dashboard
          </h2>
        </div>
      </SidebarHeader>

      <SidebarContent>
        {!isOpen && (
          <div className="h-[1px] w-[50%] bg-text-muted mx-auto rounded-full opacity-40"></div>
        )}

        {/* Menu principal */}
        <SidebarGroup className="flex items-center justify-center mb-2">
          <SidebarGroupLabel className="w-full">
            <h1 className="text-sm font-alexandria text-primary w-full text-start opacity-60">
              Menu principal
            </h1>
          </SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu
              className={`h-fit flex ${
                isOpen ? "items-start" : "items-center"
              } gap-2`}
            >
              {items.map((item) => (
                <SidebarMenuItem key={item.title} className="w-full">
                  <SidebarMenuButton
                    asChild
                    tooltip={item.title}
                    className="flex justify-start w-full mx-auto items-center p-5 text-xl lowercase bg-background text-text-muted active:text-text active:bg-primary/10 hover:text-text hover:bg-primary/10 rounded-lg transition-all duration-200"
                  >
                    <Link href={item.url} onClick={handleLinkClick}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <div className="h-[1px] w-[50%] bg-text-muted mx-auto rounded-full opacity-40"></div>

        {/* Others */}
        <SidebarGroup className="flex items-center justify-center">
          <SidebarGroupLabel className="w-full">
            <h1 className="text-sm font-alexandria text-primary w-full text-start opacity-60">
              Others
            </h1>
          </SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu
              className={`h-fit w-full flex ${
                isOpen ? "items-start" : "items-center"
              } gap-2`}
            >
              <SidebarMenuItem key="meta pixel" className="w-full">
                <SidebarMenuButton
                  asChild
                  tooltip="meta pixel"
                  className="flex justify-start w-full mx-auto items-center p-5 text-xl lowercase bg-background text-text-muted active:text-text active:bg-primary/10 hover:text-text hover:bg-primary/10 rounded-lg transition-all duration-200"
                >
                  <Link href="/dashboard/metaPixel" onClick={handleLinkClick}>
                    <Cable />
                    <span>meta pixel</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              tooltip="setting"
              className="w-fit flex justify-center mx-auto mb-5 text-text-muted text-xl"
            >
              <Link href="/dashboard/settings" onClick={handleLinkClick}>
                <Settings />
                <span>settings</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
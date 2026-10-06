import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { CustomTrigger } from "./components/CustomTrigger";
import { AppSidebar } from "./components/sideBar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";
import logo from "@/app/assets/pictures/logo.webp";
import Image from "next/image";
import Link from "next/link";
export default function DashBoardLayout({ children }) {
  return (
    <div dir="ltr" className="min-h-screen w-full">
      <TooltipProvider>
        <SidebarProvider>
          <AppSidebar />
          <SidebarInset className="min-h-screen flex-1">
            {/* Header avec bouton pour ouvrir la sidebar sur mobile */}
            <header className="flex md:hidden items-center  justify-between px-4 py-3 border-b border-border bg-background sticky top-0 z-40 w-full shadow-xs">
             
                <CustomTrigger className={"!mt-0"}/>
             

              <Link href="/dashboard" className="font-alexandria font-extrabold text-text-muted opacity-70">DASHBOARD</Link>

              <div className="flex items-center gap-2">
                  <Image src={logo} alt="logo" className="w-7 h-auto object-cover" />
                </div>
            </header>

            <main className="flex-1 flex justify-center items-center   px-3  md:ml-7  ml-0 pt-5 sm:pt-7">
              {children}
            </main>
          </SidebarInset>
        </SidebarProvider>
      </TooltipProvider>

      <Toaster />
    </div>
  );
}

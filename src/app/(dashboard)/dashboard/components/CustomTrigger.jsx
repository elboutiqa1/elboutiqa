"use client";

import { useSidebar } from "@/components/ui/sidebar";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";

export function CustomTrigger({className=""}) {
  const { toggleSidebar, open, openMobile, isMobile } = useSidebar();
  const isOpen = isMobile ? openMobile : open;

  return (
    <button
      type="button"
      onClick={toggleSidebar}
      className={`${isOpen ? "" :`mt-20 ${className} cursor-pointer`}`}
      title={isOpen ? "Fermer le menu" : "Ouvrir le menu"}
    >
      {isOpen ? (
        <PanelLeftClose
          strokeWidth={1.5}
          size={25}
          className="text-text-muted opacity-60 hover:text-text cursor-pointer transition-all duration-200"
        />
      ) : (
        <PanelLeftOpen
          strokeWidth={1.5}
          size={25}
          className="text-text-muted opacity-60 hover:text-text cursor-pointer transition-all duration-200"
        />
      )}
    </button>
  );
}
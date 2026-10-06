"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

import { Tooltip as TooltipPrimitive } from "radix-ui";

function TooltipProvider({
  delayDuration = 0,
  ...props
}) {
  return (
    <TooltipPrimitive.Provider
      data-slot="tooltip-provider"
      delayDuration={delayDuration}
      {...props}
    />
  );
}

function Tooltip({
  ...props
}) {
  return (
    <TooltipPrimitive.Root
      data-slot="tooltip"
      {...props}
    />
  );
}

function TooltipTrigger({
  ...props
}) {
  return (
    <TooltipPrimitive.Trigger
      data-slot="tooltip-trigger"
      {...props}
    />
  );
}

function TooltipContent({
  className,
  sideOffset = 8,
  children,
  ...props
}) {
  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Content
        data-slot="tooltip-content"
        sideOffset={sideOffset}
        className={cn(
          "z-50 inline-flex w-fit max-w-xs items-center gap-1.5 rounded-xl bg-primary px-3 py-2 !text-md text-background shadow-md",
          "origin-(--radix-tooltip-content-transform-origin)",
          "data-[side=bottom]:slide-in-from-top-2",
          "data-[side=left]:slide-in-from-right-2",
          "data-[side=right]:slide-in-from-left-2",
          "data-[side=top]:slide-in-from-bottom-2",
          "data-[state=delayed-open]:animate-in",
          "data-[state=delayed-open]:fade-in-0",
          "data-[state=delayed-open]:zoom-in-95",
          "data-open:animate-in",
          "data-open:fade-in-0",
          "data-open:zoom-in-95",
          "data-closed:animate-out",
          "data-closed:fade-out-0",
          "data-closed:zoom-out-95",
          className
        )}
        {...props}
      >
        {children}

        <TooltipPrimitive.Arrow
          className="fill-primary"
          width={10}
          height={5}
        />
      </TooltipPrimitive.Content>
    </TooltipPrimitive.Portal>
  );
}

export {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
};
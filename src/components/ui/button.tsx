"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "./tooltip";

const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 cursor-pointer",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline:
          "border border-input bg-card shadow-sm hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        success: "bg-green-500 text-white shadow-sm hover:bg-green-600",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  title?: string;
  side?: "top" | "right" | "bottom" | "left";
  shiny?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      title,
      side,
      variant,
      size,
      asChild = false,
      shiny = false,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "button";

    // Shiny Button (static gradient, no framer motion)
    if (shiny) {
      const shinyButton = (
        <button
          ref={ref}
          {...props}
          className={cn(
            "relative rounded-lg font-medium backdrop-blur-xl transition-shadow duration-300 ease-in-out hover:shadow bg-[radial-gradient(circle_at_50%_0%,hsl(var(--primary)/10%)_0%,transparent_60%)] dark:hover:shadow-[0_0_20px_hsl(var(--primary)/10%)] disabled:opacity-50 disabled:cursor-not-allowed text-primary border border-primary",
            buttonVariants({ variant, size, className })
          )}
        >
          <span className="relative flex items-center justify-center gap-2 size-full text-sm tracking-wide text-primary font-medium">
            {props.children as React.ReactNode}
          </span>
        </button>
      );

      return title && !isMobile ? (
        <TooltipProvider delayDuration={100}>
          <Tooltip>
            <TooltipTrigger asChild>{shinyButton}</TooltipTrigger>
            <TooltipContent
              className="z-50 overflow-hidden rounded-md bg-accent px-3 py-1.5 text-xs text-accent-foreground border border-border"
              side={side}
            >
              {title}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ) : (
        shinyButton
      );
    }

    // Regular Button
    const btnElement = (
      <Comp
        tabIndex={0}
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );

    return title && !isMobile ? (
      <TooltipProvider delayDuration={100}>
        <Tooltip>
          <TooltipTrigger asChild>{btnElement}</TooltipTrigger>
          <TooltipContent
            className="z-50 overflow-hidden rounded-md bg-accent px-3 py-1.5 text-xs text-accent-foreground border border-border"
            side={side}
          >
            {title}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    ) : (
      btnElement
    );
  }
);

Button.displayName = "Button";

export { Button, buttonVariants };

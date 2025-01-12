"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";
import { motion, type AnimationProps } from "framer-motion";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "./tooltip";

import type { HTMLMotionProps } from "framer-motion";

const isMobile = window.innerWidth < 768;

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
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

const shinyAnimationProps = {
  initial: { "--x": "100%", scale: 0.8 },
  animate: { "--x": "-100%", scale: 1 },
  whileTap: { scale: 0.95 },
  transition: {
    repeat: Infinity,
    repeatType: "loop",
    repeatDelay: 1,
    type: "spring",
    stiffness: 20,
    damping: 15,
    mass: 2,
    scale: {
      type: "spring",
      stiffness: 200,
      damping: 5,
      mass: 0.5,
    },
  },
} as AnimationProps;

export interface ButtonProps
  extends Omit<HTMLMotionProps<"button">, "ref">,
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

    // Shiny Button Logic
    if (shiny) {
      const shinyButton = (
        <motion.button
          ref={ref}
          {...shinyAnimationProps}
          {...props}
          className={cn(
            "relative rounded-lg font-medium backdrop-blur-xl transition-shadow duration-300 ease-in-out hover:shadow dark:bg-[radial-gradient(circle_at_50%_0%,hsl(var(--primary)/10%)_0%,transparent_60%)] dark:hover:shadow-[0_0_20px_hsl(var(--primary)/10%)] disabled:opacity-50 disabled:cursor-not-allowed",
            buttonVariants({ variant, size, className })
          )}
        >
          <span
            className="relative flex items-center justify-center gap-2 size-full text-sm  tracking-wide text-[rgb(0,0,0,65%)] dark:font-normal dark:text-[rgb(255,255,255,90%)]"
            style={{
              maskImage:
                "linear-gradient(-75deg,hsl(var(--primary)) calc(var(--x) + 20%),transparent calc(var(--x) + 30%),hsl(var(--primary)) calc(var(--x) + 100%))",
            }}
          >
            {props.children as React.ReactNode}
          </span>
          <span
            style={{
              mask: "linear-gradient(rgb(0,0,0), rgb(0,0,0)) content-box,linear-gradient(rgb(0,0,0), rgb(0,0,0))",
              maskComposite: "exclude",
            }}
            className="absolute inset-0 z-10 block rounded-[inherit] bg-[linear-gradient(-75deg,hsl(var(--primary)/10%)_calc(var(--x)+20%),hsl(var(--primary)/50%)_calc(var(--x)+25%),hsl(var(--primary)/10%)_calc(var(--x)+100%))] p-px"
          ></span>
        </motion.button>
      );

      return title && !isMobile ? (
        <TooltipProvider delayDuration={100}>
          <Tooltip>
            <TooltipTrigger asChild>{shinyButton}</TooltipTrigger>
            <TooltipContent
              className="bg-primary-foreground text-primary rounded-md text-xs border border-border capitalize"
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

    // Regular Button Logic
    const btnElement = (
      <Comp
        tabIndex={0}
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...(props as React.ButtonHTMLAttributes<HTMLButtonElement>)}
      />
    );

    return title && !isMobile ? (
      <TooltipProvider delayDuration={100}>
        <Tooltip>
          <TooltipTrigger asChild>{btnElement}</TooltipTrigger>
          <TooltipContent
            className="bg-primary text-primary-foreground rounded-md text-xs capitalize"
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

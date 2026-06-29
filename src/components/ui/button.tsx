import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-semibold tracking-wide transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/60 focus-visible:ring-offset-2 focus-visible:ring-offset-ink disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-4 [&_svg]:shrink-0 cursor-pointer",
  {
    variants: {
      variant: {
        primary:
          "bg-gradient-to-r from-gold-soft via-gold to-gold text-navy shadow-[0_8px_30px_-6px_rgba(245,183,0,0.6)] hover:shadow-[0_10px_44px_-6px_rgba(245,183,0,0.8)] hover:-translate-y-0.5",
        electric:
          "bg-gradient-to-r from-electric-soft to-electric text-navy shadow-[0_8px_30px_-6px_rgba(0,194,255,0.6)] hover:shadow-[0_10px_44px_-6px_rgba(0,194,255,0.85)] hover:-translate-y-0.5",
        outline:
          "border border-white/15 bg-white/5 text-white backdrop-blur-md hover:border-gold/50 hover:bg-white/10 hover:-translate-y-0.5",
        ghost: "text-white/80 hover:text-white hover:bg-white/5",
      },
      size: {
        default: "h-11 px-6",
        lg: "h-13 px-8 text-base",
        sm: "h-9 px-4 text-xs",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };

import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"
import { motion } from "framer-motion"

import { cn } from "@/lib/utils"
import { EASING } from "@/constants/animations-easing"

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-4xl border border-transparent bg-clip-padding text-base font-medium whitespace-nowrap transition-[opacity,box-shadow,colors] outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30 disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:opacity-50 shadow-[0_0px_24px_4px_rgba(0,0,0,0.08)]",
        secondary:
          "bg-secondary text-secondary-foreground hover:opacity-50 aria-expanded:bg-secondary aria-expanded:text-secondary-foreground shadow-[0_0px_24px_4px_rgba(0,0,0,0.04)]",
        monochrome: "bg-selection-background text-selection-foreground shadow-[0_0px_24px_4px_rgba(0,0,0,0.08)]"
      },
      size: {
        default:
          "h-11 gap-1.5 px-6 has-data-[icon=inline-end]:pr-5.5 has-data-[icon=inline-start]:pl-5.5",
        xs: "h-6 gap-1 px-2.5 text-xs has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-8 gap-1 px-3 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2",
        lg: "h-10 gap-1.5 px-4 has-data-[icon=inline-end]:pr-3 has-data-[icon=inline-start]:pl-3",
        icon: "size-9",
        "icon-xs": "size-6 [&_svg:not([class*='size-'])]:size-3",
        "icon-sm": "size-8",
        "icon-lg": "size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

const MotionButtonPrimitive = motion.create(ButtonPrimitive)

export interface ButtonProps
  extends React.ComponentProps<typeof MotionButtonPrimitive>,
    VariantProps<typeof buttonVariants> {}

function Button({
  className,
  variant = "default",
  size = "default",
  ref,
  ...props
}: ButtonProps) {
  return (
    <MotionButtonPrimitive
      ref={ref}
      data-slot="button"
      transition={props.transition ? props.transition : EASING.springy}
      whileTap={{ scale: 0.95 }}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }